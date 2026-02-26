"""Text-to-Speech engine using Piper TTS."""

import io
import subprocess
import shutil
from dataclasses import dataclass
from pathlib import Path


@dataclass
class TTSResult:
    """Result of text-to-speech synthesis."""

    audio_data: bytes
    sample_rate: int
    format: str  # "wav"


class TTSEngine:
    """Text-to-speech engine wrapping Piper TTS.

    Uses local Piper TTS for German voice synthesis.
    Falls back to eSpeak-NG if Piper is not available.
    """

    def __init__(
        self,
        voice: str = "de_DE-thorsten-high",
        models_dir: str | Path | None = None,
    ):
        self.voice = voice
        self.models_dir = Path(models_dir) if models_dir else Path(__file__).parent.parent.parent / "models"
        self._piper_available: bool | None = None

    def is_piper_available(self) -> bool:
        """Check if Piper TTS is installed."""
        if self._piper_available is None:
            self._piper_available = shutil.which("piper") is not None
        return self._piper_available

    def synthesize(self, text: str) -> TTSResult:
        """Synthesize text to speech audio.

        Args:
            text: German text to speak.

        Returns:
            TTSResult with WAV audio data.
        """
        if self.is_piper_available():
            return self._synthesize_piper(text)
        return self._synthesize_espeak(text)

    def _synthesize_piper(self, text: str) -> TTSResult:
        """Synthesize using Piper TTS."""
        try:
            result = subprocess.run(
                [
                    "piper",
                    "--model", self.voice,
                    "--output-raw",
                ],
                input=text,
                capture_output=True,
                text=False,
                timeout=10,
            )
            return TTSResult(
                audio_data=result.stdout,
                sample_rate=22050,
                format="wav",
            )
        except (subprocess.TimeoutExpired, FileNotFoundError) as e:
            raise RuntimeError(f"Piper TTS error: {e}")

    def _synthesize_espeak(self, text: str) -> TTSResult:
        """Fallback synthesis using eSpeak-NG."""
        if not shutil.which("espeak-ng"):
            raise RuntimeError(
                "Neither Piper TTS nor eSpeak-NG is available. "
                "Install one of them for TTS support."
            )

        try:
            result = subprocess.run(
                ["espeak-ng", "-v", "de", "--stdout", text],
                capture_output=True,
                timeout=10,
            )
            return TTSResult(
                audio_data=result.stdout,
                sample_rate=22050,
                format="wav",
            )
        except (subprocess.TimeoutExpired, FileNotFoundError) as e:
            raise RuntimeError(f"eSpeak-NG TTS error: {e}")

    def synthesize_word(self, word: str) -> TTSResult:
        """Synthesize a single word — used for pronunciation playback.

        Args:
            word: Single German word to synthesize.

        Returns:
            TTSResult with audio for the word.
        """
        return self.synthesize(word)
