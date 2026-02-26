"""Speech-to-Text engine using faster-whisper."""

from dataclasses import dataclass
from pathlib import Path


@dataclass
class WordTimestamp:
    """A single word with timing and confidence."""

    word: str
    start: float
    end: float
    probability: float


@dataclass
class TranscriptionResult:
    """Result of speech-to-text processing."""

    text: str
    language: str
    words: list[WordTimestamp]
    duration: float


class STTEngine:
    """Speech-to-text engine wrapping faster-whisper.

    Uses the 'turbo' model for optimal speed on Apple Silicon.
    """

    def __init__(
        self,
        model_size: str = "turbo",
        device: str = "auto",
        compute_type: str = "auto",
    ):
        self.model_size = model_size
        self.device = device
        self.compute_type = compute_type
        self._model = None

    def _load_model(self):
        """Lazy-load the whisper model."""
        if self._model is None:
            try:
                from faster_whisper import WhisperModel
                self._model = WhisperModel(
                    self.model_size,
                    device=self.device,
                    compute_type=self.compute_type,
                )
            except ImportError:
                raise RuntimeError(
                    "faster-whisper is not installed. "
                    "Install it with: pip install faster-whisper"
                )
        return self._model

    def transcribe(
        self,
        audio_path: str | Path,
        language: str = "de",
    ) -> TranscriptionResult:
        """Transcribe an audio file to text with word timestamps.

        Args:
            audio_path: Path to audio file (WAV, MP3, etc.).
            language: Language code for transcription.

        Returns:
            TranscriptionResult with text, words, and timestamps.
        """
        model = self._load_model()

        segments, info = model.transcribe(
            str(audio_path),
            language=language,
            word_timestamps=True,
        )

        words: list[WordTimestamp] = []
        text_parts: list[str] = []

        for segment in segments:
            text_parts.append(segment.text.strip())
            if segment.words:
                for w in segment.words:
                    words.append(WordTimestamp(
                        word=w.word.strip(),
                        start=w.start,
                        end=w.end,
                        probability=w.probability,
                    ))

        return TranscriptionResult(
            text=" ".join(text_parts),
            language=info.language,
            words=words,
            duration=info.duration,
        )

    def get_low_confidence_words(
        self,
        result: TranscriptionResult,
        threshold: float = 0.7,
    ) -> list[WordTimestamp]:
        """Find words with low confidence (likely pronunciation issues).

        Args:
            result: Transcription result with word timestamps.
            threshold: Confidence threshold below which words are flagged.

        Returns:
            List of words with probability below threshold.
        """
        return [w for w in result.words if w.probability < threshold]
