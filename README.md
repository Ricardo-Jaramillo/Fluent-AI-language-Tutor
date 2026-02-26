# Fluent

AI-powered German learning app focused on spoken practice (Sprechen), covering levels A1 through C1.

## What is Fluent?

Fluent is a conversation-first German learning tool. Instead of flashcards and grammar drills, it puts you in spoken conversations with an AI tutor that adapts to your level, corrects your mistakes in real time, and provides phonetic (IPA) pronunciation feedback.

**Core thesis**: German learners have plenty of grammar resources but almost no affordable, private, always-available conversation partners.

## Features

### 3 Conversation Modes
- **Free Chat** — Open-ended conversation at your level (semi-guided for A1-A2, fully natural for B2-C1)
- **Real-Time Correction** — Live grammar and pronunciation feedback as you speak
- **Guided Teaching** — Structured lessons following a 72-topic syllabus across 5 levels

### Phonetic Analysis (IPA)
- Every utterance analyzed for pronunciation accuracy
- IPA comparison: what you said vs correct form
- Clickable words open detailed pronunciation modal
- Deterministic IPA via eSpeak-NG (LLMs fail at German phonetics)

### Multi-Language UI
Interface available in English, Spanish, French, and German.

### Multi-LLM Support
Choose your AI provider: DeepSeek V3 (default, cheapest), Claude, OpenAI, or Gemini.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, Tailwind CSS v4, Framer Motion, Zustand, next-intl, lucide-react |
| Backend | Python FastAPI, WebSockets |
| STT | faster-whisper (local, Apple Silicon optimized) |
| TTS | Piper TTS (local, German voices) |
| IPA | eSpeak-NG + Phonemizer (local, deterministic) |
| LLM | Multi-provider (DeepSeek, Claude, OpenAI, Gemini) |
| Database | Supabase PostgreSQL with Row Level Security |
| Auth | Supabase Auth |

## Quick Start

### Prerequisites
- Python 3.13+
- Node.js 24+
- A [Supabase](https://supabase.com) project (free tier works)
- eSpeak-NG (`brew install espeak-ng` on macOS)

### 1. Clone and configure

```bash
git clone https://github.com/Ricardo-Jaramillo/Fluent-AI-language-Tutor.git
cd Fluent-AI-language-Tutor
cp .env.example .env
# Edit .env with your Supabase URL/keys and at minimum: DEEPSEEK_API_KEY
```

### 2. Set up Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **Project Settings > API** and copy the URL and anon key
3. Add them to `.env` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Create a `frontend/.env.local` with the same values plus `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
5. Run the migration in the Supabase SQL Editor (paste `supabase/migrations/20260224000000_initial_schema.sql`)

### 3. Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cd backend && uvicorn app.main:app --reload --port 8000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker (alternative)

```bash
# Ensure .env has your Supabase cloud keys and API keys
docker compose up --build
```

The frontend runs on port 3000, backend on port 8000.

## Project Structure

```
fluent/
├── backend/                 # Python FastAPI
│   ├── app/
│   │   ├── main.py          # API routes + CORS
│   │   ├── stt/             # Speech-to-text (faster-whisper)
│   │   ├── tts/             # Text-to-speech (Piper)
│   │   ├── ipa/             # IPA analysis (eSpeak-NG)
│   │   ├── llm/             # LLM providers (4 backends)
│   │   └── ws/              # WebSocket conversation handler
│   └── tests/               # 20 pytest tests
├── frontend/                # Next.js 15
│   └── src/
│       ├── app/[locale]/    # Route pages (landing, auth, onboarding, session, dashboard, settings)
│       ├── components/
│       │   ├── ui/          # 13 reusable components (Button, Card, Modal, etc.)
│       │   ├── layout/      # NavBar, Sidebar, MobileDrawer, PageContainer
│       │   └── modes/       # FreeChat, RealTimeCorrection, GuidedTeaching
│       ├── stores/          # Zustand stores (session, settings, toast, auth)
│       ├── lib/             # Supabase clients, animation presets
│       ├── i18n/            # next-intl config + 4 locale files
│       └── data/            # Syllabus JSON (72 topics, 5 levels)
├── supabase/                # CLI config + migration (6 tables with RLS)
├── docs/
│   ├── PRD.md               # Product requirements + implementation status
│   └── COSTS.md             # Cost analysis
└── scripts/                 # Syllabus validation
```

## Development

```bash
# Backend tests
cd backend && ../.venv/bin/python -m pytest tests/ -v

# Frontend build
cd frontend && npm run build

# Frontend lint
cd frontend && npm run lint

# Validate syllabus data
.venv/bin/python scripts/validate_syllabus.py
```

## Design System

Fluent uses a custom design system built from scratch with Tailwind CSS v4 and Framer Motion:

- **Colors**: Teal/Emerald primary + Violet accent
- **Components**: 13 custom UI components (no shadcn/radix dependencies)
- **Animations**: 12 reusable Framer Motion variants with `prefers-reduced-motion` support
- **Layout**: Responsive NavBar with mobile drawer, sidebars with mobile sheet triggers
- **Utilities**: Glass morphism (`.glass`), gradient text (`.gradient-text`), noise texture (`.noise-bg`)

## Syllabus

72 topics across 5 CEFR levels (A1-C1), organized into 12 modules. Each topic includes:
- 10-15 vocabulary words with translations
- 3-5 example phrases
- 2-3 conversation starters
- Pronunciation focus areas per level

## Implementation Status

See [docs/PRD.md](docs/PRD.md) Section 21 for a detailed feature-by-feature implementation matrix. The key gap is **frontend-backend integration** — both halves are built but not yet connected.

## Cost

The hybrid architecture (local STT/TTS/IPA + cloud LLM) costs ~$0.005/session with DeepSeek V3, compared to $0.60-$1.80/session for an all-cloud approach. See [docs/COSTS.md](docs/COSTS.md) for full breakdown.

## License

Private project.
