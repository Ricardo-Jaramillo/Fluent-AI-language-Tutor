"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings loaded from environment variables."""

    # LLM
    llm_provider: str = "deepseek"
    deepseek_api_key: str = ""
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    google_ai_api_key: str = ""

    # Supabase
    supabase_url: str = "http://127.0.0.1:54321"
    supabase_service_role_key: str = ""

    # CORS
    backend_cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.backend_cors_origins.split(",")]

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
