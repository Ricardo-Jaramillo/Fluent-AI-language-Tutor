# Fluent - Product Requirements Document

## 1. Overview

Fluent is an AI-powered **multi-language** learning application focused on spoken practice, covering levels A1 through C1. It launches with **German** as the first target language, with **French, Spanish, Italian, and Portuguese** following. It uses open-source tools for speech processing and provides full phonetic (IPA) analysis from day one.

The core thesis: language learners have plenty of grammar resources but almost no affordable, private, always-available conversation partners. Fluent fills that gap with AI-driven spoken practice that adapts to the learner's level, provides natural corrections without interrupting conversation flow, and delivers phonetic-level pronunciation feedback.

### Key differentiators
- **Multi-language support** — not locked to a single target language (unlike Loora, which is English-only)
- **Open-source speech pipeline** — faster-whisper + Piper TTS run locally, no vendor lock-in
- **IPA phoneme-level feedback** — deterministic pronunciation analysis, not LLM guessing
- **Cultural/naturalness corrections** — flags phrases that are grammatically correct but sound unnatural
- **Multi-LLM choice** — users pick their preferred AI provider
- **Hybrid local+cloud architecture** — 100x cheaper than all-cloud, enabling an aggressive free tier

---

## 2. User Personas & Journeys

### Persona A: "Complete Beginner" (A1)

**Profile**: Has a grammar book (or Duolingo tree), knows basic vocabulary, but is intimidated by speaking. Understands "Ich bin..." but freezes when forming sentences aloud.

**Needs**: Heavy scaffolding, conversation starters, vocabulary drilling, encouragement.

**Journey**:
1. Signs up, selects target language (e.g., German) during onboarding
2. Picks A1 level, sets goals (e.g., Travel, Daily Life)
3. First session: sees conversation starters ("Hallo, ich heiße...", "Ich wohne in...")
4. AI scaffolds heavily — keeps topics simple, suggests words
5. Corrections appear as subtle dots on messages; tapping reveals what a native speaker would say
6. IPA modal shows pronunciation of key words
7. Post-session summary highlights 3 key takeaways
8. After 5-10 sessions, progresses to longer exchanges as confidence builds
9. Dashboard shows improvement in pronunciation scores and streak over time

### Persona B: "Intermediate Learner" (B1-B2)

**Profile**: Can hold basic conversations, traveled to a German-speaking country, wants to refine grammar and expand vocabulary. Makes case errors and struggles with Konjunktiv II.

**Needs**: Natural conversation practice, non-interrupting grammar correction, topic-based vocabulary expansion.

**Journey**:
1. Signs up, selects target language and B1 level
2. Uses conversation mode for open practice — AI responds naturally first, corrections come separately
3. Taps correction dots on messages to see what a native speaker would say + explanation
4. Notices recurring article errors flagged across sessions in dashboard error patterns
5. Over weeks, correction frequency decreases as patterns are internalized

### Persona C: "Advanced Polisher" (C1)

**Profile**: Near-fluent, works in a German-speaking environment. Wants to eliminate fossilized errors, improve register awareness, and sound more natural.

**Needs**: Nuanced correction (style, idioms, colloquialisms), debate-level conversation, cultural/naturalness feedback.

**Journey**:
1. Signs up, selects C1 level
2. Engages in near-native conversation on complex topics
3. AI catches subtle errors: word order in subordinate clauses, Konjunktiv usage
4. Gets cultural corrections: "You said 'Ich bin kalt' — grammatically possible but Germans say 'Mir ist kalt'"
5. IPA analysis identifies persistent pronunciation patterns (e.g., CH-Laut variations)
6. Dashboard tracks diminishing error rates across advanced categories

---

## 3. Core Features

### Unified Conversation Mode

Fluent uses a single **unified conversation mode** that adapts its behavior based on the learner's level. This replaces the previous 3-mode approach (Free Chat / Real-Time Correction / Guided Teaching) with a more natural experience.

**How it works:**
- The AI always responds naturally first — continuing the conversation, not interrupting with corrections
- Corrections are extracted from the AI response and displayed separately using the **tap-to-fix** pattern
- At lower levels (A1-A2), the AI provides more scaffolding, conversation starters, and simpler vocabulary
- At higher levels (B2-C1), the AI engages in complex topics and catches nuanced errors

### Level-Adaptive Behavior

