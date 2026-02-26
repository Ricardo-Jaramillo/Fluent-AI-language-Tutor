"""IPA phonetic analysis engine using eSpeak-NG + Phonemizer."""

import shutil
import subprocess


def is_espeak_available() -> bool:
    """Check if eSpeak-NG is installed on the system."""
    return shutil.which("espeak-ng") is not None


def get_ipa(text: str, language: str = "de") -> str:
    """Generate IPA transcription for the given text.

    Uses eSpeak-NG directly via subprocess for reliable IPA generation.
    Falls back to a placeholder if eSpeak-NG is not available.

    Args:
        text: The text to transcribe to IPA.
        language: Language code (default: "de" for German).

    Returns:
        IPA transcription string.
    """
    if not is_espeak_available():
        return f"[IPA unavailable - install espeak-ng] {text}"

    try:
        result = subprocess.run(
            ["espeak-ng", "-v", language, "--ipa", "-q", text],
            capture_output=True,
            text=True,
            timeout=5,
        )
        return result.stdout.strip()
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return f"[IPA error] {text}"


def analyze_word(word: str, language: str = "de") -> dict:
    """Get detailed IPA analysis for a single word.

    Args:
        word: The word to analyze.
        language: Language code.

    Returns:
        Dictionary with word, ipa, and language fields.
    """
    return {
        "word": word,
        "ipa": get_ipa(word, language),
        "language": language,
    }


def compare_pronunciation(
    spoken_text: str,
    correct_text: str,
    language: str = "de",
) -> dict:
    """Compare spoken vs correct pronunciation.

    Args:
        spoken_text: What the user actually said (from STT).
        correct_text: The correct text.
        language: Language code.

    Returns:
        Dictionary with spoken/correct text, IPA for both, and whether they differ.
    """
    spoken_ipa = get_ipa(spoken_text, language)
    correct_ipa = get_ipa(correct_text, language)

    return {
        "spoken_text": spoken_text,
        "correct_text": correct_text,
        "spoken_ipa": spoken_ipa,
        "correct_ipa": correct_ipa,
        "differs": spoken_ipa != correct_ipa,
    }
