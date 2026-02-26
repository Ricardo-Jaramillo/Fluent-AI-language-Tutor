"""Abstract base class for LLM providers."""

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class ChatMessage:
    """A single message in a conversation."""

    role: str  # "system" | "user" | "assistant"
    content: str


@dataclass
class ChatResponse:
    """Response from an LLM provider."""

    content: str
    provider: str
    model: str
    usage: dict | None = None


class BaseLLMProvider(ABC):
    """Abstract LLM provider interface."""

    provider_name: str = "base"

    @abstractmethod
    async def chat(
        self,
        messages: list[ChatMessage],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> ChatResponse:
        """Send a chat completion request."""
        ...

    @abstractmethod
    async def analyze_pronunciation(
        self,
        spoken_text: str,
        correct_text: str,
        spoken_ipa: str,
        correct_ipa: str,
    ) -> str:
        """Generate natural language explanation of pronunciation differences."""
        ...
