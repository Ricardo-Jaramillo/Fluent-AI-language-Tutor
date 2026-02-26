"""Tests for LLM provider factory."""

import pytest


def test_factory_unknown_provider():
    from app.llm.factory import create_provider
    with pytest.raises(ValueError, match="Unknown LLM provider"):
        create_provider("nonexistent")


def test_factory_deepseek_no_key(monkeypatch):
    monkeypatch.setenv("DEEPSEEK_API_KEY", "")
    monkeypatch.setenv("LLM_PROVIDER", "deepseek")
    # Need to reload settings to pick up new env
    from app.config import Settings
    from app.llm import factory
    factory.settings = Settings()
    with pytest.raises(ValueError, match="DEEPSEEK_API_KEY"):
        factory.create_provider("deepseek")


def test_factory_deepseek_with_key(monkeypatch):
    monkeypatch.setenv("DEEPSEEK_API_KEY", "test-key-123")
    from app.config import Settings
    from app.llm import factory
    factory.settings = Settings()
    provider = factory.create_provider("deepseek")
    assert provider.provider_name == "deepseek"


def test_factory_claude_with_key(monkeypatch):
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key-123")
    from app.config import Settings
    from app.llm import factory
    factory.settings = Settings()
    provider = factory.create_provider("claude")
    assert provider.provider_name == "claude"


def test_factory_openai_with_key(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key-123")
    from app.config import Settings
    from app.llm import factory
    factory.settings = Settings()
    provider = factory.create_provider("openai")
    assert provider.provider_name == "openai"
