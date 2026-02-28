"""Tests for WebSocket audio handling."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.stt.engine import TranscriptionResult, WordTimestamp
from app.tts.engine import TTSResult


FAKE_WAV = b"RIFF" + b"\x00" * 40


@pytest.fixture
def client():
    return TestClient(app)


def _mock_provider():
    provider = AsyncMock()
    provider.provider_name = "mock"
    provider.model = "mock-model"
    response = MagicMock()
    response.content = "Sehr gut!"
    response.provider = "mock"
    response.model = "mock-model"
    provider.chat.return_value = response

    async def _stream_chat(*args, **kwargs):
        yield "Sehr gut!"

    provider.stream_chat = _stream_chat
    return provider


def _mock_transcription():
    return TranscriptionResult(
        text="Hallo Welt",
        language="de",
        words=[
            WordTimestamp(word="Hallo", start=0.0, end=0.5, probability=0.95),
            WordTimestamp(word="Welt", start=0.6, end=1.0, probability=0.42),
        ],
        duration=1.0,
    )


def _mock_tts_synthesize(text):
    return TTSResult(audio_data=FAKE_WAV, sample_rate=22050, format="wav")


class TestWebSocketAudio:
    """Test audio start + binary data flow."""

    def test_audio_start_and_binary_flow(self, client):
        mock_engine = MagicMock()
        mock_engine.transcribe.return_value = _mock_transcription()
        # "Welt" has probability 0.42, so it triggers IPA
        mock_engine.get_low_confidence_words.return_value = [
            WordTimestamp(word="Welt", start=0.6, end=1.0, probability=0.42),
        ]

        with (
            patch("app.ws.handler.create_provider", return_value=_mock_provider()),
            patch("app.stt.engine.STTEngine", return_value=mock_engine),
            patch("app.tts.engine.TTSEngine.synthesize", side_effect=_mock_tts_synthesize),
            patch.object(
                __import__("app.ws.handler", fromlist=["ConversationHandler"]).ConversationHandler,
                "_get_stt_engine",
                return_value=mock_engine,
            ),
        ):
            with client.websocket_connect("/ws/conversation") as ws:
                # Send audio_start signal
                ws.send_json({"type": "audio_start", "format": "webm"})

                # Send binary audio data
                ws.send_bytes(b"\x00\x01\x02\x03fake-audio-data")

                # First response: transcription
                transcription = ws.receive_json()
                assert transcription["type"] == "transcription"
                assert transcription["text"] == "Hallo Welt"
                assert len(transcription["words"]) == 2
                assert transcription["words"][0]["word"] == "Hallo"

                # Second: IPA errors (low-confidence "Welt")
                ipa = ws.receive_json()
                assert ipa["type"] == "ipa"

                # Third: LLM streaming chunk
                chunk = ws.receive_json()
                assert chunk["type"] == "response_chunk"
                assert chunk["content"] == "Sehr gut!"

                # Fourth: tts_audio header + binary
                tts = ws.receive_json()
                assert tts["type"] == "tts_audio"
                assert tts["format"] == "wav"
                audio_bytes = ws.receive_bytes()
                assert audio_bytes == FAKE_WAV

                # Fifth: LLM response end
                end = ws.receive_json()
                assert end["type"] == "response_end"
                assert end["content"] == "Sehr gut!"

    def test_text_messages_still_work_alongside_audio(self, client):
        with (
            patch("app.ws.handler.create_provider", return_value=_mock_provider()),
            patch("app.tts.engine.TTSEngine.synthesize", side_effect=_mock_tts_synthesize),
        ):
            with client.websocket_connect("/ws/conversation") as ws:
                # Text message still works
                ws.send_json({"type": "message", "content": "Hallo"})
                chunk = ws.receive_json()
                assert chunk["type"] == "response_chunk"
                tts = ws.receive_json()
                assert tts["type"] == "tts_audio"
                ws.receive_bytes()  # audio binary
                end = ws.receive_json()
                assert end["type"] == "response_end"

    def test_unexpected_binary_without_audio_start(self, client):
        with client.websocket_connect("/ws/conversation") as ws:
            ws.send_bytes(b"\x00\x01\x02\x03")
            data = ws.receive_json()
            assert data["type"] == "error"
            assert "Unexpected binary data" in data["detail"]

    def test_transcription_result_format(self, client):
        mock_engine = MagicMock()
        mock_engine.transcribe.return_value = _mock_transcription()

        with (
            patch("app.ws.handler.create_provider", return_value=_mock_provider()),
            patch.object(
                __import__("app.ws.handler", fromlist=["ConversationHandler"]).ConversationHandler,
                "_get_stt_engine",
                return_value=mock_engine,
            ),
        ):
            with client.websocket_connect("/ws/conversation") as ws:
                ws.send_json({"type": "audio_start", "format": "webm"})
                ws.send_bytes(b"fake-audio")

                data = ws.receive_json()
                assert data["type"] == "transcription"
                assert isinstance(data["words"], list)
                word = data["words"][0]
                assert "word" in word
                assert "start" in word
                assert "end" in word
                assert "probability" in word
