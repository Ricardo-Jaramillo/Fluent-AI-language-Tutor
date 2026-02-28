# Fluent - Product Requirements Document

## 1. Overview

Fluent is an AI-powered German learning application focused on spoken practice (Sprechen), covering levels A1 through C1. It uses open-source tools for speech processing and provides full phonetic (IPA) analysis from day one.

The core thesis: German learners have plenty of grammar resources but almost no affordable, private, always-available conversation partners. Fluent fills that gap with AI-driven spoken practice that adapts to the learner's level, corrects in real time, and provides phonetic-level pronunciation feedback.

---

## 2. User Personas & Journeys

### Persona A: "Complete Beginner" (A1)

**Profile**: Has a grammar book (or Duolingo tree), knows basic vocabulary, but is intimidated by speaking. Understands "Ich bin..." but freezes when forming sentences aloud.

**Needs**: Heavy scaffolding, repeat-after-me exercises, vocabulary drilling, encouragement.

**Journey**:
1. Signs up, selects A1
2. Onboarding recommends **Guided Teaching** mode
3. First session: repeat-after-me with "Hallo, ich heiße..." phrases
4. IPA modal shows pronunciation of key words
5. After 5-10 sessions, progresses to short 2-3 phrase exchanges in semi-guided Free Chat
6. Dashboard shows improvement in pronunciation scores over time

### Persona B: "Intermediate Learner" (B1-B2)

**Profile**: Can hold basic conversations, traveled to Germany, wants to refine grammar and expand vocabulary. Makes case errors and struggles with Konjunktiv II.

**Needs**: Natural conversation practice, grammar correction, topic-based vocabulary expansion.

**Journey**:
1. Signs up, selects B1
2. Uses **Free Chat** for open conversation and **Real-Time Correction** for focused grammar work
3. Notices recurring article errors flagged across sessions
4. Switches to Guided Teaching for specific weak topics
5. Over weeks, correction frequency decreases as patterns are internalized

### Persona C: "Advanced Polisher" (C1)

**Profile**: Near-fluent, works in a German-speaking environment. Wants to eliminate fossilized errors, improve register awareness, and sound more natural.

**Needs**: Nuanced correction (style, idioms, colloquialisms), debate-level conversation, formal register practice.

**Journey**:
1. Signs up, selects C1
2. Primarily uses **Free Chat** at near-native level
3. **Real-Time Correction** catches subtle errors: word order in subordinate clauses, Konjunktiv usage
4. IPA analysis identifies persistent pronunciation patterns (e.g., CH-Laut variations)
5. Dashboard tracks diminishing error rates across advanced categories

---

## 3. Core Features

### 3 Conversation Modes

1. **Free Chat**: Open-ended German conversation at the user's level. Post-session analysis shows errors and scores.
2. **Real-Time Correction**: Split-screen UI with live corrections as the user speaks. Grammar and pronunciation errors highlighted inline.
3. **Guided Teaching**: Structured lessons following the syllabus. AI presents vocabulary, example phrases, and conversation starters, then guides practice.

### Level-Adaptive Mode Behavior

This is the most critical design decision in Fluent. Each mode behaves fundamentally differently depending on the learner's level:

| Mode | A1 | A2 | B1 | B2 | C1 |
|------|----|----|----|----|-----|
| **Free Chat** | Semi-guided: 2-3 phrase exchanges. AI scaffolds heavily, suggests words, keeps topics simple. | Slightly longer exchanges. AI still scaffolds but expects more initiative. | True free chat begins. AI simplifies vocab when needed. | Natural conversation, complex topics, opinions. | Fully natural, near-native discussion. |
| **Real-Time Correction** | Basic: articles (der/die/das), conjugation (ich bin/du bist). Very encouraging tone. | Cases, prepositions, plurals. Still encouraging. | Subtle grammar errors flagged. Word order issues. | Konjunktiv II, advanced word order, register awareness. | Style, colloquialisms, idioms, formal vs informal. |
| **Guided Teaching** | Repeat-after-me, fill-in-the-blank, single words and short phrases. | Short sentence construction, simple dialogues. | Scenario-based role-play, opinion formation. | Discussion, argumentation, complex scenarios. | Debate, formal register, professional communication. |

**Key constraint**: A1-A2 learners cannot truly "free chat" — they lack the vocabulary. Free Chat at these levels is actually semi-guided with heavy AI scaffolding.

### Phonetic Analysis (IPA)

