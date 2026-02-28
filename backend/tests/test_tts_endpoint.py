"""Tests for the POST /api/tts endpoint."""

from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.tts.engine import TTSResult


@pytest.fixture
def client():
    return TestClient(app)


class TestTTSEndpoint:

    def test_tts_returns_wav_audio(self, client):
        mock_engine = MagicMock()
        mock_engine.synthesize.return_value = TTSResult(
            audio_data=b"RIFF\x00\x00\x00\x00WAVEfmt ",
            sample_rate=22050,
            format="wav",
        )
        with patch("app.tts.engine.TTSEngine", return_value=mock_engine):
            response = client.post(
                "/api/tts",
                json={"text": "Hallo"},
            )
            assert response.status_code == 200
            assert response.headers["content-type"] == "audio/wav"
            assert len(response.content) > 0

    def test_tts_empty_text_returns_400(self, client):
        response = client.post("/api/tts", json={"text": ""})
        assert response.status_code == 400
        assert "empty" in response.json()["detail"].lower()

    def test_tts_whitespace_only_returns_400(self, client):
        response = client.post("/api/tts", json={"text": "   "})
        assert response.status_code == 400

    def test_tts_engine_error_returns_503(self, client):
        mock_engine = MagicMock()
        mock_engine.synthesize.side_effect = RuntimeError("TTS unavailable")
        with patch("app.tts.engine.TTSEngine", return_value=mock_engine):
            response = client.post("/api/tts", json={"text": "Hallo"})
            assert response.status_code == 503
            assert "TTS unavailable" in response.json()["detail"]
