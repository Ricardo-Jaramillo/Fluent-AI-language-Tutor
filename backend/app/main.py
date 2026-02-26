"""Fluent Backend - FastAPI application for German learning."""

from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import settings
from app.ipa.engine import analyze_word, compare_pronunciation, is_espeak_available

app = FastAPI(
    title="Fluent API",
    description="AI-powered German learning backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request/Response models ---


class ChatRequest(BaseModel):
    messages: list[dict]  # [{"role": "user", "content": "..."}]
    provider: str | None = None
    temperature: float = 0.7
    max_tokens: int = 1024


class ChatResponse(BaseModel):
    content: str
    provider: str
    model: str
    usage: dict | None = None


class IPAAnalyzeRequest(BaseModel):
    text: str
    language: str = "de"


class IPACompareRequest(BaseModel):
    spoken_text: str
    correct_text: str
    language: str = "de"


# --- Endpoints ---


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "version": "0.1.0",
        "espeak_available": is_espeak_available(),
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a chat message to the configured LLM provider."""
    from app.llm.base import ChatMessage
    from app.llm.factory import create_provider

    try:
        provider = create_provider(request.provider)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    messages = [ChatMessage(role=m["role"], content=m["content"]) for m in request.messages]

    try:
        response = await provider.chat(
            messages=messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM error: {e}")

    return ChatResponse(
        content=response.content,
        provider=response.provider,
        model=response.model,
        usage=response.usage,
    )


@app.post("/api/ipa/analyze")
async def ipa_analyze(request: IPAAnalyzeRequest):
    """Get IPA transcription for text."""
    words = request.text.split()
    results = [analyze_word(w, request.language) for w in words]
    return {"text": request.text, "words": results}


@app.post("/api/ipa/compare")
async def ipa_compare(request: IPACompareRequest):
    """Compare spoken vs correct pronunciation."""
    result = compare_pronunciation(
        request.spoken_text,
        request.correct_text,
        request.language,
    )
    return result


@app.websocket("/ws/conversation")
async def websocket_conversation(websocket: WebSocket):
    """WebSocket endpoint for streaming conversation."""
    from app.ws.handler import ConversationHandler
    handler = ConversationHandler(websocket)
    await handler.handle()