- Every user utterance is analyzed for pronunciation
- Low-confidence words from STT are flagged
- IPA comparison: what user said vs correct pronunciation
- Clickable words open modal with IPA details and audio playback
- LLM generates natural language explanation of differences

### Progress Tracking

- Per-session scores: fluency, grammar, pronunciation
- Per-topic/module/level progress aggregation
- Session history with filters
- Error pattern visualization

### Multi-Language UI

- Interface available in English, Spanish, French, German
- AI agent always speaks German regardless of UI language
- User can switch language in settings

### Multi-LLM Support

- Default: DeepSeek V3 (cheapest)
- Also supports: Claude, OpenAI, Gemini
- Configurable per-user in settings

---

## 4. Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS v4, Framer Motion, Zustand, next-intl
- **Backend**: Python FastAPI, WebSockets
- **STT**: faster-whisper (local, Apple Silicon optimized)
- **TTS**: Piper TTS (local, German voices)
- **IPA**: eSpeak-NG + Phonemizer (local, deterministic)
- **LLM**: Multi-provider (DeepSeek, Claude, OpenAI, Gemini)
- **Database**: Supabase PostgreSQL with Row Level Security
- **Auth**: Supabase Auth with auto-profile creation trigger

---

## 5. IPA Architecture Rationale

### Why not use LLMs for IPA?

Research (PhonologyBench and others) demonstrates that LLMs consistently fail at German IPA transcription. They hallucinate phonemes, especially for:
- CH-Laut variations (/x/ vs /c/)
- Umlauts (o vs oe)
- Vowel length distinctions
- Consonant clusters (e.g., "Strumpf" /StrUmpf/)

### The deterministic pipeline

```
User speaks -> faster-whisper (STT + word-level timestamps + confidence scores)
  -> Low-confidence words flagged
  -> eSpeak-NG + Phonemizer generates IPA for both spoken and correct forms
  -> LLM ONLY explains differences in natural language (what it's good at)
  -> Piper TTS generates correct pronunciation audio
  -> Frontend renders clickable IPA modal
```

**Key principle**: eSpeak-NG produces deterministic, correct IPA. The LLM's role is limited to generating human-readable explanations of the differences — a task where it excels.

### Future enhancement

Montreal Forced Aligner for phone-level temporal alignment, enabling per-phoneme feedback within individual words.

---

## 6. Latency & Streaming Architecture

### Pipeline breakdown

| Stage | Latency | Notes |
|-------|---------|-------|
| STT (faster-whisper) | 0.5-1.5s | Local inference, Apple Silicon |
| LLM response | 1-3s | Depends on provider, token count |
| TTS (Piper) | 0.3-0.8s | Local synthesis |
| **Total** | **2-5s** | End-to-end |

### Streaming strategy

TTS synthesis begins as soon as the first complete sentence arrives from the LLM, while the LLM continues generating. This overlaps TTS latency with LLM generation.

### Targets

- **MVP**: ~2-3s perceived latency (speech end to first audio response)
- **Phase 2**: Deepgram streaming STT reduces STT to ~200ms chunks, bringing total to ~1.5-2.5s

### WebSocket architecture

Single persistent WebSocket per session handles:
1. Audio chunks (user -> server)
2. Transcription results (server -> client)
3. LLM response tokens (server -> client, streamed)
4. TTS audio chunks (server -> client, streamed)
5. IPA analysis results (server -> client)

---

## 7. Realistic Learning Timeline

German requires approximately 750 hours of study to reach C1 from zero (FSI estimate). Fluent covers spoken practice, which is one component of the learning process.

| Level | Hours of spoken practice | Cumulative |
|-------|-------------------------|------------|
| A1 | 80-100 hours | 80-100 |
| A2 | 60-80 hours | 140-180 |
| B1 | 50-70 hours | 190-250 |
| B2 | 40-60 hours | 230-310 |
| C1 | 30-90 hours | 260-400 |

**No rigid timelines**: Fluent uses Level > Module > Topics progression, entirely self-paced. A motivated learner doing 30min/day could reach B1 in ~6 months. A casual learner at 15min/day might take 12+ months.

---

## 8. Cost Considerations

### Why hybrid (local + cloud)?

| Approach | Cost per session | Monthly (1/day) |
|----------|-----------------|-----------------|
| All-cloud (Deepgram + ElevenLabs + Claude) | $0.60-$1.80 | $18-54 |
| Hybrid (local STT/TTS/IPA + DeepSeek) | ~$0.005 | ~$0.15 |

