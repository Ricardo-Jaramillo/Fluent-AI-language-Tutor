"""OpenAI LLM provider."""

from collections.abc import AsyncIterator

from openai import AsyncOpenAI

from app.llm.base import BaseLLMProvider, ChatMessage, ChatResponse


class OpenAIProvider(BaseLLMProvider):
    """OpenAI GPT provider."""

    provider_name = "openai"

    def __init__(self, api_key: str, model: str = "gpt-4o-mini"):
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = model

    async def chat(
        self,
        messages: list[ChatMessage],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> ChatResponse:
        """Send chat request to OpenAI."""
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": m.role, "content": m.content} for m in messages],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        choice = response.choices[0]
        return ChatResponse(
            content=choice.message.content or "",
            provider=self.provider_name,
            model=self.model,
            usage={
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
            } if response.usage else None,
        )

    async def stream_chat(
        self,
        messages: list[ChatMessage],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> AsyncIterator[str]:
        """Stream chat tokens from OpenAI."""
        stream = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": m.role, "content": m.content} for m in messages],
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta

    async def analyze_pronunciation(
        self,
        spoken_text: str,
        correct_text: str,
        spoken_ipa: str,
        correct_ipa: str,
    ) -> str:
        """Analyze pronunciation differences."""
        prompt = (
            f"The student said '{spoken_text}' (IPA: {spoken_ipa}) "
            f"but the correct pronunciation is '{correct_text}' (IPA: {correct_ipa}). "
            "Explain the difference in simple terms for a German learner. "
            "Focus on what mouth/tongue position to change. Keep it to 2-3 sentences."
        )
        response = await self.chat(
            [ChatMessage(role="user", content=prompt)],
            temperature=0.3,
            max_tokens=256,
        )
        return response.content