| Aspect | A1 | A2 | B1 | B2 | C1 |
|--------|----|----|----|----|-----|
| **Conversation** | Semi-guided: 2-3 phrase exchanges. AI scaffolds heavily, suggests words, keeps topics simple. | Slightly longer exchanges. AI still scaffolds but expects more initiative. | True open conversation begins. AI simplifies vocab when needed. | Natural conversation, complex topics, opinions. | Fully natural, near-native discussion. |
| **Corrections** | Basic: articles (der/die/das), conjugation (ich bin/du bist). Very encouraging tone. | Cases, prepositions, plurals. Still encouraging. | Subtle grammar errors flagged. Word order issues. | Konjunktiv II, advanced word order, register awareness. | Style, colloquialisms, idioms, formal vs informal. |
| **Naturalness** | Not flagged at this level. | Occasional tips on common phrases. | "Germans would more naturally say..." type feedback. | Cultural context, register switching. | Debate-level, professional register, idiomatic usage. |
| **Starters** | Always shown: "Hallo, ich heiße...", "Ich wohne in..." | Available but optional. | Hidden by default. | Not shown. | Not shown. |

### Tap-to-Fix Correction Pattern (Loora-inspired)

The correction UX is designed to feel like optional coaching, not a grammar exam:

- The AI response is displayed **clean** — no inline correction markers visible in the conversation
- User messages show a small colored dot/badge when corrections exist
- Tapping the dot opens a bottom sheet (mobile) or side panel (desktop) with:
  - **What you said** vs. **What a native speaker would say**
  - Brief explanation of why
  - Per-word pronunciation scores (if IPA data exists)
- Corrections are extracted from the LLM response using structured markers (`❌ → ✅` format) via `parseCorrections.ts`
- If the LLM doesn't include corrections, the message shows no dot — no false indicators

### Cultural & Naturalness Corrections

Beyond grammar, Fluent flags phrases that are grammatically correct but sound unnatural to native speakers:
- "You said 'Ich bin kalt' — grammatically possible but Germans say 'Mir ist kalt'"
- "You said 'Ich habe Angst von Spinnen' — Germans say 'Ich habe Angst vor Spinnen'"
- These appear in the tap-to-fix panel alongside grammar corrections, tagged as "naturalness" feedback

### Phonetic Analysis (IPA)

- Every user utterance is analyzed for pronunciation
- Low-confidence words from STT are flagged with severity based on confidence score
- IPA transcription: correct form generated by eSpeak-NG (deterministic)
- Clickable words open modal with IPA details and audio playback
- LLM generates natural language explanation of differences

### Progress Tracking

- Per-session scores: fluency, grammar, pronunciation
- Grammar and pronunciation errors persisted to DB across sessions
- Error pattern analysis: recurring mistakes highlighted on dashboard
- Daily streak tracking with milestone celebrations
- Per-topic progress aggregation via `progress` table
- Session history with filters

### Multi-Language Target Selection

- **Target languages**: German (launch), French, Spanish, Italian, Portuguese (expandable)
- Users select their target language during onboarding
- Target language determines: STT language, TTS voices, IPA analysis language, system prompts, conversation starters, and topic suggestions
- Target language can be changed in settings (Pro tier: any language; Free tier: German only)

### Multi-Language UI

- Interface available in English, Spanish, French, German
- AI agent speaks in the user's **target language** (not tied to UI language)
- User can switch UI language in settings independently of target language

### Multi-LLM Support

- Default: DeepSeek V3 (cheapest, free tier only)
- Also supports: Claude, OpenAI, Gemini (Pro tier)
- Configurable per-user in settings

---

## 4. Onboarding Flow

New users go through a 4-step onboarding wizard (Loora-inspired) after signup:

### Step 1: Target Language
- Visual cards for each supported language (German, French, Spanish, Italian, Portuguese)
- Each card shows the language name + flag icon
- Single selection, defaults to German

### Step 2: Level
- A1 through C1 with plain-language descriptions:
  - A1: "I know a few words"
  - A2: "I can handle basic conversations"
  - B1: "I can talk about familiar topics"
  - B2: "I can discuss complex subjects"
  - C1: "I'm nearly fluent"
- Tappable cards, one selection

### Step 3: Goals
- Multi-select chips: Travel, Work, Study, Daily Life, Culture, Exam Prep
- These influence topic suggestions and system prompt context
- At least one required

### Step 4: Welcome
- Encouraging message acknowledging speaking anxiety
- "Many people are nervous about speaking a new language. That's completely normal. Fluent is your private, judgment-free practice partner."
- "Start your first session" CTA button

**Data persistence**: All selections saved to Supabase `profiles` table (`target_language`, `level`, `goals`).

