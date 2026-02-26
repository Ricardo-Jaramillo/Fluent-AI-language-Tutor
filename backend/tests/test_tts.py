"""Tests for TTS engine module."""

from app.tts.engine import TTSEngine, TTSResult


def test_tts_engine_init():
    engine = TTSEngine()
    assert engine.voice == "de_DE-thorsten-high"


def test_tts_engine_custom_voice():
    engine = TTSEngine(voice="de_DE-kerstin-low")
    assert engine.voice == "de_DE-kerstin-low"


def test_tts_result_dataclass():
    result = TTSResult(
        audio_data=b"fake-audio-data",
        sample_rate=22050,
        format="wav",
    )
    assert result.sample_rate == 22050
    assert result.format == "wav"
    assert len(result.audio_data) > 0


def test_is_piper_available_returns_bool():
    engine = TTSEngine()
    result = engine.is_piper_available()
    assert isinstance(result, bool)
