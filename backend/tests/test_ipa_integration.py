"""Tests for IPA analysis integration in the WebSocket pipeline."""

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
    response.content = "Gut gemacht!"
    response.provider = "mock"
    response.model = "mock-model"
    provider.chat.return_value = response

    async def _stream_chat(*args, **kwargs):
        yield "Gut gemacht!"

    provider.stream_chat = _stream_chat
    return provider


def _mock_tts_synthesize(text):
    return TTSResult(audio_data=FAKE_WAV, sample_rate=22050, format="wav")


def _mock_transcription_with_low_confidence():
    """Transcription with one low-confidence word to trigger IPA."""
    return TranscriptionResult(
        text="Ich gehe",
        language="de",
        words=[
            WordTimestamp(word="Ich", start=0.0, end=0.3, probability=0.95),
            WordTimestamp(word="gehe", start=0.4, end=0.8, probability=0.42),
        ],
        duration=0.8,
    )


def _mock_transcription_all_high_confidence():
    """Transcription with all high-confidence words (no IPA errors)."""
    return TranscriptionResult(
        text="Hallo Welt",
        language="de",
        words=[
            WordTimestamp(word="Hallo", start=0.0, end=0.5, probability=0.95),
            WordTimestamp(word="Welt", start=0.6, end=1.0, probability=0.92),
        ],
        duration=1.0,
    )


class TestIPAIntegration:
    """Test IPA analysis triggered by low-confidence STT words."""

    def test_low_confidence_word_triggers_ipa(self, client):
        mock_engine = MagicMock()
        mock_engine.transcribe.return_value = _mock_transcription_with_low_confidence()
        mock_engine.get_low_confidence_words.return_value = [
            WordTimestamp(word="gehe", start=0.4, end=0.8, probability=0.42),
        ]

        with (
            patch("app.ws.handler.create_provider", return_value=_mock_provider()),
            patch("app.tts.engine.TTSEngine.synthesize", side_effect=_mock_tts_synthesize),
            patch.object(
                __import__("app.ws.handler", fromlist=["ConversationHandler"]).ConversationHandler,
                "_get_stt_engine",
                return_value=mock_engine,
            ),
        ):
            with client.websocket_connect("/ws/conversation") as ws:
                ws.send_json({"type": "audio_start", "format": "webm"})
                ws.send_bytes(b"fake-audio")

                # 1st: transcription
                transcription = ws.receive_json()
                assert transcription["type"] == "transcription"

                # 2nd: IPA errors
                ipa = ws.receive_json()
                assert ipa["type"] == "ipa"
                assert len(ipa["errors"]) == 1
                error = ipa["errors"][0]
                assert error["word"] == "gehe"
                assert error["severity"] == "moderate"
                assert "wordPosition" in error
                assert "spokenIPA" in error
                assert "correctIPA" in error

                # 3rd: LLM streaming chunk
                chunk = ws.receive_json()
                assert chunk["type"] == "response_chunk"

                # 4th: tts_audio + binary
                tts = ws.receive_json()
                assert tts["type"] == "tts_audio"
                ws.receive_bytes()

                # 5th: LLM response end
                end = ws.receive_json()
                assert end["type"] == "response_end"

    def test_high_confidence_no_ipa_errors(self, client):
        mock_engine = MagicMock()
        mock_engine.transcribe.return_value = _mock_transcription_all_high_confidence()
        mock_engine.get_low_confidence_words.return_value = []

        with (
            patch("app.ws.handler.create_provider", return_value=_mock_provider()),
            patch("app.tts.engine.TTSEngine.synthesize", side_effect=_mock_tts_synthesize),
            patch.object(
                __import__("app.ws.handler", fromlist=["ConversationHandler"]).ConversationHandler,
                "_get_stt_engine",
                return_value=mock_engine,
            ),
        ):
            with client.websocket_connect("/ws/conversation") as ws:
                ws.send_json({"type": "audio_start", "format": "webm"})
                ws.send_bytes(b"fake-audio")

                # 1st: transcription
                transcription = ws.receive_json()
                assert transcription["type"] == "transcription"

                # 2nd: LLM streaming chunk (no IPA message)
                chunk = ws.receive_json()
                assert chunk["type"] == "response_chunk"

                # 3rd: tts_audio + binary
                tts = ws.receive_json()
                assert tts["type"] == "tts_audio"
                ws.receive_bytes()

                # 4th: LLM response end
                end = ws.receive_json()
                assert end["type"] == "response_end"

    def test_ipa_error_severity_levels(self, client):
        """Test that severity is computed correctly from confidence."""
        mock_engine = MagicMock()
        mock_engine.transcribe.return_value = TranscriptionResult(
            text="eins zwei drei",
            language="de",
            words=[
                WordTimestamp(word="eins", start=0.0, end=0.3, probability=0.60),
                WordTimestamp(word="zwei", start=0.4, end=0.7, probability=0.35),
                WordTimestamp(word="drei", start=0.8, end=1.0, probability=0.15),
            ],
            duration=1.0,
        )
        mock_engine.get_low_confidence_words.return_value = [
            WordTimestamp(word="eins", start=0.0, end=0.3, probability=0.60),
            WordTimestamp(word="zwei", start=0.4, end=0.7, probability=0.35),
            WordTimestamp(word="drei", start=0.8, end=1.0, probability=0.15),
        ]

        with (
            patch("app.ws.handler.create_provider", return_value=_mock_provider()),
            patch("app.tts.engine.TTSEngine.synthesize", side_effect=_mock_tts_synthesize),
            patch.object(
                __import__("app.ws.handler", fromlist=["ConversationHandler"]).ConversationHandler,
                "_get_stt_engine",
                return_value=mock_engine,
            ),
        ):
            with client.websocket_connect("/ws/conversation") as ws:
                ws.send_json({"type": "audio_start", "format": "webm"})
                ws.send_bytes(b"fake-audio")

                ws.receive_json()  # transcription
                ipa = ws.receive_json()

                assert ipa["type"] == "ipa"
                severities = [e["severity"] for e in ipa["errors"]]
                assert severities == ["minor", "moderate", "severe"]
