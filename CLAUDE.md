# Fluent - German Learning App

## Validation Discipline
- EVERY implementation step MUST pass its validation checkpoint before proceeding
- Run tests after EVERY code change: `cd backend && .venv/bin/python -m pytest tests/ -v`
- Build frontend after EVERY change: `cd frontend && npm run build`
- Lint frontend after changes: `cd frontend && npm run lint`
- Never skip validation. If it fails, fix before moving on.

## Project Structure
```
fluent/
├── backend/           # Python FastAPI (STT, TTS, IPA, LLM, WebSocket)
│   ├── app/
│   │   ├── main.py          # FastAPI app, routes: /api/health, /api/chat, /api/ipa/*, /api/tts
│   │   ├── config.py        # Settings (CORS origins, env vars)
│   │   ├── stt/engine.py    # faster-whisper STT (wired into WebSocket handler)
│   │   ├── tts/engine.py    # Piper TTS with eSpeak-NG fallback (WS binary + /api/tts)
│   │   ├── ipa/engine.py    # eSpeak-NG IPA analysis (wired into WebSocket handler)
│   │   ├── llm/             # 4 providers: deepseek, claude, openai, gemini + factory
│   │   └── ws/handler.py    # WebSocket /ws/conversation (text + audio + config + TTS binary + keepalive)
│   └── tests/               # 40 tests (9 test files)
├── frontend/          # Next.js 15 + Tailwind v4 + Framer Motion
│   └── src/
│       ├── app/[locale]/    # Pages: landing, auth, session, dashboard, settings
│       ├── components/
│       │   ├── ui/          # 13 reusable components (Button, Card, Modal, Toast, etc.)
│       │   ├── layout/      # NavBar, Sidebar, MobileDrawer, PageContainer
│       │   ├── ConversationView.tsx   # Unified chat view
│       │   ├── FeedbackSheet.tsx      # Grammar/Pronunciation review panel
│       │   ├── LevelSelector.tsx      # Tappable level chip (A1-C1)
│       │   ├── TopicChips.tsx         # Horizontal topic suggestions
│       │   ├── AnimatedPage.tsx
│       │   ├── AuthProvider.tsx     # Supabase auth state management
│       │   ├── ThemeProvider.tsx     # Dark/light/system theme application
│       │   ├── MessageBubble.tsx
│       │   ├── IPAModal.tsx
│       │   └── SessionEndOverlay.tsx # Score display after session end
│       ├── hooks/           # useWebSocket, useAudioCapture
│       ├── stores/          # Zustand: session, settings, toast, auth
│       ├── lib/             # supabase clients, animations, api, audio, prompts, parseCorrections
│       ├── i18n/messages/   # EN, ES, FR, DE translation files
│       └── data/syllabus.json  # 72 topics, 5 levels, 12 modules
├── supabase/          # CLI config + migrations (6 tables with RLS)
├── docs/              # PRD.md, COSTS.md
├── scripts/           # validate_syllabus.py
├── docker-compose.yml
├── Dockerfile.backend
└── Dockerfile.frontend
```

## Tech Stack
- **Backend**: Python FastAPI, faster-whisper (STT), Piper TTS, eSpeak-NG + Phonemizer (IPA)
- **Frontend**: Next.js 15, Tailwind CSS v4, Framer Motion, Zustand, next-intl, lucide-react
- **DB**: Supabase PostgreSQL with RLS (cloud project)
- **LLM**: Multi-provider factory (DeepSeek default, Claude, OpenAI, Gemini)
- **Auth**: Supabase Auth with middleware route protection

## Commands
- Backend dev: `cd backend && uvicorn app.main:app --reload --port 8000`
- Backend tests: `cd backend && ../.venv/bin/python -m pytest tests/ -v` (40 tests)
- Frontend dev: `cd frontend && npm run dev`
- Frontend build: `cd frontend && npm run build`
- Frontend lint: `cd frontend && npm run lint`
- Validate syllabus: `.venv/bin/python scripts/validate_syllabus.py`
- Supabase: cloud project (no local CLI needed)
- Docker: `docker compose up --build`

## Design System
- **Colors**: Teal/Emerald primary + Violet accent (custom, no UI library)
- **Tokens**: All in `frontend/src/app/globals.css` via `@theme inline` + CSS custom properties
- **Components**: Custom-built with Tailwind + Framer Motion (no shadcn/radix)
- **Icons**: lucide-react (tree-shakeable, 24x24 grid)
- **Animations**: `frontend/src/lib/animations.ts` — 12 reusable Framer Motion variants
- **Glass morphism**: `.glass` utility class in globals.css
- **Gradient text**: `.gradient-text` utility class (primary-400 to accent-400)

## Conventions
- Python: type hints, docstrings on public functions
- TypeScript: strict mode, no `any`
- All API responses use consistent JSON structure
- i18n: all UI text goes through next-intl, never hardcoded
- Dark mode is default theme
- All components support `className` prop for overrides
- All interactive elements use `whileTap={{ scale: 0.97 }}` for tactile feedback
- All animations respect `prefers-reduced-motion`

## Current Status
The frontend and backend are **fully integrated**. The core conversation flow works end-to-end: audio capture -> WebSocket -> STT -> IPA analysis -> LLM -> TTS -> frontend playback. Sessions, messages, and scores persist to Supabase. All UI strings go through next-intl (zero hardcoded strings). See `docs/PRD.md` Section 21 for the detailed implementation status matrix.

### What's Working
- Audio capture (getUserMedia + MediaRecorder via `useAudioCapture` hook)
- WebSocket client with auto-reconnect, keepalive, and binary support (`useWebSocket` hook)
- STT engine wired into WebSocket handler (faster-whisper with confidence scoring)
- Full message flow: STT -> IPA -> LLM -> TTS -> frontend
- WebSocket binary TTS (synthesize on backend, send WAV via WS — eliminates HTTP latency)
- HTTP TTS endpoint (`/api/tts`) kept for IPAModal single-word playback
- Unified conversation mode (replaces FreeChat/RealTimeCorrection/GuidedTeaching)
- Level selector chip in session toolbar (A1-C1, persists to Supabase)
- Topic chips for contextual conversation guidance
- Grammar correction parsing from LLM responses (❌ → ✅ format)
- FeedbackSheet with Grammar + Pronunciation tabs per user message
- Per-message action icons (replay TTS, review feedback)
- Dashboard-first post-auth flow (no onboarding wizard)
- Supabase data persistence (sessions, messages, scores)
- Dashboard with real Supabase queries
- Auth with AuthProvider + profile fetching
- Theme switching (ThemeProvider: dark/light/system)
- Session end overlay with animated score rings

### Remaining Work
1. Password reset flow
2. Full account deletion (currently just signs out)
3. Streaming LLM responses (currently waits for full response)