The hybrid approach is **120-360x cheaper** while maintaining quality for the core learning experience.

### Current costs (Phase 1)

| Service | Cost | Notes |
|---------|------|-------|
| faster-whisper | $0 | Local, Apple Silicon |
| Piper TTS | $0 | Local, German voices |
| eSpeak-NG + Phonemizer | $0 | Local, deterministic |
| DeepSeek V3 | ~$0.005/session | $0.14/M input, $0.28/M output |
| Supabase Local | $0 | Dev via CLI + Docker |
| **Total (dev)** | **~$0.15/mo** | Only LLM costs |
| **Total (prod)** | **~$25.15/mo** | Supabase Pro ($25) + LLM |

### Cacheability

Teaching mode responses for common topics (A1 greetings, A1 numbers, etc.) are highly cacheable. The same vocabulary drills and example phrases can be reused across users, further reducing LLM costs.

### Upgrade paths

1. **STT**: faster-whisper -> Deepgram Streaming ($0.0043/min, lower latency)
2. **TTS**: Piper TTS -> ElevenLabs ($5+/mo, more natural voices)
3. **LLM**: DeepSeek V3 -> Claude Haiku (quality) -> Claude Sonnet (best)
4. **DB**: Supabase Local -> Supabase Pro ($25/mo) -> Team ($599/mo)

---

## 9. Future Mode: Active Vocabulary

A 4th mode for isolated word and phrase pronunciation practice — audio flashcards.

**Rationale**: A1-A2 learners need to build vocabulary before they can converse. Current modes all assume some ability to form sentences. Active Vocabulary bridges the gap.

**Features**:
- Audio flashcard format: hear word -> repeat -> get IPA feedback
- Spaced repetition scheduling based on pronunciation accuracy
- Uses existing IPA + TTS pipeline (no new infrastructure)
- Vocabulary sourced from syllabus topics
- "Warm-up" option before conversation sessions

**Implementation**: Phase 2. Uses existing eSpeak-NG, Phonemizer, and Piper TTS — only needs a new frontend mode and a spaced repetition scheduler.

---

## 10. Syllabus

- 5 levels: A1, A2, B1, B2, C1
- 72 topics across 12 modules
- Each topic: 10-15 vocabulary words, 3-5 example phrases, 2-3 conversation starters
- Includes pronunciation focus modules per level
- Mix of everyday and professional contexts

---

## 11. Architecture

```
User speaks -> faster-whisper (STT + word timestamps)
    -> Transcribed text + confidence scores
    -> Low-confidence words flagged
    -> eSpeak-NG generates IPA (spoken vs correct)
    -> LLM explains differences
    -> Piper TTS generates correct audio
    -> Frontend renders clickable IPA modal
```

---

## 12. Database Schema

6 tables with Row Level Security:
- `profiles` - User profile extending Supabase Auth
- `sessions` - Conversation sessions with scores
- `messages` - Individual messages per session
- `pronunciation_errors` - IPA analysis per word
- `grammar_errors` - Grammar corrections
- `progress` - Per-topic progress tracking

---

## 13. Performance Requirements

### Backend targets

| Metric | Target | Notes |
|--------|--------|-------|
| STT processing | < 2s | 15s audio clip on Apple Silicon |
| LLM first token | < 500ms | DeepSeek V3 via API |
| TTS synthesis | < 500ms | Short response sentences |
| Total perceived latency | < 3s | Speech end to first audio |

### Frontend targets

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3s |
| Cumulative Layout Shift (CLS) | < 0.1 |

---

## 14. Error Handling & Fallbacks

| Failure | Fallback |
|---------|----------|
| STT fails / no speech detected | Text input fallback — user types instead |
| LLM timeout (>10s) | Retry once, then fallback to alternate provider |
| LLM provider error | Automatic fallback: DeepSeek -> OpenAI -> Claude |
| TTS synthesis fails | Display text response only, skip audio |
| WebSocket disconnect | Auto-reconnect with exponential backoff (1s, 2s, 4s, 8s, max 30s) |
| Offline | Local session data persists, sync on reconnect |
| Mic permission denied | Clear error message with browser-specific instructions |
| Audio format unsupported | Convert to WAV client-side before sending |

---

## 15. Security & Privacy