**Flow**: Signup → Onboarding → Dashboard (first-time) / Session (returning user)

---

## 5. Monetization

### Freemium Model

| Feature | Free | Pro ($9.99/mo) |
|---------|------|----------------|
| Sessions per day | 3 | Unlimited |
| Target languages | 1 (German) | All 5 |
| LLM providers | DeepSeek only | All 4 (DeepSeek, Claude, OpenAI, Gemini) |
| Session length | 10 min max | Unlimited |
| Error history | Last 7 days | All time |
| Priority support | No | Yes |

### Payment Infrastructure
- **Stripe Checkout** (hosted page) — minimizes frontend complexity
- **Stripe Customer Portal** — for subscription management (cancel, update payment)
- **Webhook-driven** — subscription state synced via Stripe webhooks to `subscriptions` table
- `subscription_status` field on `profiles` for quick tier checks

### Free Tier Enforcement
- Session count tracked per user per day in backend
- When limit reached: clear upgrade prompt with pricing and "Upgrade to Pro" CTA
- WebSocket connection rejected with specific code when daily limit exceeded
- Rate limiting: 30 msg/min per user on WS, 10 req/min on HTTP endpoints

### Upgrade UX
- Upgrade prompt shown when limit hit (modal with pricing breakdown)
- Pro badge in navbar for subscribed users
- Pricing page accessible from landing page and settings

---

## 6. Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS v4, Framer Motion, Zustand, next-intl, lucide-react
- **Backend**: Python FastAPI, WebSockets
- **STT**: faster-whisper (local, Apple Silicon optimized, multi-language)
- **TTS**: Piper TTS (local, multi-language voice registry) with eSpeak-NG fallback
- **IPA**: eSpeak-NG + Phonemizer (local, deterministic, multi-language)
- **LLM**: Multi-provider (DeepSeek, Claude, OpenAI, Gemini)
- **Database**: Supabase PostgreSQL with Row Level Security
- **Auth**: Supabase Auth with auto-profile creation trigger
- **Payments**: Stripe Checkout + Webhooks
- **Monitoring**: Structured JSON logging + Sentry
- **CI/CD**: GitHub Actions

---

## 7. IPA Architecture Rationale

### Why not use LLMs for IPA?

Research (PhonologyBench and others) demonstrates that LLMs consistently fail at IPA transcription. They hallucinate phonemes, especially for:
- CH-Laut variations (/x/ vs /c/) in German
- Umlauts (o vs oe)
- Vowel length distinctions
- Consonant clusters (e.g., "Strumpf" /StrUmpf/)
- Nasal vowels in French
- Rolled R variations across languages

### The deterministic pipeline

```
User speaks -> faster-whisper (STT + word-level timestamps + confidence scores)
  -> Low-confidence words flagged (severity by confidence score)
  -> eSpeak-NG + Phonemizer generates correct IPA form
  -> LLM ONLY explains differences in natural language (what it's good at)
  -> Piper TTS generates correct pronunciation audio
  -> Frontend renders clickable IPA modal
```

**Key principle**: eSpeak-NG produces deterministic, correct IPA. The LLM's role is limited to generating human-readable explanations of the differences — a task where it excels.

**Note**: The spoken IPA is inherently unknown from STT text alone. Low-confidence words are flagged based on STT confidence scores, not IPA-to-IPA comparison.

### Future enhancement

Montreal Forced Aligner for phone-level temporal alignment, enabling per-phoneme feedback within individual words.

---

## 8. Latency & Streaming Architecture

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
- **Future**: Deepgram streaming STT reduces STT to ~200ms chunks, bringing total to ~1.5-2.5s

### WebSocket architecture

Single persistent WebSocket per session handles:
1. Audio chunks (user -> server)
2. Transcription results (server -> client)
3. LLM response tokens (server -> client, streamed)
4. TTS audio chunks (server -> client, binary)
5. IPA analysis results (server -> client)
6. Configuration messages (language, level, provider)
7. Keepalive ping/pong

**Authentication**: Client sends Supabase JWT as query parameter on WebSocket connect. Backend validates JWT using Supabase's JWKS or service-role key. On failure, connection closed with code 4001. Frontend gets JWT from `supabase.auth.getSession()` and refreshes before connecting.

---

## 9. Realistic Learning Timeline

Language learning requires significant time investment. Fluent covers spoken practice, which is one component of the learning process.

