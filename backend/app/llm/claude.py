"""Anthropic Claude LLM provider."""

from anthropic import AsyncAnthropic

from app.llm.base import BaseLLMProvider, ChatMessage, ChatResponse


class ClaudeProvider(BaseLLMProvider):
    """Claude provider via Anthropic API."""

    provider_name = "claude"

    def __init__(self, api_key: str, model: str = "claude-haiku-4-5-20251001"):
        self.client = AsyncAnthropic(api_key=api_key)
        self.model = model

    async def chat(
        self,
        messages: list[ChatMessage],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> ChatResponse:
        """Send chat request to Claude."""
        # Separate system message from conversation
        system_text = ""
        conversation = []
        for m in messages:
            if m.role == "system":
                system_text = m.content
            else:
                conversation.append({"role": m.role, "content": m.content})

        kwargs: dict = {
            "model": self.model,
            "messages": conversation,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        if system_text:
            kwargs["system"] = system_text

        response = await self.client.messages.create(**kwargs)
        content = response.content[0].text if response.content else ""
        return ChatResponse(
            content=content,
            provider=self.provider_name,
            model=self.model,
            usage={
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            },
        )

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