- **Audio storage**: Raw audio is NOT stored on the server. Only transcriptions are persisted.
- **GDPR compliance**: Full data export and account deletion endpoints
- **API keys**: Never exposed to the frontend. All LLM/service calls go through the backend.
- **WebSocket auth**: Authenticated via Supabase JWT token on connection
- **Row Level Security**: All database tables enforce user-scoped access
- **Input sanitization**: All user text inputs sanitized before LLM prompts
- **Rate limiting**: Per-user rate limits on API endpoints to prevent abuse

---

## 16. Accessibility

- **Target**: WCAG 2.1 AA compliance
- **Reduced motion**: All animations respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion`
- **ARIA labels**: Mic button states (idle, recording, processing), live regions for incoming messages
- **Keyboard navigation**: Full keyboard support for all interactive elements
- **Screen reader**: Session messages announced via `aria-live="polite"` regions
- **Color contrast**: All text meets 4.5:1 minimum contrast ratio against backgrounds
- **Focus indicators**: Visible focus rings on all interactive elements

---

## 17. Success Metrics

### Engagement

| Metric | Target (3-month) |
|--------|-------------------|
| Sessions per week | >= 3 |
| Average session duration | 10-15 min |
| Messages per session | >= 10 |
| Mode distribution | No mode < 15% usage |

### Retention

| Metric | Target |
|--------|--------|
| D1 retention | >= 60% |
| D7 retention | >= 40% |
| D30 retention | >= 25% |

### Learning outcomes

| Metric | Target |
|--------|--------|
| Score improvement over 10 sessions | >= 5% |
| Pronunciation error reduction per topic | >= 20% after 5 sessions |
| Module completion rate | >= 50% of started modules |

### Technical

| Metric | Target |
|--------|--------|
| End-to-end latency (p95) | < 4s |
| Uptime | >= 99.5% |
| Error rate | < 1% of sessions |
| WebSocket reconnection success | >= 95% |

---

## 18. User Flows

### Onboarding flow
```
Landing -> Auth (Sign Up / Sign In) -> Select Level -> Select Module -> Select Topic -> Select Mode -> Session
```

### Session flow
```
Session Start -> Record (hold mic) -> STT Processing -> LLM Response (streamed)
  -> TTS Playback -> IPA Analysis (clickable words) -> Continue / End Session
  -> End -> Score Summary -> Dashboard
