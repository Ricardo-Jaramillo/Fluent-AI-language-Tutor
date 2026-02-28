"""Tests for WebSocket text message handling."""

import json
from unittest.mock import AsyncMock, patch, MagicMock

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.tts.engine import TTSResult


FAKE_WAV = b"RIFF" + b"\x00" * 40  # Minimal fake WAV bytes


@pytest.fixture
def client():
    return TestClient(app)


def _mock_provider():
    """Create a mock LLM provider that returns a fixed response."""
    provider = AsyncMock()
    provider.provider_name = "mock"
    provider.model = "mock-model"
    response = MagicMock()
    response.content = "Hallo! Wie geht es dir?"
    response.provider = "mock"
    response.model = "mock-model"
    provider.chat.return_value = response

    async def _stream_chat(*args, **kwargs):
        yield "Hallo! Wie geht es dir?"

    provider.stream_chat = _stream_chat
    return provider


def _mock_tts_synthesize(text):
    """Return a fake TTS result."""
    return TTSResult(audio_data=FAKE_WAV, sample_rate=22050, format="wav")


class TestWebSocketTextMessages:
    """Test text message round-trip through WebSocket."""

    def test_text_message_returns_response(self, client):
        with (
            patch("app.ws.handler.create_provider", return_value=_mock_provider()),
            patch("app.tts.engine.TTSEngine.synthesize", side_effect=_mock_tts_synthesize),
        ):
            with client.websocket_connect("/ws/conversation") as ws:
                ws.send_json({
                    "type": "message",
                    "content": "Hallo",
                    "provider": "deepseek",
                })
                chunk = ws.receive_json()
                assert chunk["type"] == "response_chunk"
                assert chunk["content"] == "Hallo! Wie geht es dir?"

                tts = ws.receive_json()
                assert tts["type"] == "tts_audio"
                assert tts["format"] == "wav"
                assert tts["size"] == len(FAKE_WAV)

                audio_bytes = ws.receive_bytes()
                assert audio_bytes == FAKE_WAV

                end = ws.receive_json()
                assert end["type"] == "response_end"
                assert end["content"] == "Hallo! Wie geht es dir?"
                assert end["provider"] == "mock"

    def test_config_message_updates_system_prompt(self, client):
        with patch("app.ws.handler.create_provider", return_value=_mock_provider()):
            with client.websocket_connect("/ws/conversation") as ws:
                ws.send_json({
                    "type": "config",
                    "system_prompt": "You are a test tutor.",
                })
                data = ws.receive_json()
                assert data["type"] == "config_ack"

    def test_ping_pong_keepalive(self, client):
        with client.websocket_connect("/ws/conversation") as ws:
            ws.send_json({"type": "ping"})
            data = ws.receive_json()
            assert data["type"] == "pong"

    def test_unknown_message_type_returns_error(self, client):
        with client.websocket_connect("/ws/conversation") as ws:
            ws.send_json({"type": "unknown_type"})
            data = ws.receive_json()
            assert data["type"] == "error"
            assert "Unknown message type" in data["detail"]

    def test_provider_selection_via_message(self, client):
        mock = _mock_provider()
        with (
            patch("app.ws.handler.create_provider", return_value=mock) as factory,
            patch("app.tts.engine.TTSEngine.synthesize", side_effect=_mock_tts_synthesize),
        ):
            with client.websocket_connect("/ws/conversation") as ws:
                ws.send_json({
                    "type": "message",
                    "content": "Test",
                    "provider": "claude",
                })
                ws.receive_json()  # response_chunk
                ws.receive_json()  # tts_audio
                ws.receive_bytes()  # audio binary
                factory.assert_called_with("claude")

    def test_config_then_message_flow(self, client):
        """Full flow: config -> message -> response_chunk -> tts_audio + binary -> response_end."""
        with (
            patch("app.ws.handler.create_provider", return_value=_mock_provider()),
            patch("app.tts.engine.TTSEngine.synthesize", side_effect=_mock_tts_synthesize),
        ):
            with client.websocket_connect("/ws/conversation") as ws:
                # Send config
                ws.send_json({
                    "type": "config",
                    "system_prompt": "Custom tutor prompt",
                })
                ack = ws.receive_json()
                assert ack["type"] == "config_ack"

                # Send message
                ws.send_json({
                    "type": "message",
                    "content": "Guten Tag",
                })
                chunk = ws.receive_json()
                assert chunk["type"] == "response_chunk"

                tts = ws.receive_json()
                assert tts["type"] == "tts_audio"

                ws.receive_bytes()  # audio binary

                end = ws.receive_json()
                assert end["type"] == "response_end"
                assert end["content"] == "Hallo! Wie geht es dir?"

    def test_sentence_aligned_tts_multiple_sentences(self, client):
        """Verify multiple tts_audio + binary pairs for multi-sentence responses."""
        provider = AsyncMock()
        provider.provider_name = "mock"
        provider.model = "mock-model"

        async def _stream_multi(*args, **kwargs):
            yield "Hallo! "
            yield "Wie geht es dir?"

        provider.stream_chat = _stream_multi

        with (
            patch("app.ws.handler.create_provider", return_value=provider),
            patch("app.tts.engine.TTSEngine.synthesize", side_effect=_mock_tts_synthesize),
        ):
            with client.websocket_connect("/ws/conversation") as ws:
                ws.send_json({"type": "message", "content": "Hi"})

                # First chunk
                c1 = ws.receive_json()
                assert c1["type"] == "response_chunk"
                assert c1["content"] == "Hallo! "

                # First tts_audio + binary (after "Hallo!")
                tts1 = ws.receive_json()
                assert tts1["type"] == "tts_audio"
                audio1 = ws.receive_bytes()
                assert audio1 == FAKE_WAV

                # Second chunk
                c2 = ws.receive_json()
                assert c2["type"] == "response_chunk"
                assert c2["content"] == "Wie geht es dir?"

                # Second tts_audio + binary (after "Wie geht es dir?")
                tts2 = ws.receive_json()
                assert tts2["type"] == "tts_audio"
                audio2 = ws.receive_bytes()
                assert audio2 == FAKE_WAV

                # response_end
                end = ws.receive_json()
                assert end["type"] == "response_end"
                assert end["content"] == "Hallo! Wie geht es dir?"

    def test_tts_disabled_no_audio_messages(self, client):
        """When TTS is disabled via config, no tts_audio messages are sent."""
        with patch("app.ws.handler.create_provider", return_value=_mock_provider()):
            with client.websocket_connect("/ws/conversation") as ws:
                # Disable TTS
                ws.send_json({
                    "type": "config",
                    "system_prompt": "Test",
                    "tts_enabled": False,
                })
                ack = ws.receive_json()
                assert ack["type"] == "config_ack"

                # Send message
                ws.send_json({"type": "message", "content": "Hallo"})

                # Should get response_chunk then response_end (no tts_audio)
                chunk = ws.receive_json()
                assert chunk["type"] == "response_chunk"

                end = ws.receive_json()
                assert end["type"] == "response_end"

    def test_tts_config_mid_session(self, client):
        """tts_config message type updates TTS settings mid-session."""
        with patch("app.ws.handler.create_provider", return_value=_mock_provider()):
            with client.websocket_connect("/ws/conversation") as ws:
                ws.send_json({
                    "type": "tts_config",
                    "tts_enabled": False,
                })
                ack = ws.receive_json()
                assert ack["type"] == "config_ack"