| Level | Hours of spoken practice | Cumulative |
|-------|-------------------------|------------|
| A1 | 80-100 hours | 80-100 |
| A2 | 60-80 hours | 140-180 |
| B1 | 50-70 hours | 190-250 |
| B2 | 40-60 hours | 230-310 |
| C1 | 30-90 hours | 260-400 |

**No rigid timelines**: Fluent uses Level > Topic progression, entirely self-paced. A motivated learner doing 30min/day could reach B1 in ~6 months. A casual learner at 15min/day might take 12+ months.

---

## 10. Cost Considerations

### Why hybrid (local + cloud)?

| Approach | Cost per session | Monthly (1/day) |
|----------|-----------------|-----------------|
| All-cloud (Deepgram + ElevenLabs + Claude) | $0.60-$1.80 | $18-54 |
| Hybrid (local STT/TTS/IPA + DeepSeek) | ~$0.005 | ~$0.15 |

The hybrid approach is **120-360x cheaper** while maintaining quality for the core learning experience. This cost advantage enables an aggressive free tier (3 sessions/day) that would be impossible with an all-cloud stack.

### Current costs

| Service | Cost | Notes |
|---------|------|-------|
| faster-whisper | $0 | Local, Apple Silicon |
| Piper TTS | $0 | Local, multi-language voices |
| eSpeak-NG + Phonemizer | $0 | Local, deterministic |
| DeepSeek V3 | ~$0.005/session | $0.14/M input, $0.28/M output |
| Supabase Pro | $25/mo | Cloud PostgreSQL with RLS |
| Stripe | 2.9% + $0.30/txn | Only on Pro subscriptions |
| **Total (prod, pre-revenue)** | **~$25.15/mo** | Supabase + LLM |

### Cacheability

Common conversation starters and vocabulary drills (A1 greetings, A1 numbers, etc.) are highly cacheable. The same example phrases can be reused across users, further reducing LLM costs.

### Upgrade paths

1. **STT**: faster-whisper -> Deepgram Streaming ($0.0043/min, lower latency)
2. **TTS**: Piper TTS -> ElevenLabs ($5+/mo, more natural voices) — potential Pro-tier perk
3. **LLM**: DeepSeek V3 -> Claude Haiku (quality) -> Claude Sonnet (best)
4. **DB**: Supabase Pro ($25/mo) -> Supabase Team ($599/mo) at scale

---

## 11. Future Mode: Active Vocabulary

A future mode for isolated word and phrase pronunciation practice — audio flashcards.

**Rationale**: A1-A2 learners need to build vocabulary before they can converse fluently. Active Vocabulary bridges the gap.

**Features**:
- Audio flashcard format: hear word -> repeat -> get IPA feedback
- Spaced repetition scheduling based on pronunciation accuracy
- Uses existing IPA + TTS pipeline (no new infrastructure)
- Vocabulary sourced from syllabus topics
- "Warm-up" option before conversation sessions

---

## 12. Syllabus

- 5 levels: A1, A2, B1, B2, C1
- 72 topics across 12 modules
- Each topic: 10-15 vocabulary words, 3-5 example phrases, 2-3 conversation starters
- Includes pronunciation focus modules per level
- Mix of everyday and professional contexts
- **Dynamic topic suggestions**: TopicChips adapt based on target language and level

---

## 13. Architecture

```
User speaks -> faster-whisper (STT + word timestamps, language-aware)
    -> Transcribed text + confidence scores
    -> Low-confidence words flagged (severity by confidence)
    -> eSpeak-NG generates correct IPA (target language)
    -> LLM responds naturally + includes structured corrections
    -> parseCorrections.ts extracts corrections, cleans AI response
    -> Piper TTS generates audio (target language voice)
    -> Frontend renders clean conversation + tap-to-fix dots
    -> Backend persists messages, grammar_errors, pronunciation_errors to DB
```

---

## 14. Database Schema

8 tables with Row Level Security:

- `profiles` — User profile extending Supabase Auth (includes `target_language`, `level`, `goals`, `subscription_status`)
- `sessions` — Conversation sessions with scores (includes `target_language`, `mode` supports `'unified'`)
- `messages` — Individual messages per session
- `pronunciation_errors` — IPA analysis per word (persisted by backend)
- `grammar_errors` — Grammar corrections (persisted by backend)
- `progress` — Per-topic progress tracking (upserted after session end)
- `subscriptions` — Stripe subscription records
- `streaks` — Daily practice streak tracking

