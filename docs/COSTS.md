# Fluent - Cost Documentation

## Phase 1: Open-Source + DeepSeek Stack (Current)

| Service | Cost | Notes |
|---------|------|-------|
| faster-whisper | $0 | Local, runs on Apple Silicon |
| Piper TTS | $0 | Local, German voices available |
| eSpeak-NG + Phonemizer | $0 | Local, deterministic IPA |
| DeepSeek V3 (default) | ~$0.15/mo | $0.14/M input, $0.28/M output. ~15min/day = ~$0.005/session |
| Supabase Local | $0 | Dev via CLI + Docker |
| Supabase Pro | $25/mo | Production: 8GB DB, 100GB storage, 50GB egress |
| **Total (dev)** | **~$0.15/mo** | Only LLM API costs |
| **Total (prod)** | **~$25.15/mo** | Supabase Pro + LLM |

## Phase 2: Upgraded Stack (Alternative Providers)

| Service | Cost | Notes |
|---------|------|-------|
| Deepgram STT | ~$1.30/mo | $0.0043/min x 15min x 30 days |
| ElevenLabs TTS | $5-22/mo | Starter ($5) to Creator ($22) |
| Claude Haiku 4.5 | ~$0.50/mo | $0.80/M in, $4/M out |
| Claude Sonnet 4.6 | ~$3-5/mo | Better quality for teaching mode |
| OpenAI GPT-4o-mini | ~$0.30/mo | $0.15/M in, $0.60/M out |
| Gemini 2.0 Flash | ~$0.10/mo | Very competitive pricing |
| Supabase Pro | $25/mo | Production |
| **Total range** | **~$26-55/mo** | Depends on provider choices |

## Estimation Assumptions

- **Session length**: 15 minutes average
- **Frequency**: 1 session per day, 30 days/month
- **Token usage per session**: ~2,000 input tokens, ~1,500 output tokens
- **Audio per session**: ~15 minutes STT, ~5 minutes TTS

## Upgrade Paths

1. **STT**: faster-whisper (local, free) -> Deepgram Streaming ($0.0043/min, lower latency)
2. **TTS**: Piper TTS (local, free) -> ElevenLabs ($5+/mo, more natural voices)
3. **LLM**: DeepSeek V3 (cheapest) -> Claude Haiku (quality) -> Claude Sonnet (best quality)
4. **DB**: Supabase Local (free) -> Supabase Pro ($25/mo) -> Supabase Team ($599/mo)

## Upgrade Paths: Value & Trade-offs

| Upgrade | Cost | Value to Learner |
|---------|------|-----------------|
| **Piper TTS** (current, local) | $0 | Neural voice trained on a native German speaker (Thorsten) — natural intonation, proper stress patterns and vowel length. Learners hear correct prosody instead of robotic formant synthesis. |
| **ElevenLabs TTS** | $5-22/mo | Studio-quality voices with emotion and adjustable speed. Better for immersive conversation practice where natural pacing and expressiveness improve comprehension training. |
| **Deepgram STT** | ~$1.30/mo | Streaming transcription (words appear as spoken), lower latency, better accuracy on accented speech. Reduces the gap between speaking and seeing feedback. |
| **LLM streaming** (current) | $0 | Tokens appear as generated — perceived latency drops from 3-5s to <500ms for the first word. Conversations feel responsive instead of turn-by-turn with dead air. |

### When to upgrade

- **Piper TTS** is already included and produces high-quality German audio. No upgrade needed unless you want emotional expressiveness or multiple voice options.
- **Deepgram STT** is worth it if users report lag between speaking and seeing their transcription, or if accuracy on accented German is poor with faster-whisper.
- **ElevenLabs TTS** makes sense for premium tiers or when the app supports multiple languages where Piper models may not exist.
- **LLM streaming** is free and already implemented — it improves perceived responsiveness with zero cost increase.
