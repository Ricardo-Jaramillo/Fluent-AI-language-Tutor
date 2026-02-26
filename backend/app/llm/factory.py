"""LLM provider factory — instantiates the configured provider."""

from app.config import settings
from app.llm.base import BaseLLMProvider


def create_provider(provider: str | None = None) -> BaseLLMProvider:
    """Create an LLM provider based on configuration.

    Args:
        provider: Override provider name. Uses settings.llm_provider if None.

    Returns:
        Configured LLM provider instance.

    Raises:
        ValueError: If provider is unknown or API key is missing.
    """
    name = provider or settings.llm_provider

    if name == "deepseek":
        if not settings.deepseek_api_key:
            raise ValueError("DEEPSEEK_API_KEY is required for DeepSeek provider")
        from app.llm.deepseek import DeepSeekProvider
        return DeepSeekProvider(api_key=settings.deepseek_api_key)

    elif name == "claude":
        if not settings.anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY is required for Claude provider")
        from app.llm.claude import ClaudeProvider
        return ClaudeProvider(api_key=settings.anthropic_api_key)

    elif name == "openai":
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY is required for OpenAI provider")
        from app.llm.openai_llm import OpenAIProvider
        return OpenAIProvider(api_key=settings.openai_api_key)

    elif name == "gemini":
        if not settings.google_ai_api_key:
            raise ValueError("GOOGLE_AI_API_KEY is required for Gemini provider")
        from app.llm.gemini import GeminiProvider
        return GeminiProvider(api_key=settings.google_ai_api_key)

    else:
        raise ValueError(f"Unknown LLM provider: {name}")
