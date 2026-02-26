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
│   │   ├── main.py          # FastAPI app, routes: /api/health, /api/chat, /api/ipa/*
│   │   ├── stt/engine.py    # faster-whisper STT (scaffolded, not wired)
│   │   ├── tts/engine.py    # Piper TTS (scaffolded, not wired)
│   │   ├── ipa/engine.py    # eSpeak-NG IPA analysis (working)
│   │   ├── llm/             # 4 providers: deepseek, claude, openai, gemini
│   │   └── ws/handler.py    # WebSocket /ws/conversation (text only)
│   └── tests/               # 20 tests
├── frontend/          # Next.js 15 + Tailwind v4 + Framer Motion
│   └── src/
│       ├── app/[locale]/    # Pages: landing, auth, onboarding, session, dashboard, settings
│       ├── components/
│       │   ├── ui/          # 13 reusable components (Button, Card, Modal, Toast, etc.)
│       │   ├── layout/      # NavBar, Sidebar, MobileDrawer, PageContainer
│       │   ├── modes/       # FreeChat, RealTimeCorrection, GuidedTeaching
│       │   ├── AnimatedPage.tsx
│       │   ├── MessageBubble.tsx
│       │   └── IPAModal.tsx
│       ├── stores/          # Zustand: session, settings, toast, auth
│       ├── lib/             # supabase clients, animations
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
- Backend tests: `cd backend && ../.venv/bin/python -m pytest tests/ -v`
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

## Current Status (Critical Gap)
The frontend and backend are **not connected**. The frontend is a polished UI shell with no API calls or WebSocket connections to the backend. See `docs/PRD.md` Section 21 for the full implementation status matrix and required integration steps.

## Key Implementation Priorities
1. Audio capture (getUserMedia + MediaRecorder in mic button)
2. WebSocket client (connect session to /ws/conversation)
3. STT integration (wire engine into WebSocket handler)
4. Message flow (STT -> LLM -> TTS -> frontend)
5. Supabase data persistence (sessions, messages, progress)
6. Dashboard with real data (replace mock data with queries)
