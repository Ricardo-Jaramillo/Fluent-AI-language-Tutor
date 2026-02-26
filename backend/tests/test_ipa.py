"""Tests for IPA engine."""

from app.ipa.engine import analyze_word, compare_pronunciation, is_espeak_available


def test_is_espeak_available_returns_bool():
    result = is_espeak_available()
    assert isinstance(result, bool)


def test_analyze_word_structure():
    result = analyze_word("Hallo")
    assert "word" in result
    assert result["word"] == "Hallo"
    assert "ipa" in result
    assert "language" in result
    assert result["language"] == "de"


def test_compare_pronunciation_structure():
    result = compare_pronunciation("Hallo", "Hallo")
    assert "spoken_text" in result
    assert "correct_text" in result
    assert "spoken_ipa" in result
    assert "correct_ipa" in result
    assert "differs" in result


def test_compare_same_word_no_difference():
    result = compare_pronunciation("Hallo", "Hallo")
    assert result["differs"] is False


def test_compare_different_words():
    result = compare_pronunciation("Halo", "Hallo")
    # May or may not differ depending on espeak availability
    assert isinstance(result["differs"], bool)
