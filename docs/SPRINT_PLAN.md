# Fluent v2: Team Organization, Sprint Plan & Production Roadmap

## Context

Fluent is an AI-powered language learning app focused on spoken practice. Currently German-only with a working end-to-end pipeline (STT -> IPA -> LLM -> TTS), but with **9 critical bugs** blocking production use, no monetization, and UX that doesn't match production-grade apps like Loora. This plan transforms Fluent from a working prototype into a production-ready, multi-language, monetized product — organized for a 2-person full-stack team working in an aggressive 4-week sprint.

### What prompted this
- Critical bugs: session inserts silently fail (mode constraint), IPA comparison is meaningless (same word compared to itself), no WebSocket auth (anyone can consume resources)
- Learning data (grammar_errors, pronunciation_errors, progress) is never persisted to the DB — only lives in browser memory
- UX needs a shift from "grammar classroom" corrections to natural, non-interrupting feedback (inspired by Loora's "tap to fix" pattern)
- Multi-language expansion needed (currently hardcoded to German everywhere)
- No monetization infrastructure

---

## Team Organization

Both developers are full-stack. Split by **domain ownership**, not tech stack:

### Developer A: "Experience Lead"
Owns everything the user sees and feels.
- Onboarding flow (language, level, goals)
- Session UX (conversation, corrections, tap-to-fix)
- Post-session summary (key takeaways, streaks)
- Design refresh & polish
- i18n completion
- Frontend multi-language selection
- Gamification (streaks, milestones)
- Pricing/upgrade UI
- Landing page update
- Responsive & accessibility audit

### Developer B: "Platform Lead"
Owns everything under the hood.
- DB schema migrations (fix constraints, add target_language, billing)
- WebSocket authentication
- Multi-language engine support (STT/TTS/IPA per language)
- Error & progress persistence to DB
- Backend testing (target: 80+ tests)
- Rate limiting & production hardening
- Stripe payment infrastructure
- Auth fixes (password reset, account deletion)
- CI/CD pipeline
- Docker optimization

### Collaboration Model
- **Daily**: 15-min async standup (what I did, what I'm doing, blockers)
- **Monday AM**: Week planning, dependency alignment
- **Friday PM**: Demo session — show working features to each other
- **Code review**: Every PR reviewed by the other developer before merge
- **Pairing**: Phase 0 (Day 1) is done together; critical integration points paired

---

## Critical Bugs (9 issues blocking production)

These MUST be fixed before any feature work. Day 1 priority.

| # | Bug | Severity | File |
|---|-----|----------|------|
| 1 | `sessions.mode` CHECK allows only `('chat','correction','teaching')` but frontend inserts `'unified'` — **every session insert silently fails** | **CRITICAL** | `supabase/migrations/20260224000000_initial_schema.sql` |
| 2 | IPA comparison: `compare_pronunciation(word, word, "de")` passes same word as both spoken and correct — comparison always identical | **HIGH** | `backend/app/ws/handler.py:242` |
| 3 | Auth callback hardcodes `/en/dashboard` — breaks for non-English OAuth users | **MEDIUM** | `frontend/src/app/[locale]/auth/callback/route.ts` |
| 4 | No WebSocket authentication — any client can connect and consume LLM/TTS resources | **CRITICAL** | `backend/app/main.py:137-142` |
| 5 | `grammar_errors` and `pronunciation_errors` tables never written to — data only in Zustand memory | **HIGH** | Frontend session page + backend handler |
| 6 | `progress` table never read or written — completely unused | **HIGH** | No code references it |
| 7 | Hardcoded strings: TopicChips (German), auth headings (German), dashboard dates (English), password strength labels | **MEDIUM** | Multiple frontend files |
| 8 | STT hardcoded to `language="de"` regardless of config | **HIGH** | `backend/app/ws/handler.py:218` |
| 9 | TTS voices are German-only (all `de_DE-*`) | **HIGH** | `frontend/src/stores/settings.ts:8-12`, `backend/app/tts/engine.py` |

---

## User Stories

### Epic 1: Foundation & Bug Fixes
- **US-1.1**: As a user, I want my sessions to save to the database so my progress is not lost *(fix mode constraint)*
- **US-1.2**: As a user, I want pronunciation comparison to show actual differences *(fix IPA bug)*
- **US-1.3**: As a user, I want WebSocket connections secured so only authenticated users can practice *(add WS auth)*
- **US-1.4**: As a user, I want my grammar and pronunciation errors saved across sessions so I can track improvement
- **US-1.5**: As a user, I want all UI text in my chosen language with no random German/English fragments

### Epic 2: Multi-Language
- **US-2.1**: As a user, I want to choose which language I'm learning (German, French, Spanish, Italian, Portuguese) during onboarding
- **US-2.2**: As a user, I want STT to understand the language I'm practicing, not just German
- **US-2.3**: As a user, I want TTS to speak in my target language with appropriate voices
- **US-2.4**: As a user, I want the AI tutor to converse in my chosen target language

### Epic 3: UX Redesign (Loora-inspired)
- **US-3.1**: As a user, I want corrections shown as subtle indicators on my messages that I can tap to expand, not inline grammar annotations *(tap-to-fix pattern)*
- **US-3.2**: As a user, I want the AI to respond naturally without mixing corrections into the conversation flow
- **US-3.3**: As a user, I want a post-session summary showing my key takeaways, not just score rings
- **US-3.4**: As a user, I want an onboarding flow that understands my goals, not just my level
- **US-3.5**: As a user, I want conversation starters at beginner levels so I know how to begin speaking
- **US-3.6**: As a user, I want the AI to flag phrases that are grammatically correct but sound unnatural *(cultural/naturalness corrections)*

### Epic 4: Gamification & Engagement
- **US-4.1**: As a user, I want to see my daily streak so I stay motivated
- **US-4.2**: As a user, I want milestones (first session, 10 sessions, perfect pronunciation) to celebrate progress
- **US-4.3**: As a user, I want the dashboard to show my most common error patterns across sessions

### Epic 5: Monetization
- **US-5.1**: As a user, I want to see pricing tiers and what's included in free vs Pro
- **US-5.2**: As a free user, I want clear feedback when I hit my daily limit with an easy upgrade path
- **US-5.3**: As a Pro user, I want access to all languages, all LLM providers, and unlimited sessions

### Epic 6: Auth & Account
- **US-6.1**: As a user, I want to reset my password via email
- **US-6.2**: As a user, I want to delete my account and all associated data permanently

---

## Sprint Plan (4 Weeks)

### Phase 0: Day 1 — Critical Bug Triage (BOTH DEVS, PAIRING)

**Dev B leads, Dev A reviews:**
1. New migration `supabase/migrations/20260302000001_fix_mode_constraint.sql`:
   - `ALTER TABLE sessions DROP CONSTRAINT sessions_mode_check; ALTER TABLE sessions ADD CONSTRAINT sessions_mode_check CHECK (mode IN ('chat','correction','teaching','unified'));`
   - Validation: insert row with `mode='unified'` via Supabase

2. Fix IPA comparison in `backend/app/ws/handler.py:242`:
   - Remove misleading `compare_pronunciation(word, word)` call
   - For low-confidence STT words: use `analyze_word(word, lang)` for correct IPA, flag severity by confidence score
   - The spoken_ipa is inherently unknown from STT text alone — mark as confidence-based flag
   - Run: `cd backend && ../.venv/bin/python -m pytest tests/ -v`

**Dev A leads, Dev B reviews:**
3. Fix hardcoded strings:
   - `frontend/src/components/TopicChips.tsx:6-9` — move to i18n `session.topics`
   - `frontend/src/app/[locale]/auth/page.tsx:113` — "Deine Reise beginnt hier" -> `t("signUpHeading")`
   - `frontend/src/app/[locale]/dashboard/page.tsx:47-50` — use `Intl.RelativeTimeFormat` with locale
   - Auth password strength labels -> i18n keys
   - Update all 4 locale message files
   - Run: `cd frontend && npm run build && npm run lint`

**Definition of Done:** Session inserts succeed. All 40 backend tests pass. `npm run build` clean. Zero hardcoded user-facing strings.

---

### Phase 1: Week 1 — Foundation

#### Dev B: Platform Foundation

| Task | Key Files | Depends On |
|------|-----------|------------|
| WebSocket JWT auth | `backend/app/main.py`, new `backend/app/auth.py`, `frontend/src/hooks/useWebSocket.ts` | Phase 0 |
| DB error persistence (grammar_errors + pronunciation_errors) | `backend/app/ws/handler.py`, new `backend/app/db.py` | WS auth (need user_id) |
| Schema migration: `target_language` on profiles + sessions | New migration file | Phase 0 |
| Multi-language STT (configurable `language` param via WS config) | `backend/app/ws/handler.py:218` | Schema migration |
| Password reset flow | `frontend/src/app/[locale]/auth/page.tsx`, new callback route | Phase 0 |

**WS Auth approach:** Client sends Supabase JWT as query param on WS connect. Backend validates JWT using Supabase's JWKS or service-role key. On failure, close connection with 4001 code. Frontend gets JWT from `supabase.auth.getSession()`.

**DB persistence approach:** Backend writes messages + errors to Supabase using service-role client (bypasses RLS). Frontend stops writing messages directly — backend is source of truth. Frontend still reads via client-side Supabase (with RLS).

#### Dev A: Experience Foundation

| Task | Key Files | Depends On |
|------|-----------|------------|
| Onboarding flow (4 steps: language, level, goals, welcome) | New `frontend/src/app/[locale]/onboarding/page.tsx` + step components | Dev B's target_language column |
| "Tap to fix" correction redesign | `frontend/src/components/MessageBubble.tsx`, `FeedbackSheet.tsx`, `parseCorrections.ts` | Phase 0 |
| Target language selector in settings | `frontend/src/stores/settings.ts`, settings page | Dev B's schema migration |
| Multi-language system prompts | `frontend/src/lib/prompts.ts` | Target language in stores |

**Tap-to-fix approach (Loora-inspired):**
- LLM still generates corrections in its response, but we extract them with `parseCorrections.ts` and display the AI response **clean** (without correction markers)
- User messages show a small colored dot/badge when corrections exist
- Tapping opens a bottom sheet (mobile) or side panel (desktop) with:
  - What was said vs. what a native speaker would say
  - Brief explanation of why
  - Per-word pronunciation scores (if IPA data exists)
- Corrections feel like optional coaching, not a grammar exam

**Onboarding flow (Loora-inspired):**
1. **Target Language** — Cards for German, French, Spanish, Italian, Portuguese (expandable)
2. **Level** — A1-C1 with plain-language descriptions ("I know a few words" -> "I'm nearly fluent")
3. **Goals** — Multi-select chips: Travel, Work, Study, Daily Life, Culture, Exam Prep
4. **Welcome** — Encouraging message acknowledging speaking anxiety + "Start your first session" CTA
- Saves to Supabase profile. Redirect: signup -> onboarding -> dashboard

**Definition of Done:** WS requires valid JWT. Errors persisted to DB (verified via query). Onboarding flow works end-to-end. Corrections shown as tap-to-fix. `npm run build` + `pytest` clean.

---

### Phase 2: Week 2 — Feature Buildout

#### Dev B: Robustness

| Task | Key Files |
|------|-----------|
| Rate limiting (30 msg/min per user on WS, 10 req/min on HTTP) | New `backend/app/middleware/rate_limit.py`, `main.py` |
| Progress table population (upsert after session end) | `backend/app/db.py`, `backend/app/ws/handler.py` |
| Account deletion endpoint (`DELETE /api/account`) | New `backend/app/routes/account.py` |
| Multi-language TTS voice registry | New `backend/app/tts/voices.py`, modify `tts/engine.py` |
| Expand backend tests to 60+ | New test files for auth, DB, rate limiting |

**TTS voice strategy:** Create a voice registry mapping language codes to Piper voice models. For languages without Piper voices, fall back to eSpeak-NG (lower quality but functional). Document which languages have high-quality voices vs. fallback.

#### Dev A: Polish & Engagement

| Task | Key Files |
|------|-----------|
| Post-session summary redesign (key takeaways + streak) | `SessionEndOverlay.tsx`, session page |
| Streaks & milestones | New `frontend/src/lib/streaks.ts`, `StreakBadge.tsx`, dashboard |
| Dashboard error patterns section | Dashboard page (queries grammar_errors + pronunciation_errors) |
| Dynamic TopicChips per target language + level | `TopicChips.tsx`, `prompts.ts` |
| Conversation starters for A1-A2 | New `ConversationStarters.tsx`, session page |

**Post-session redesign:**
- Replace score-rings-only overlay with:
  - 3 "Key Takeaways" — most impactful corrections from the session
  - "Words Practiced" count
  - Streak info ("3 days in a row!")
  - Score rings still present but as secondary info
- Inspired by Loora's post-session summary

**Natural corrections (cultural/naturalness):**
- Update system prompt in `prompts.ts` to instruct the LLM:
  - Respond naturally first (continue the conversation)
  - Include corrections at the end using structured markers
  - Flag phrases that are grammatically correct but sound unnatural
  - Example: "You said 'Ich bin kalt' — grammatically possible but Germans say 'Mir ist kalt'"

**Definition of Done:** Rate limiting works (verified with load test). Progress table populated. Account deletion removes all data. Session end shows takeaways. Dashboard shows error patterns. 60+ backend tests.

---

### Phase 3: Week 3 — Monetization + Design

#### Dev B: Payment Infrastructure

| Task | Key Files |
|------|-----------|
| Stripe Checkout integration (test mode) | New `backend/app/routes/billing.py` |
| Subscription tables migration | New migration: `subscriptions` table, `subscription_status` on profiles |
| Free tier enforcement (3 sessions/day) | New `backend/app/middleware/usage_limit.py`, WS handler |
| Structured JSON logging + Sentry | New `backend/app/logging.py`, `main.py` |
| Docker multi-stage builds + health checks | `Dockerfile.backend`, `Dockerfile.frontend`, `docker-compose.yml` |

**Freemium tiers:**
| | Free | Pro ($9.99/mo) |
|---|------|----------------|
| Sessions/day | 3 | Unlimited |
| Target languages | 1 (German) | All |
| LLM providers | DeepSeek only | All 4 |
| Session length | 10 min max | Unlimited |
| Error history | Last 7 days | All time |

#### Dev A: Subscription UI + Design Refresh

| Task | Key Files |
|------|-----------|
| Pricing page | New `frontend/src/app/[locale]/pricing/page.tsx` |
| Upgrade prompt (shown when limit hit) | New `UpgradePrompt.tsx` |
| Pro badge in navbar | `NavBar.tsx`, `auth.ts` store |
| Design refresh pass | `globals.css`, various components |
| Landing page update (multi-language, pricing CTA) | Landing page |

**Design refresh principles:**
- Refine glass morphism (more subtle, less opacity)
- Improve typography hierarchy
- Add micro-interactions (button press, card hover)
- Improve empty states
- Consistent spacing audit
- The app should feel premium, not like a hackathon project

**Definition of Done:** Stripe checkout works in test mode. Free tier enforces limits. Upgrade prompt shown. Design refresh complete. Docker production build succeeds.

---

### Phase 4: Week 4 — Testing, Hardening, Launch

#### Dev B: Testing + Infrastructure

| Task | Key Files |
|------|-----------|
| Backend tests to 80+ (integration tests for full WS flow, billing webhooks) | `backend/tests/` |
| CI/CD pipeline (GitHub Actions) | New `.github/workflows/ci.yml` |
| Load testing (simulate 50+ concurrent WS connections) | Test script |
| Security audit (OWASP top 10 check) | All endpoints |
| DB migration validation script | CI pipeline |

#### Dev A: Final Polish

| Task | Key Files |
|------|-----------|
| i18n audit — zero missing keys across all 4 locales | All message files |
| Responsive audit at 375px (iPhone SE) | Session, dashboard, onboarding pages |
| Accessibility audit (ARIA, keyboard nav, focus management) | All interactive components |
| E2E tests with Playwright (10+ critical flows) | New `frontend/e2e/` |
| Landing page final polish | Landing page |

**Definition of Done (Launch Ready):**
- 80+ backend tests, 10+ E2E tests, all passing
- CI/CD runs on every PR
- All 4 locales complete (zero missing keys)
- Mobile responsive at 375px
- Load test: 50 concurrent sessions without degradation
- Security: WS authenticated, rate limited, no injection vulnerabilities
- Stripe test mode functional end-to-end

---

## Anticipated Issues & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Multi-language TTS voice quality** — Piper may lack quality voices for some languages | Users hear robotic TTS in non-German languages | Research Piper voice catalog in Week 1. For languages without Piper voices, use eSpeak-NG fallback. Consider ElevenLabs API for Pro tier (higher cost but natural). |
| **Stripe integration complexity** — webhooks, subscription state sync | Payment bugs = revenue loss | Use Stripe Checkout (hosted page) to minimize frontend. Start with test mode only. Use Stripe's built-in customer portal for subscription management. |
| **Schema migration on production Supabase** — could break existing data | Data loss or downtime | All migrations are additive (ADD COLUMN, not DROP). Test on Supabase branch database first. Never modify existing columns. |
| **LLM correction parsing fragility** — `parseCorrections.ts` relies on `❌ → ✅` format | Corrections break if LLM doesn't follow format | Add fallback: if no corrections parsed, show raw response. Consider structured output (JSON mode) for correction extraction. |
| **STT model memory per connection** — each WS loads ~1.5GB Whisper model | Server OOM with 10+ concurrent users | Singleton STT engine shared across connections (already partially done). Add connection limits. Monitor memory in production. |
| **WebSocket auth token expiry** — JWT expires mid-session | User disconnected during practice | Frontend refreshes JWT before WS connect. Backend accepts token refresh messages. Add graceful reconnection with new token. |
| **Scope creep from Loora features** — gamification/onboarding can expand endlessly | Sprint overruns | Strict MVP per feature: streaks = consecutive day count only. Onboarding = 4 steps only. No complex animations v1. |
| **Multi-language system prompts** — LLM may not perform equally in all languages | Poor experience in non-German languages | Test prompts in each target language. Start with German + French + Spanish (strongest LLM support). Add others after validation. |
| **Free tier abuse** — users create multiple accounts | Revenue loss from circumvention | Rate limit by IP in addition to user. Require email verification. Monitor signup patterns. |
| **Session state loss on refresh** — Zustand not persisted | User loses conversation mid-session | Add `persist` middleware to `useSessionStore` for critical fields (messages, corrections). Or accept this and add "session recovery" later. |

---

## Innovations Beyond Loora

Things Fluent can do that Loora doesn't:

1. **Multi-language support** — Loora is English-only. Fluent supports German, French, Spanish, Italian, Portuguese
2. **IPA phoneme-level feedback in conversation context** — Loora does pronunciation scoring but not IPA-level detail
3. **Cultural/naturalness corrections** — "You said 'Ich bin kalt' but Germans say 'Mir ist kalt'" (Loora does this for English; we do it for multiple languages)
4. **Open-source speech pipeline** — No vendor lock-in on STT/TTS (faster-whisper + Piper are local)
5. **Multi-LLM choice** — Users can pick their preferred AI provider
6. **Cost transparency** — Hybrid local+cloud is 100x cheaper than all-cloud, enabling aggressive free tier

---

## Key Files Reference

### Critical files to modify (most changes)
- `backend/app/ws/handler.py` — WS auth, IPA fix, multi-lang, rate limiting, DB persistence
- `frontend/src/app/[locale]/session/page.tsx` — Auth token, clean corrections, starters
- `frontend/src/components/MessageBubble.tsx` — Tap-to-fix redesign
- `frontend/src/components/FeedbackSheet.tsx` — Bottom sheet correction panel
- `frontend/src/lib/prompts.ts` — Multi-language prompt generation
- `frontend/src/lib/parseCorrections.ts` — Extract corrections, display clean text
- `frontend/src/stores/settings.ts` — Target language, dynamic TTS voices
- `frontend/src/stores/session.ts` — Target language field
- `supabase/migrations/` — New migration files

### New files to create
- `backend/app/auth.py` — JWT validation utility
- `backend/app/db.py` — Supabase service client for DB writes
- `backend/app/tts/voices.py` — Multi-language voice registry
- `backend/app/routes/billing.py` — Stripe integration
- `backend/app/routes/account.py` — Account deletion
- `backend/app/middleware/rate_limit.py` — Rate limiting
- `backend/app/middleware/usage_limit.py` — Free tier enforcement
- `frontend/src/app/[locale]/onboarding/page.tsx` + step components
- `frontend/src/app/[locale]/pricing/page.tsx`
- `frontend/src/components/ConversationStarters.tsx`
- `frontend/src/components/StreakBadge.tsx`
- `frontend/src/components/UpgradePrompt.tsx`
- `frontend/src/lib/streaks.ts`
- `.github/workflows/ci.yml`

### Existing utilities to reuse
- `frontend/src/lib/animations.ts` — 12 Framer Motion variants (reuse for new components)
- `frontend/src/components/ui/` — 13 existing UI components (Button, Card, Modal, etc.)
- `frontend/src/lib/audio.ts` — `queueAudioBuffer()` and `playTTS()` (extend for multi-lang)
- `backend/app/ipa/engine.py` — Already accepts `language` param (no changes needed)
- `backend/app/stt/engine.py` — Already accepts `language` param (just need to pass it)

---

## Verification Plan

### After each phase:
1. `cd backend && ../.venv/bin/python -m pytest tests/ -v` — all tests pass
2. `cd frontend && npm run build` — zero TypeScript errors
3. `cd frontend && npm run lint` — zero lint warnings
4. Manual smoke test of core flow: signup -> onboarding -> session (speak + type) -> end session -> dashboard

### Phase-specific verification:
- **Phase 0**: Query Supabase `sessions` table — rows exist with `mode='unified'`
- **Phase 1**: Connect to WS without JWT — connection rejected. Check `grammar_errors` table has rows after session.
- **Phase 2**: Run 50 messages in 1 minute — rate limit kicks in. Check `progress` table after session end.
- **Phase 3**: Complete Stripe test checkout — subscription active. Hit 3-session limit as free user.
- **Phase 4**: Run `docker compose up --build` — both containers healthy. Playwright E2E suite green.

### Production readiness checklist:
- [ ] All env vars documented and validated on startup
- [ ] No secrets in code or git history
- [ ] Rate limiting active on all endpoints
- [ ] WebSocket requires authentication
- [ ] Error monitoring (Sentry) active
- [ ] Stripe webhooks verified
- [ ] All 4 locales complete
- [ ] Mobile responsive (375px+)
- [ ] 80+ backend tests, 10+ E2E tests
- [ ] CI/CD pipeline on all PRs
