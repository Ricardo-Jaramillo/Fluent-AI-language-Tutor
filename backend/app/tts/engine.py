"""Text-to-Speech engine using Piper TTS."""

import io
import logging
import shutil
import subprocess
import wave
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger("uvicorn.error")


@dataclass
class TTSResult:
    """Result of text-to-speech synthesis."""

    audio_data: bytes
    sample_rate: int
    format: str  # "wav"


def _download_piper_model(models_dir: Path, voice: str) -> None:
    """Download Piper voice model from HuggingFace if not present."""
    onnx_path = models_dir / f"{voice}.onnx"
    json_path = models_dir / f"{voice}.onnx.json"

    if onnx_path.exists() and json_path.exists():
        return

    # Parse voice name: de_DE-thorsten-high -> de/de_DE/thorsten/high
    parts = voice.split("-")
    locale = parts[0]  # de_DE
    lang = locale.split("_")[0]  # de
    speaker = parts[1]  # thorsten
    quality = parts[2]  # high
    base_url = f"https://huggingface.co/rhasspy/piper-voices/resolve/main/{lang}/{locale}/{speaker}/{quality}"

    import urllib.request

    models_dir.mkdir(parents=True, exist_ok=True)
    for fname, path in [(f"{voice}.onnx", onnx_path), (f"{voice}.onnx.json", json_path)]:
        if not path.exists():
            logger.info("Downloading Piper model: %s", fname)
            urllib.request.urlretrieve(f"{base_url}/{fname}", str(path))
            logger.info("Downloaded %s (%d bytes)", fname, path.stat().st_size)


class TTSEngine:
    """Text-to-speech engine wrapping Piper TTS.

    Uses local Piper TTS Python API for German voice synthesis.
    Falls back to eSpeak-NG if Piper is not available.
    """

    def __init__(
        self,
        voice: str = "de_DE-thorsten-high",
        models_dir: str | Path | None = None,
    ):
        self.voice = voice
        self.models_dir = Path(models_dir) if models_dir else Path(__file__).parent.parent.parent / "models"
        self._piper_voice = None
        self._piper_available: bool | None = None

    def _get_piper_voice(self):
        """Lazy-load the Piper voice model."""
        if self._piper_voice is None:
            try:
                from piper import PiperVoice

                _download_piper_model(self.models_dir, self.voice)
                model_path = self.models_dir / f"{self.voice}.onnx"
                self._piper_voice = PiperVoice.load(str(model_path))
                self._piper_available = True
                logger.info("Piper TTS loaded: %s", model_path)
            except Exception as e:
                self._piper_available = False
                logger.warning("Piper TTS unavailable: %s", e)
        return self._piper_voice

    def is_piper_available(self) -> bool:
        """Check if Piper TTS can be used."""
        if self._piper_available is None:
            self._get_piper_voice()
        return self._piper_available or False

    def synthesize(self, text: str) -> TTSResult:
        """Synthesize text to speech audio.

        Args:
            text: German text to speak.

        Returns:
            TTSResult with WAV audio data.
        """
        voice = self._get_piper_voice()
        if voice is not None:
            try:
                return self._synthesize_piper(voice, text)
            except Exception as e:
                logger.warning("Piper synthesis failed, falling back to espeak: %s", e)
        return self._synthesize_espeak(text)

    def _synthesize_piper(self, voice, text: str) -> TTSResult:
        """Synthesize using Piper TTS Python API."""
        chunks = list(voice.synthesize(text))
        if not chunks:
            raise RuntimeError("Piper produced no audio")

        raw_audio = b"".join(chunk.audio_int16_bytes for chunk in chunks)
        sample_rate = chunks[0].sample_rate

        # Wrap raw PCM in WAV container
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)  # 16-bit
            wf.setframerate(sample_rate)
            wf.writeframes(raw_audio)

        return TTSResult(
            audio_data=buf.getvalue(),
            sample_rate=sample_rate,
            format="wav",
        )

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