### Key constraints
- `sessions.mode` CHECK: `('chat', 'correction', 'teaching', 'unified')` — unified is the active mode
- All tables have RLS policies scoped to `auth.uid()`
- Backend writes via service-role client (bypasses RLS for persistence)
- Frontend reads via client-side Supabase (with RLS)

---

## 15. Performance Requirements

### Backend targets

| Metric | Target | Notes |
|--------|--------|-------|
| STT processing | < 2s | 15s audio clip on Apple Silicon |
| LLM first token | < 500ms | DeepSeek V3 via API |
| TTS synthesis | < 500ms | Short response sentences |
| Total perceived latency | < 3s | Speech end to first audio |
| WS connections | 50+ concurrent | Without degradation |

### Frontend targets

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3s |
| Cumulative Layout Shift (CLS) | < 0.1 |

---

## 16. Error Handling & Fallbacks

| Failure | Fallback |
|---------|----------|
| STT fails / no speech detected | Text input fallback — user types instead |
| LLM timeout (>10s) | Retry once, then fallback to alternate provider |
| LLM provider error | Automatic fallback: DeepSeek -> OpenAI -> Claude |
| TTS synthesis fails | Display text response only, skip audio |
| TTS voice unavailable for language | Fall back to eSpeak-NG (lower quality but functional) |
| WebSocket disconnect | Auto-reconnect with exponential backoff (1s, 2s, 4s, 8s, max 30s) |
| WS auth token expired | Frontend refreshes JWT, reconnects with new token |
| Offline | Local session data persists, sync on reconnect |
| Mic permission denied | Clear error message with browser-specific instructions |
| Audio format unsupported | Convert to WAV client-side before sending |
| Correction parsing fails | Show raw AI response without tap-to-fix dots (graceful degradation) |
| Daily session limit reached | Upgrade prompt modal with pricing |

---

## 17. Security & Privacy

- **Audio storage**: Raw audio is NOT stored on the server. Only transcriptions are persisted.
- **GDPR compliance**: Full data export and account deletion endpoints (`DELETE /api/account` removes all user data)
- **API keys**: Never exposed to the frontend. All LLM/service calls go through the backend.
- **WebSocket auth**: JWT token validated on connection via Supabase JWKS. Unauthenticated connections rejected with code 4001.
- **Row Level Security**: All database tables enforce user-scoped access
- **Input sanitization**: All user text inputs sanitized before LLM prompts
- **Rate limiting**: Per-user rate limits — 30 msg/min on WS, 10 req/min on HTTP endpoints
- **Usage limits**: Free tier enforced server-side (3 sessions/day, 10 min max)
- **Stripe security**: Webhook signature verification, no card data touches our servers

---

## 18. Accessibility

- **Target**: WCAG 2.1 AA compliance
- **Reduced motion**: All animations respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion`
- **ARIA labels**: Mic button states (idle, recording, processing), live regions for incoming messages, correction dot descriptions
- **Keyboard navigation**: Full keyboard support for all interactive elements including tap-to-fix panels
- **Screen reader**: Session messages announced via `aria-live="polite"` regions
- **Color contrast**: All text meets 4.5:1 minimum contrast ratio against backgrounds
- **Focus indicators**: Visible focus rings on all interactive elements
- **Mobile**: Responsive at 375px+ (iPhone SE baseline)

---

## 19. Success Metrics

### Engagement

| Metric | Target (3-month) |
|--------|-------------------|
| Sessions per week | >= 3 |
| Average session duration | 10-15 min |
| Messages per session | >= 10 |
| Tap-to-fix interaction rate | >= 40% of messages with corrections |

### Retention

| Metric | Target |
|--------|--------|
| D1 retention | >= 60% |
| D7 retention | >= 40% |
| D30 retention | >= 25% |
| Streak maintenance (7+ days) | >= 30% of active users |

### Learning outcomes

| Metric | Target |
|--------|--------|
| Score improvement over 10 sessions | >= 5% |
| Pronunciation error reduction per topic | >= 20% after 5 sessions |
| Recurring error pattern reduction | >= 15% after pattern is surfaced |

### Monetization

| Metric | Target |
|--------|--------|
| Free-to-Pro conversion rate | >= 5% |
| Monthly churn rate | < 8% |
| Average revenue per user (ARPU) | $0.50+ |
| Payback period | < 3 months |

### Technical

| Metric | Target |
|--------|--------|
| End-to-end latency (p95) | < 4s |
| Uptime | >= 99.5% |
| Error rate | < 1% of sessions |
| WebSocket reconnection success | >= 95% |

---

## 20. User Flows

### Onboarding flow (new users)
```
Landing -> Auth (Sign Up) -> Onboarding Wizard (Language -> Level -> Goals -> Welcome)
  -> Dashboard (first time)
