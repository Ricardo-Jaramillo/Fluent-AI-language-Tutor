"""Google Gemini LLM provider."""

from google import genai
from google.genai.types import Content, GenerateContentConfig, Part

from app.llm.base import BaseLLMProvider, ChatMessage, ChatResponse


class GeminiProvider(BaseLLMProvider):
    """Google Gemini provider."""

    provider_name = "gemini"

    def __init__(self, api_key: str, model: str = "gemini-2.0-flash"):
        self.client = genai.Client(api_key=api_key)
        self.model = model

    async def chat(
        self,
        messages: list[ChatMessage],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> ChatResponse:
        """Send chat request to Gemini."""
        # Convert messages to Gemini format
        system_text = ""
        contents: list[Content] = []
        for m in messages:
            if m.role == "system":
                system_text = m.content
            else:
                role = "user" if m.role == "user" else "model"
                contents.append(Content(role=role, parts=[Part(text=m.content)]))

        config = GenerateContentConfig(
            temperature=temperature,
            max_output_tokens=max_tokens,
        )
        if system_text:
            config.system_instruction = system_text

        response = await self.client.aio.models.generate_content(
            model=self.model,
            contents=contents,
            config=config,
        )
        content = response.text or ""
        return ChatResponse(
            content=content,
            provider=self.provider_name,
            model=self.model,
            usage={
                "prompt_tokens": response.usage_metadata.prompt_token_count,
                "completion_tokens": response.usage_metadata.candidates_token_count,
            } if response.usage_metadata else None,
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