```

### Progress review flow
```
Dashboard -> Session History -> Session Detail -> Error Review -> IPA Modal -> TTS Replay
```

### Settings flow
```
Settings -> Language / LLM Provider / Theme -> Save -> Toast confirmation
```

---

## 19. Phase 2 Roadmap (Near-term)

### Conversation Starter Chips
Tappable suggestion chips for A1-A2 learners ("Hallo, ich bin...", "Ich wohne in...", "Ich mag..."). Reduces blank-page anxiety when learners don't know how to start.

### Voice Level Indicator
Real-time volume meter during recording so users can confirm their microphone is working and adjust speaking volume.

### Session Warm-Up
30-second "Repeat after me: Guten Tag!" warm-up before the main conversation. Eases learners in, calibrates the microphone, and reduces first-message anxiety.

### Error Pattern Intelligence
Track recurring errors across sessions. Proactively suggest targeted review: "You've made article errors in 4 sessions — practice der/die/das?" Surfaces patterns the learner might not notice.

### Contextual Help Tooltips
First-time user tooltips on UI elements (mic button, IPA modal, mode selection). Dismissible, never shows again after dismissal. Critical for making the IPA modal discoverable.

### Active Vocabulary Mode
Audio flashcards for isolated word pronunciation practice (see Section 9).

---

## 20. Phase 3 Roadmap (Future)

### Gamification Layer
Daily streaks, XP points, level-up celebrations, achievement badges ("First Session", "7-Day Streak", "Perfect Pronunciation", "100 Words Practiced"). Drives daily engagement.

### Visual Progress Map
Winding path through the syllabus with German landmarks (Brandenburg Gate, Neuschwanstein, etc.). More elegant than a linear skill tree. Each node is a topic, color-coded by completion state.

### Session Replay
Replay full session transcript with synchronized audio. Click any message to hear the spoken version vs the correct pronunciation. Valuable for self-review.

### Sound Design
UI sounds for key interactions: "pop" on recording start, "ding" on good pronunciation score, "whoosh" on page transitions, subtle "click" on button presses. All sounds respect system mute/volume settings.

### Haptic Micro-Interactions
Weighty-feeling toggles, cards that "lift" on hover, physical mic button press feedback. Uses CSS transforms and spring animations to create a premium, physical-feeling interface.

### Streaming STT Upgrade
Replace faster-whisper batch processing with Deepgram streaming STT for real-time transcription as the user speaks. Reduces perceived latency significantly.

### Natural TTS Upgrade
Replace Piper TTS with ElevenLabs for more natural-sounding German voices. Higher cost but dramatically better user experience for advanced learners.

### Mobile App
React Native or PWA for mobile access. Core conversation flow works on mobile, optimized for one-handed mic-button usage.

### CI/CD Pipeline
Automated testing, linting, and deployment. GitHub Actions for backend tests, frontend build verification, and Supabase migration checks.

### Spaced Repetition Engine
Track individual word/phrase performance across sessions. Schedule reviews using SM-2 algorithm. Integrate with Active Vocabulary mode for targeted repetition.

---

## 21. Implementation Status

*Last updated: February 27, 2026*

### Legend
- **WORKING** — Feature is fully implemented and validated end-to-end
- **PARTIAL** — Core logic exists but integration or edge cases are incomplete
- **NOT STARTED** — Planned but no code yet

### Backend

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 1 | Health endpoint (`/api/health`) | WORKING | Returns status, version, eSpeak availability. Tested. |
| 2 | Chat API (`/api/chat`) | WORKING | All 4 LLM providers (DeepSeek, Claude, OpenAI, Gemini) fully implemented. |
| 3 | IPA analysis API (`/api/ipa/analyze`) | WORKING | eSpeak-NG integration, word-by-word IPA transcription. |
| 4 | IPA comparison API (`/api/ipa/compare`) | WORKING | Compares spoken vs correct IPA with severity levels. |
| 5 | TTS endpoint (`/api/tts`) | WORKING | Piper TTS with eSpeak-NG fallback, returns WAV audio. Tested (4 tests). |
| 6 | WebSocket handler (`/ws/conversation`) | WORKING | Text + audio + config + ping/pong. Full pipeline: audio → STT → IPA → LLM → response. Tested (10 tests). |
| 7 | STT engine (faster-whisper) | WORKING | Transcription with word-level timestamps and confidence scores. Connected to WebSocket handler. |
| 8 | TTS engine (Piper) | WORKING | Synthesize with model validation, input encoding, returncode checking. Piper → eSpeak-NG fallback chain. |
| 9 | IPA engine (eSpeak-NG) | WORKING | Deterministic IPA transcription, pronunciation comparison, severity levels (minor/moderate/severe). |
| 10 | LLM provider factory | WORKING | Factory pattern with 4 providers. Validated API keys. Tested. |
| 11 | Backend tests | WORKING | 37 tests across 9 test files: health, IPA (5), IPA integration (3), LLM factory (5), STT (5), TTS (4), TTS endpoint (4), WS audio (4), WS text (6). |

### Frontend-Backend Integration

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 12 | API client (`lib/api.ts`) | WORKING | BACKEND_URL config, `getWsUrl()` helper. Respects `NEXT_PUBLIC_BACKEND_URL`. |
| 13 | WebSocket client (`hooks/useWebSocket.ts`) | WORKING | Auto-reconnect with exponential backoff, ping/pong keepalive, binary support, visibility-aware. |
| 14 | Audio capture (`hooks/useAudioCapture.ts`) | WORKING | getUserMedia + MediaRecorder, WebM/Opus encoding, permission handling, stream cleanup. |
| 15 | Audio streaming to backend | WORKING | Mic → MediaRecorder → `audio_start` message → binary blob via WebSocket. |
| 16 | LLM response rendering | WORKING | WebSocket `response` messages → `addMessage()` → MessageBubble with animations. |
| 17 | TTS audio playback (`lib/audio.ts`) | WORKING | Fetches `/api/tts`, plays via HTMLAudioElement, state tracking, stop/cleanup. |
| 18 | System prompts (`lib/prompts.ts`) | WORKING | Mode-aware prompt builder: chat/correction/teaching with level and topic context. |

### Database & Auth

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 19 | Supabase schema (6 tables + RLS) | WORKING | profiles, sessions, messages, pronunciation_errors, grammar_errors, progress. |
| 20 | Auth: Sign up/in | WORKING | Real Supabase Auth calls with error handling and form validation. |
| 21 | Auth: Route protection (middleware) | WORKING | Middleware checks auth on protected routes, redirects to /auth. |
| 22 | Auth: Sign out | WORKING | NavBar button calls supabase.auth.signOut(). |
| 23 | Auth: Password reset | NOT STARTED | i18n text exists, no code. |
| 24 | Auth: User state in app | WORKING | AuthProvider fetches user on mount, listens for auth changes, populates useAuthStore. |
| 25 | Session persistence to DB | WORKING | Session row created on connect, messages saved on send/receive, scores updated on end. |
| 26 | Dashboard data queries | WORKING | Queries sessions table with ordering/limits, computes score averages. |
| 27 | Profile data from DB | WORKING | AuthProvider reads profile, settings page persists ui_language and llm_provider to profiles table. |

### Frontend Features

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 28 | Landing page | WORKING | Gradient hero, glass feature cards, stats bar, animated CTA. All text via i18n. |
| 29 | Auth page | WORKING | Glass card, cross-fade sign in/up, password strength indicator, error display. |
| 30 | Onboarding (4-step wizard) | PARTIAL | Level/Module/Topic/Mode selection works with syllabus data. Not persisted to DB. Selections lost on refresh. |
| 31 | Session page (full integration) | WORKING | 565-line page wiring WebSocket, audio capture, messages, TTS, IPA, and DB persistence. Connection status indicator. |
| 32 | Mic button (audio capture) | WORKING | Pulse rings, glow, state transitions. Captures real audio via useAudioCapture hook. |
| 33 | Conversation messages | WORKING | MessageBubble with slide-in animations. Real messages from WebSocket + Supabase. |
| 34 | Free Chat mode | WORKING | Open conversation at user's level. Empty state with i18n text. |
| 35 | Real-Time Correction mode | WORKING | Main chat + corrections sidebar showing last 5 assistant messages. All text via i18n. |
| 36 | Guided Teaching mode | WORKING | Topic vocabulary sidebar, conversation starters, lesson progress bar. All text via i18n. |
| 37 | IPA Modal | WORKING | Color-coded IPA diff, severity badge, TTS playback, explanation area. All text via i18n. |
| 38 | Session End Overlay | WORKING | Animated score rings (fluency/grammar/pronunciation), overall score, practice again / view dashboard buttons. All text via i18n. |
| 39 | Dashboard (stats + history) | WORKING | Real Supabase data: session count, average scores, skill breakdown, session history list. |
| 40 | Settings: Language switching | WORKING | next-intl locale switching via settings page + NavBar dropdown. All 4 locales complete. |
| 41 | Settings: LLM provider | WORKING | Selection persists to localStorage and Supabase profiles table. Sent to backend via WebSocket config. |
| 42 | Settings: Theme | WORKING | ThemeProvider applies dark/light/system class to `<html>`. Persists to localStorage. |
| 43 | Settings: Delete account | PARTIAL | Calls supabase.auth.signOut() with confirmation dialog. Does not fully delete Supabase data. |
| 44 | Toast notifications | WORKING | Used for settings feedback. |
| 45 | i18n (4 languages) | WORKING | EN/ES/FR/DE complete. All UI strings through next-intl — zero hardcoded strings. |
| 46 | UI component library (13 components) | WORKING | Button, Card, Input, Badge, Spinner, Skeleton, ProgressBar, Modal, Toast, Toggle, Select, Avatar, Tooltip. |
| 47 | Animation system | WORKING | 12 reusable Framer Motion variants. Page transitions, stagger, scroll reveal. |
| 48 | Responsive layout (NavBar + Sidebar) | WORKING | Desktop nav, mobile hamburger drawer, sidebar with mobile trigger. |
| 49 | Design token system | WORKING | Full CSS custom properties: colors, surfaces, typography, shadows, radii, z-index, transitions. |
| 50 | Docker (frontend + backend) | WORKING | docker-compose with build args for NEXT_PUBLIC_ vars, host.docker.internal networking. |

### Remaining Work (Priority Order)

1. **Grammar scoring** — Currently placeholder (~70 + message count). Should use LLM feedback for real scoring.
2. **Onboarding persistence** — Selections lost on refresh. Should persist to session store or Supabase.
3. **Password reset** — i18n text exists, no code.
4. **Account deletion** — Currently just signs out. Should delete Supabase user data.
5. **Error pattern tracking** — No cross-session error analysis yet (Phase 2 feature).
6. **Streaming LLM responses** — Currently waits for full response. Could stream tokens for perceived latency.