```

### Returning user flow
```
Landing -> Auth (Sign In) -> Dashboard -> Start Session -> Session
```

### Session flow
```
Session Start -> [Conversation Starters shown for A1-A2]
  -> Record (hold mic) or Type -> STT Processing -> LLM Response (natural)
  -> TTS Playback -> Correction dots appear on user messages
  -> Tap dot -> Bottom sheet with corrections + IPA
  -> Continue conversation or End Session
  -> End -> Post-Session Summary (key takeaways + streak + scores)
  -> Dashboard
```

### Progress review flow
```
Dashboard -> Session History -> Session Detail -> Error Review -> IPA Modal -> TTS Replay
Dashboard -> Error Patterns -> Recurring mistakes across sessions
Dashboard -> Streak & Milestones
```

### Settings flow
```
Settings -> UI Language / Target Language / LLM Provider / Theme / TTS Voice -> Save -> Toast
Settings -> Account -> Delete Account -> Confirmation -> Full data deletion
Settings -> Subscription -> Stripe Customer Portal
```

### Upgrade flow
```
Free user hits daily limit -> Upgrade Prompt Modal -> Pricing Page -> Stripe Checkout
  -> Success -> Pro features unlocked immediately
```

### Password reset flow
```
Auth page -> "Forgot password?" -> Enter email -> Supabase sends reset link
  -> User clicks link -> New password form -> Success -> Redirect to Sign In
