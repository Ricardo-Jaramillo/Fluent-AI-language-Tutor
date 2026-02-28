# Task Tracking

## WebSocket TTS + Loora-Style UX Refactor (2026-02-28)

### Phase 1: WebSocket-based TTS
- [x] Backend: Add TTS engine to ws/handler.py (lazy-init, synthesize_and_send binary)
- [x] Backend: Replace `tts_ready` with `tts_audio` JSON + binary WAV
- [x] Backend: Add `tts_config` message type for mid-session TTS toggle/voice
- [x] Frontend: Add `onBinary` callback to `useWebSocket` hook
- [x] Frontend: Add `queueAudioBuffer` to audio.ts, remove `queueTTS`
- [x] Frontend: Wire binary handler in session page
- [x] Tests: Update 3 test files for binary protocol (40/40 pass)
- [x] Validate: Backend tests, frontend build, lint — all clean

### Phase 2: Unified Conversation Mode
- [x] Unified system prompt (level + topicHint, no mode param)
- [x] Session store: Remove mode/moduleId/topicId, add topicHint + grammarCorrections
- [x] ConversationView component (replaces FreeChat/RealTimeCorrection/GuidedTeaching)
- [x] Enhanced MessageBubble with per-message actions (replay, feedback)
- [x] FeedbackSheet with Grammar + Pronunciation tabs
- [x] parseCorrections.ts for ❌ → ✅ extraction
- [x] Session page simplification (single mode, correction parsing)
- [x] Delete mode components (FreeChat, RealTimeCorrection, GuidedTeaching)
- [x] i18n updates (all 4 locales: add grammar/pronunciation keys, remove mode keys)
- [x] Validate: Backend tests, frontend build, lint — all clean

### Phase 3: UX Flow Refactor
- [x] Dashboard: /session links, unified mode label
- [x] LevelSelector chip component (A1-C1, persists to Supabase)
- [x] TopicChips component (horizontal scrollable)
- [x] Session page: LevelSelector + TopicChips in header
- [x] NavBar: Practice -> /session
- [x] Delete onboarding page
- [x] Update auth flow (redirect to /dashboard instead of /onboarding)
- [x] Remove onboarding i18n keys (all 4 locales)
- [x] SessionEndOverlay: Practice Again stays on /session
- [x] Validate: Backend tests (40 pass), frontend build, lint — all clean

## Previous: Piper Model + LLM Streaming + Upgrade Docs (2026-02-28)

- [x] Dockerfile: Add Piper model download step (~60MB onnx + json)
- [x] LLM base: Add `stream_chat()` async generator with fallback
- [x] LLM providers: Override `stream_chat()` in DeepSeek, OpenAI, Claude, Gemini
- [x] WebSocket handler: Stream tokens via `response_chunk` / `response_end`
- [x] Session store: Add `updateMessageContent` action
- [x] Session page: Handle streaming chunks, replace `response` with `response_chunk`/`response_end`
- [x] Tests: Update 3 test files for new streaming protocol (37/37 pass)
- [x] Docs: Add upgrade paths section to COSTS.md
- [x] Verify: Backend tests pass, frontend builds clean, lint clean
