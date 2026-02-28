"""WebSocket handler for streaming conversation."""

import asyncio
import json
import logging
import tempfile
from pathlib import Path

from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger("uvicorn.error")

from app.llm.base import ChatMessage
from app.llm.factory import create_provider
from app.ipa.engine import compare_pronunciation


class ConversationHandler:
    """Handles a WebSocket conversation session.

    Protocol:
    - Client sends JSON: {"type": "message", "content": "...", "provider": "deepseek"}
    - Client sends JSON: {"type": "audio_start", "format": "webm"}
    - Client sends binary: raw audio bytes (after audio_start)
    - Client sends JSON: {"type": "config", "system_prompt": "...", "tts_enabled": bool, "tts_voice": "..."}
    - Client sends JSON: {"type": "tts_config", "tts_enabled": bool, "tts_voice": "..."}
    - Client sends JSON: {"type": "ping"}
    - Server sends JSON: {"type": "response_chunk", "content": "..."}  (streaming token)
    - Server sends JSON: {"type": "tts_audio", "size": N, "format": "wav"}  (header before binary)
    - Server sends binary: WAV audio bytes (after tts_audio header)
    - Server sends JSON: {"type": "response_end", "content": "...", "provider": "...", "model": "..."}
    - Server sends JSON: {"type": "transcription", "text": "...", "words": [...]}
    - Server sends JSON: {"type": "ipa", "messageId": "...", "errors": [...]}
    - Server sends JSON: {"type": "error", "detail": "..."}
    """

    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.messages: list[ChatMessage] = []
        self.system_prompt = (
            "Du bist ein freundlicher Deutsch-Lehrer. "
            "Sprich immer auf Deutsch. Passe dein Niveau an den Schüler an. "
            "Korrigiere Fehler sanft und ermutige den Schüler."
        )
        self.messages.append(ChatMessage(role="system", content=self.system_prompt))
        self._stt_engine = None
        self._tts_engine = None
        self._tts_enabled = True
        self._tts_voice = "de_DE-thorsten-high"
        self._awaiting_audio = False
        self._audio_format = "webm"

    def _get_stt_engine(self):
        """Lazy-init the STT engine."""
        if self._stt_engine is None:
            from app.stt.engine import STTEngine
            self._stt_engine = STTEngine()
        return self._stt_engine

    def _get_tts_engine(self):
        """Lazy-init the TTS engine with current voice."""
        if self._tts_engine is None or self._tts_engine.voice != self._tts_voice:
            from app.tts.engine import TTSEngine
            self._tts_engine = TTSEngine(voice=self._tts_voice)
        return self._tts_engine

    async def _synthesize_and_send(self, text: str):
        """Synthesize text to speech and send as binary via WebSocket."""
        try:
            engine = self._get_tts_engine()
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, engine.synthesize, text)
            await self.websocket.send_json({
                "type": "tts_audio",
                "size": len(result.audio_data),
                "format": result.format,
            })
            await self.websocket.send_bytes(result.audio_data)
        except Exception as e:
            logger.warning("TTS synthesis failed: %s", e)

    async def handle(self):
        """Main WebSocket loop."""
        try:
            await self.websocket.accept()
        except Exception as e:
            logger.error("WebSocket accept failed: %s", e)
            return

        try:
            while True:
                message = await self.websocket.receive()

                # Starlette disconnect signal
                if message.get("type") == "websocket.disconnect":
                    break

                if "text" in message:
                    raw = message["text"]
                    try:
                        data = json.loads(raw)
                    except json.JSONDecodeError:
                        await self.websocket.send_json({
                            "type": "error",
                            "detail": "Invalid JSON",
                        })
                        continue

                    msg_type = data.get("type")

                    if msg_type == "message":
                        await self._handle_text_message(data)
                    elif msg_type == "config":
                        await self._handle_config(data)
                    elif msg_type == "tts_config":
                        await self._handle_tts_config(data)
                    elif msg_type == "audio_start":
                        self._awaiting_audio = True
                        self._audio_format = data.get("format", "webm")
                    elif msg_type == "ping":
                        await self.websocket.send_json({"type": "pong"})
                    else:
                        await self.websocket.send_json({
                            "type": "error",
                            "detail": f"Unknown message type: {msg_type}",
                        })

                elif "bytes" in message:
                    if self._awaiting_audio:
                        self._awaiting_audio = False
                        await self._handle_audio(message["bytes"])
                    else:
                        await self.websocket.send_json({
                            "type": "error",
                            "detail": "Unexpected binary data",
                        })

        except WebSocketDisconnect:
            pass

    async def _handle_text_message(self, data: dict):
        """Process a text message from the user, streaming the LLM response."""
        content = data.get("content", "")
        provider_name = data.get("provider")

        self.messages.append(ChatMessage(role="user", content=content))

        try:
            provider = create_provider(provider_name)
            full_response = ""
            sentence_buffer = ""
            async for token in provider.stream_chat(self.messages):
                full_response += token
                sentence_buffer += token
                await self.websocket.send_json({
                    "type": "response_chunk",
                    "content": token,
                })
                stripped = sentence_buffer.strip()
                if stripped and stripped[-1] in ".!?":
                    if self._tts_enabled:
                        await self._synthesize_and_send(stripped)
                    sentence_buffer = ""

            # Flush remaining text as final TTS
            if sentence_buffer.strip():
                if self._tts_enabled:
                    await self._synthesize_and_send(sentence_buffer.strip())

            self.messages.append(ChatMessage(role="assistant", content=full_response))
            await self.websocket.send_json({
                "type": "response_end",
                "content": full_response,
                "provider": provider.provider_name,
                "model": provider.model,
            })
        except Exception as e:
            await self.websocket.send_json({
                "type": "error",
                "detail": str(e),
            })

    async def _handle_config(self, data: dict):
        """Handle configuration updates (e.g., system prompt, level, TTS settings)."""
        if "system_prompt" in data:
            self.system_prompt = data["system_prompt"]
            self.messages[0] = ChatMessage(role="system", content=self.system_prompt)
        if "tts_enabled" in data:
            self._tts_enabled = bool(data["tts_enabled"])
        if "tts_voice" in data:
            self._tts_voice = data["tts_voice"]

        await self.websocket.send_json({"type": "config_ack"})

    async def _handle_tts_config(self, data: dict):
        """Handle mid-session TTS configuration changes."""
        if "tts_enabled" in data:
            self._tts_enabled = bool(data["tts_enabled"])
        if "tts_voice" in data:
            self._tts_voice = data["tts_voice"]

        await self.websocket.send_json({"type": "config_ack"})

    async def _handle_audio(self, audio_bytes: bytes):
        """Process audio data: write to tempfile, transcribe via STT, pipe to LLM."""
        suffix = f".{self._audio_format}"
        tmp_path = None
        logger.info("Audio received: %d bytes, format=%s", len(audio_bytes), self._audio_format)

        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name

            logger.info("Loading STT engine...")
            engine = self._get_stt_engine()
            logger.info("Transcribing audio...")
            result = engine.transcribe(tmp_path, language="de")
            logger.info("Transcription: %r (%d words)", result.text, len(result.words))

            # Send transcription back to client
            await self.websocket.send_json({
                "type": "transcription",
                "text": result.text,
                "words": [
                    {
                        "word": w.word,
                        "start": w.start,
                        "end": w.end,
                        "probability": w.probability,
                    }
                    for w in result.words
                ],
            })

            # IPA analysis on low-confidence words
            low_conf = engine.get_low_confidence_words(result, threshold=0.7)
            if low_conf:
                errors = []
                for i, lc_word in enumerate(low_conf):
                    comparison = compare_pronunciation(
                        lc_word.word, lc_word.word, "de"
                    )
                    if lc_word.probability > 0.5:
                        severity = "minor"
                    elif lc_word.probability > 0.3:
                        severity = "moderate"
                    else:
                        severity = "severe"

                    # Find word position in the full text
                    text_words = result.text.split()
                    word_pos = next(
                        (j for j, w in enumerate(text_words) if w == lc_word.word),
                        i,
                    )

                    errors.append({
                        "word": lc_word.word,
                        "wordPosition": word_pos,
                        "spokenIPA": comparison["spoken_ipa"],
                        "correctIPA": comparison["correct_ipa"],
                        "explanation": f"Confidence: {lc_word.probability:.0%}",
                        "severity": severity,
                    })

                await self.websocket.send_json({
                    "type": "ipa",
                    "messageId": "",  # Frontend correlates by last user message
                    "errors": errors,
                })

            # Pipe transcribed text through LLM
            if result.text.strip():
                logger.info("Sending transcription to LLM...")
                await self._handle_text_message({
                    "content": result.text,
                    "provider": None,
                })
                logger.info("LLM response sent")
            else:
                logger.warning("Empty transcription, skipping LLM")

        except Exception as e:
            logger.error("Audio processing error: %s", e, exc_info=True)
            await self.websocket.send_json({
                "type": "error",
                "detail": f"Audio processing error: {e}",
            })
        finally:
            if tmp_path:
                Path(tmp_path).unlink(missing_ok=True)