```

---

## 21. Gamification & Engagement

### Daily Streaks
- Consecutive day count of sessions completed
- Visual streak badge on dashboard and navbar
- Streak-at-risk notification: "Don't lose your 7-day streak! Practice today."
- Streak info shown in post-session summary

### Milestones
- **First Session** — "You took the first step!"
- **7-Day Streak** — "One week of consistent practice!"
- **10 Sessions** — "Getting into the groove"
- **Perfect Pronunciation** — "Nailed it! Perfect score on a word"
- **100 Words Practiced** — "Building your vocabulary"
- Milestone celebrations shown as toast notifications

### Error Pattern Intelligence
- Track recurring errors across sessions in `grammar_errors` and `pronunciation_errors` tables
- Dashboard section: "Your most common patterns" with frequency counts
- Proactively suggest targeted review: "You've made article errors in 4 sessions — practice der/die/das?"
- Surfaces patterns the learner might not notice on their own

---

## 22. Multi-Language Engine Support

### Speech-to-Text (STT)
- faster-whisper supports all target languages natively
- Language parameter passed via WebSocket config message
- No model changes needed — Whisper is multilingual

### Text-to-Speech (TTS)
- **Voice registry** maps language codes to Piper voice models
- Languages with high-quality Piper voices: German (`de_DE-*`), French, Spanish
- Languages without Piper voices: fall back to eSpeak-NG (lower quality but functional)
- Voice selection exposed in settings (Pro tier gets all voices)
- Future: ElevenLabs API for Pro tier (highest quality, higher cost)

### IPA Analysis
- eSpeak-NG + Phonemizer already support all target languages
- Language parameter passed through the analysis pipeline
- No code changes needed in `ipa/engine.py` — already accepts `language` param

### System Prompts
- `prompts.ts` generates language-aware prompts
- Target language determines:
  - Which language the AI converses in
  - Cultural correction examples relevant to that language
  - Level-appropriate conversation starters
  - Topic suggestions contextualized to the language

---

## 23. Future Roadmap

### Near-term (post-launch)
- **Active Vocabulary Mode** — Audio flashcards for isolated word pronunciation practice (see Section 11)
- **Streaming LLM Responses** — Stream tokens for perceived latency improvement
- **Voice Level Indicator** — Real-time volume meter during recording
- **Session Warm-Up** — 30-second "Repeat after me" warm-up before main conversation
- **Contextual Help Tooltips** — First-time user tooltips on UI elements

### Medium-term
- **Visual Progress Map** — Winding path through the syllabus with language-specific landmarks
- **Session Replay** — Replay full session transcript with synchronized audio
- **Spaced Repetition Engine** — SM-2 algorithm for vocabulary review scheduling
- **Sound Design** — UI sounds for key interactions (respecting system mute)
- **ElevenLabs TTS** — Premium natural voices for Pro tier

### Long-term
- **Mobile App** — React Native or PWA for mobile access
- **Additional Languages** — Japanese, Korean, Mandarin (requires CJK-specific IPA handling)
- **Streaming STT** — Deepgram streaming for real-time transcription
- **Group Sessions** — Practice with other learners, AI-moderated
- **Tutor Marketplace** — Connect with human tutors for advanced practice

---

## 24. Implementation Status

*Last updated: March 2, 2026*

### Legend
- **WORKING** — Feature is fully implemented and validated end-to-end
- **PARTIAL** — Core logic exists but integration or edge cases are incomplete
- **IN PROGRESS** — Actively being developed in current sprint
- **NOT STARTED** — Planned but no code yet
- **DEPRECATED** — Superseded by unified mode; code exists but will be removed

### Backend

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 1 | Health endpoint (`/api/health`) | WORKING | Returns status, version, eSpeak availability. |
| 2 | Chat API (`/api/chat`) | WORKING | All 4 LLM providers (DeepSeek, Claude, OpenAI, Gemini). |
| 3 | IPA analysis API (`/api/ipa/analyze`) | WORKING | eSpeak-NG integration, word-by-word IPA transcription. Multi-language. |
| 4 | IPA comparison API (`/api/ipa/compare`) | WORKING | Compares spoken vs correct IPA with severity levels. |
| 5 | TTS endpoint (`/api/tts`) | WORKING | Piper TTS with eSpeak-NG fallback, returns WAV audio. |
| 6 | WebSocket handler (`/ws/conversation`) | WORKING | Text + audio + config + ping/pong. Full pipeline: audio → STT → IPA → LLM → response. |
| 7 | STT engine (faster-whisper) | WORKING | Transcription with word-level timestamps and confidence scores. **Bug: hardcoded to `language="de"`**. |
| 8 | TTS engine (Piper) | WORKING | Synthesize with model validation. **Bug: German-only voices**. |
| 9 | IPA engine (eSpeak-NG) | WORKING | Deterministic IPA transcription, severity levels. Already multi-language. |
| 10 | LLM provider factory | WORKING | Factory pattern with 4 providers. Validated API keys. |
| 11 | Backend tests | WORKING | 40 tests across 9 test files. Target: 80+. |
| 12 | WebSocket JWT auth | NOT STARTED | No authentication on WS connections. **Critical bug.** |
| 13 | DB error persistence | NOT STARTED | grammar_errors + pronunciation_errors never written by backend. |
| 14 | Rate limiting | NOT STARTED | No per-user rate limits. |
| 15 | Account deletion endpoint | NOT STARTED | No `DELETE /api/account` route. |
| 16 | Multi-language TTS voice registry | NOT STARTED | No voice mapping by language. |
| 17 | Stripe billing routes | NOT STARTED | No payment infrastructure. |
| 18 | Structured logging + Sentry | NOT STARTED | No production monitoring. |

### Frontend-Backend Integration

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 19 | API client (`lib/api.ts`) | WORKING | BACKEND_URL config, `getWsUrl()` helper. |
| 20 | WebSocket client (`hooks/useWebSocket.ts`) | WORKING | Auto-reconnect, keepalive, binary support. **Needs JWT auth param.** |
| 21 | Audio capture (`hooks/useAudioCapture.ts`) | WORKING | getUserMedia + MediaRecorder, WebM/Opus encoding. |
| 22 | Audio streaming to backend | WORKING | Mic → MediaRecorder → binary blob via WebSocket. |
| 23 | LLM response rendering | WORKING | WebSocket `response` messages → MessageBubble. |
| 24 | TTS audio playback (`lib/audio.ts`) | WORKING | `queueAudioBuffer()` (WS binary) and `playTTS()` (HTTP). |
| 25 | System prompts (`lib/prompts.ts`) | WORKING | Unified prompt builder with level + topic context. **Needs multi-language support.** |

### Database & Auth

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 26 | Supabase schema (6 tables + RLS) | WORKING | **Bug: mode CHECK constraint missing 'unified'**. |
| 27 | Auth: Sign up/in | WORKING | Real Supabase Auth with error handling. |
| 28 | Auth: Route protection (middleware) | WORKING | Middleware checks auth, redirects to /auth. |
| 29 | Auth: Sign out | WORKING | NavBar button calls supabase.auth.signOut(). |
| 30 | Auth: Password reset | NOT STARTED | i18n text exists, no code. |
| 31 | Auth: User state in app | WORKING | AuthProvider fetches user, populates useAuthStore. |
| 32 | Session persistence to DB | PARTIAL | Session rows created but **inserts fail silently** due to mode constraint. |
| 33 | Dashboard data queries | WORKING | Queries sessions table with ordering/limits. |
| 34 | Profile data from DB | WORKING | AuthProvider reads profile, settings persist to profiles table. |
| 35 | Auth callback route | WORKING | **Bug: hardcodes `/en/dashboard`**. |

### Frontend Features

| # | Feature | Status | Details |
|---|---------|--------|---------|
| 36 | Landing page | WORKING | Gradient hero, glass cards, stats. All text via i18n. |
| 37 | Auth page | WORKING | Glass card, cross-fade sign in/up. **Bug: hardcoded German heading.** |
| 38 | Onboarding (4-step wizard) | NOT STARTED | Old module/topic/mode selection deprecated. New language/level/goals/welcome needed. |
| 39 | Session page (unified mode) | WORKING | WebSocket, audio capture, messages, TTS, IPA, DB persistence. |
| 40 | Mic button (audio capture) | WORKING | Pulse rings, glow, state transitions. |
| 41 | Conversation messages | WORKING | MessageBubble with slide-in animations. |
| 42 | Unified conversation mode | WORKING | Single mode replacing Free Chat / Correction / Teaching. |
| 43 | Free Chat mode | DEPRECATED | Superseded by unified mode. |
| 44 | Real-Time Correction mode | DEPRECATED | Superseded by unified mode. |
| 45 | Guided Teaching mode | DEPRECATED | Superseded by unified mode. |
| 46 | Tap-to-fix corrections | NOT STARTED | Loora-inspired correction UX. |
| 47 | Conversation starters | NOT STARTED | For A1-A2 learners. |
| 48 | IPA Modal | WORKING | Color-coded IPA diff, severity badge, TTS playback. |
| 49 | Session End Overlay | WORKING | Score rings. **Needs redesign: key takeaways + streak.** |
| 50 | Dashboard (stats + history) | WORKING | Real Supabase data. **Needs error patterns section.** |
| 51 | Settings: Language switching | WORKING | next-intl locale switching. All 4 locales. |
| 52 | Settings: LLM provider | WORKING | Persists to localStorage and Supabase. |
| 53 | Settings: Theme | WORKING | ThemeProvider: dark/light/system. |
| 54 | Settings: Target language | NOT STARTED | Depends on multi-language support. |
| 55 | Settings: Delete account | PARTIAL | Signs out only. **Does not delete Supabase data.** |
| 56 | Toast notifications | WORKING | Used for settings feedback. |
| 57 | i18n (4 languages) | WORKING | EN/ES/FR/DE. **Bug: some hardcoded strings remain.** |
| 58 | UI component library (13 components) | WORKING | Button, Card, Input, Badge, Spinner, etc. |
| 59 | Animation system | WORKING | 12 reusable Framer Motion variants. |
| 60 | Responsive layout | WORKING | Desktop nav, mobile drawer, sidebar. |
| 61 | Design token system | WORKING | Full CSS custom properties. |
| 62 | Docker (frontend + backend) | WORKING | docker-compose. **Needs multi-stage builds + health checks.** |
| 63 | Pricing page | NOT STARTED | Free vs Pro tier comparison. |
| 64 | Upgrade prompt | NOT STARTED | Shown when free tier limit hit. |
| 65 | Streaks & milestones | NOT STARTED | Daily streak tracking + milestone badges. |
| 66 | Error patterns dashboard | NOT STARTED | Cross-session error analysis. |
| 67 | CI/CD pipeline | NOT STARTED | GitHub Actions for tests + build. |
| 68 | E2E tests | NOT STARTED | Playwright critical flow tests. |

### Known Bugs (Priority Order)

| # | Bug | Severity | Status |
|---|-----|----------|--------|
| 1 | `sessions.mode` CHECK missing 'unified' — inserts silently fail | CRITICAL | Open |
| 2 | IPA comparison passes same word as both spoken and correct | HIGH | Open |
| 3 | Auth callback hardcodes `/en/dashboard` | MEDIUM | Open |
| 4 | No WebSocket authentication | CRITICAL | Open |
| 5 | grammar_errors + pronunciation_errors tables never written to | HIGH | Open |
| 6 | progress table completely unused | HIGH | Open |
| 7 | Hardcoded strings in TopicChips, auth, dashboard, password strength | MEDIUM | Open |
| 8 | STT hardcoded to `language="de"` | HIGH | Open |
| 9 | TTS voices German-only | HIGH | Open |
