"""Tests for STT engine module."""

from app.stt.engine import STTEngine, TranscriptionResult, WordTimestamp


def test_stt_engine_init():
    engine = STTEngine()
    assert engine.model_size == "turbo"
    assert engine._model is None


def test_stt_engine_custom_model():
    engine = STTEngine(model_size="small", device="cpu")
    assert engine.model_size == "small"
    assert engine.device == "cpu"


def test_word_timestamp_dataclass():
    wt = WordTimestamp(word="Hallo", start=0.0, end=0.5, probability=0.95)
    assert wt.word == "Hallo"
    assert wt.probability == 0.95


def test_transcription_result_dataclass():
    result = TranscriptionResult(
        text="Hallo Welt",
        language="de",
        words=[
            WordTimestamp(word="Hallo", start=0.0, end=0.5, probability=0.95),
            WordTimestamp(word="Welt", start=0.5, end=1.0, probability=0.3),
        ],
        duration=1.0,
    )
    assert result.text == "Hallo Welt"
    assert len(result.words) == 2


def test_get_low_confidence_words():
    engine = STTEngine()
    result = TranscriptionResult(
        text="Hallo Welt",
        language="de",
        words=[
            WordTimestamp(word="Hallo", start=0.0, end=0.5, probability=0.95),
            WordTimestamp(word="Welt", start=0.5, end=1.0, probability=0.3),
        ],
        duration=1.0,
    )
    low = engine.get_low_confidence_words(result, threshold=0.7)
    assert len(low) == 1
    assert low[0].word == "Welt"
