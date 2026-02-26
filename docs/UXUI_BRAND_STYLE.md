# Fluent — UX/UI & Brand Style Guide for Claude Code

> **Purpose:** This document is the single source of truth for all UI/UX decisions in Fluent. It is meant to be read by Claude Code before any frontend work. Follow it precisely.

---

## 1. Anti-Slop Directive

<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Fluent must NOT look like every other AI-generated dark-mode app. Avoid this: make creative, distinctive interfaces that surprise and delight while remaining functional for language learning.

**NEVER use these generic AI patterns:**
- Overused font families (Inter, Roboto, Arial, system-ui defaults)
- Clichéd color schemes (purple gradients on white, generic teal-on-black without depth)
- Predictable card-grid layouts with uniform spacing
- Cookie-cutter component patterns that lack context-specific character
- Flat, lifeless dark backgrounds with no atmosphere or texture
- Generic glassmorphism applied everywhere without purpose
- Uniform border-radius on everything (the "everything is a pill" look)
- Evenly-distributed color palettes with no dominant/accent hierarchy

**DO make creative, intentional choices:**
- Every screen should feel like it was designed by a human who cares about language learning
- The UI should reduce speaking anxiety, not add visual noise
- Dark mode should feel warm, atmospheric, and inviting — not cold and corporate
- Commit to bold decisions: one dominant color with sharp accents beats timid pastels
</frontend_aesthetics>

---

## 2. Brand Identity: "The Confident Whisper"

### Brand Concept

Fluent's personality is like a patient German tutor who sits with you at a quiet café in Berlin — calm, encouraging, precise, but never cold. The UI should feel **intimate and focused**, like a private practice room, not a public classroom.

**Brand Analogies (use these for creative direction):**
- The clarity of **Apple Voice Memos** meets the progression depth of **Headspace**
- The conversational intimacy of **iMessage** meets the precision of a **linguistics textbook**
- The focus of a **recording studio** meets the warmth of a **well-lit reading nook**

**Emotional Design North Star:** Every screen should make the learner think "I can do this" not "this looks complicated."

### Brand Voice in UI

| Context | Tone | Example |
|---------|------|---------|
| Empty states | Encouraging, warm | "Ready for your first conversation? Let's start simple." |
| Error states | Calm, solution-oriented | "Couldn't hear you clearly — try speaking a bit louder, or type instead." |
| Progress | Celebratory but not patronizing | "4 sessions this week. Your pronunciation is getting sharper." |
| Corrections | Helpful, not punitive | "Almost! 'der Tisch' — masculine nouns often trip people up." |

---

## 3. Design System Tokens

### Color Palette

The current app uses a generic dark-teal gradient that feels flat and template-like. Replace with a layered, atmospheric palette:

```css
:root {
  /* === FOUNDATION === */
  /* Background layers — NOT flat black. Use subtle warm undertones */
  --bg-deepest:    hsl(200, 15%, 5%);      /* Near-black with cool blue undertone */
  --bg-base:       hsl(195, 12%, 8%);      /* Primary app background */
  --bg-elevated:   hsl(192, 10%, 11%);     /* Cards, panels */
  --bg-surface:    hsl(190, 8%, 14%);      /* Interactive surfaces, hover states */
  --bg-overlay:    hsl(188, 8%, 17%);      /* Modals, drawers */

  /* === PRIMARY: German Forest Green === */
  /* NOT generic teal. A rich, deep green inspired by the Black Forest */
  --primary-900:   hsl(162, 50%, 12%);
  --primary-800:   hsl(162, 45%, 18%);
  --primary-700:   hsl(162, 42%, 24%);
  --primary-600:   hsl(160, 40%, 32%);     /* Default primary */
  --primary-500:   hsl(158, 45%, 42%);     /* Hover, active */
  --primary-400:   hsl(156, 48%, 52%);     /* Accent highlights */
  --primary-300:   hsl(154, 50%, 65%);     /* Light accent */
  --primary-200:   hsl(152, 52%, 78%);
  --primary-100:   hsl(150, 55%, 90%);

  /* === ACCENT: Amber Warmth === */
  /* Warm counterpoint to the green. Used sparingly for energy. */
  --accent-warm:   hsl(38, 90%, 58%);      /* Gold — streaks, celebrations, XP */
  --accent-coral:  hsl(12, 80%, 62%);      /* Pronunciation errors, critical alerts */
  --accent-sky:    hsl(210, 70%, 60%);     /* Grammar corrections, info badges */

  /* === SEMANTIC === */
  --success:       hsl(152, 55%, 48%);     /* Correct pronunciation, good scores */
  --warning:       hsl(38, 85%, 55%);      /* Mild corrections, suggestions */
  --error:         hsl(0, 72%, 58%);       /* Errors, failed states */
  --info:          hsl(210, 65%, 55%);     /* Tips, grammar notes */

  /* === TEXT === */
  --text-primary:   hsl(0, 0%, 95%);       /* Headings, primary content */
  --text-secondary: hsl(195, 8%, 65%);     /* Body text, descriptions */
  --text-tertiary:  hsl(195, 6%, 45%);     /* Captions, timestamps, labels */
  --text-muted:     hsl(195, 5%, 32%);     /* Disabled, placeholder */
  --text-on-primary: hsl(162, 50%, 8%);    /* Text on primary-colored backgrounds */

  /* === BORDERS & DIVIDERS === */
  --border-subtle:  hsla(195, 10%, 50%, 0.06);  /* Card edges, dividers */
  --border-default: hsla(195, 10%, 50%, 0.12);  /* Input fields, panels */
  --border-strong:  hsla(195, 10%, 50%, 0.20);  /* Focus rings, active states */

  /* === SURFACES & GLASS === */
  --glass-bg:       hsla(192, 12%, 12%, 0.70);  /* Glassmorphism panels */
  --glass-border:   hsla(195, 20%, 60%, 0.08);
  --glass-blur:     12px;

  /* === SHADOWS — Layered, not flat === */
  --shadow-sm:  0 1px 2px hsla(200, 20%, 2%, 0.3);
  --shadow-md:  0 4px 12px hsla(200, 20%, 2%, 0.4), 0 1px 3px hsla(200, 20%, 2%, 0.2);
  --shadow-lg:  0 8px 32px hsla(200, 20%, 2%, 0.5), 0 2px 8px hsla(200, 20%, 2%, 0.3);
  --shadow-glow: 0 0 20px hsla(158, 50%, 42%, 0.15);  /* Primary glow for mic button */

  /* === SPACING (8px base grid) === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* === RADII === */
  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  16px;
  --radius-xl:  24px;
  --radius-full: 9999px;

  /* === TRANSITIONS === */
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast:  150ms;
  --duration-normal: 250ms;
  --duration-slow:  400ms;

  /* === Z-INDEX SCALE === */
  --z-base:     1;
  --z-dropdown: 10;
  --z-sticky:   20;
  --z-overlay:  30;
  --z-modal:    40;
  --z-toast:    50;
  --z-mic:      60;    /* Mic button always on top */
}
```

### Typography

**Do NOT use Inter, Roboto, or system defaults.** Fluent needs typography that feels premium and slightly editorial.

```css
/* PRIMARY FONT — Headings, hero text, brand elements */
/* Satoshi: geometric sans with personality. Clean but not generic. */
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');

/* BODY FONT — UI text, messages, descriptions */
/* General Sans: highly legible, warm, works at all sizes */
@import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap');

/* MONO FONT — IPA transcriptions, code, technical data */
/* JetBrains Mono: distinctive, highly legible for phonetic symbols */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --font-display: 'Satoshi', sans-serif;
  --font-body: 'General Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

**Type Scale (use extremes — 3x+ jumps for hero, not 1.5x):**

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `--text-hero` | 56px / 3.5rem | 900 | Landing page headline only |
| `--text-h1` | 36px / 2.25rem | 700 | Page titles |
| `--text-h2` | 24px / 1.5rem | 700 | Section headers |
| `--text-h3` | 18px / 1.125rem | 600 | Card titles, modal headers |
| `--text-body` | 16px / 1rem | 400 | Primary body text |
| `--text-body-sm` | 14px / 0.875rem | 400 | Secondary text, labels |
| `--text-caption` | 12px / 0.75rem | 500 | Timestamps, badges, metadata |
| `--text-ipa` | 18px / 1.125rem | 500 | IPA transcriptions (mono) |

---

## 4. Component Specifications

### Mic Button — The Hero Interaction

This is the single most important UI element in Fluent. It must feel **physical, weighty, and satisfying** — like pressing a real studio recording button.

**States:**

| State | Visual | Animation |
|-------|--------|-----------|
| **Idle** | Solid primary-600 circle (64px), subtle inner shadow, faint ambient glow | Gentle breathing scale (1.0 → 1.02, 3s ease-in-out loop) |
| **Hover** | Glow intensifies, cursor changes | Scale to 1.05, shadow-glow expands |
| **Pressed** | Scale to 0.92, darker shade, pressed-in shadow | Spring physics (stiffness: 400, damping: 17) |
| **Recording** | Primary-400 with bright glow, 3 concentric pulse rings expanding outward | Rings: scale 1→2.5 + fade, staggered 0.4s apart. Inner circle holds at 0.95 scale |
| **Processing** | Rings collapse inward, color shifts to primary-700, orbital dots appear | 3 dots orbit the circle at varying speeds |
| **AI Speaking** | Waveform visualization inside the circle, primary-300 | Audio-reactive bars or sine wave |
| **Error** | Circle border flashes error color, icon changes to exclamation | Quick shake animation (translateX ±4px, 3 cycles) |
| **Disabled** | Muted gray, no glow, reduced opacity (0.4) | No animation |

**Sizing:** 64px desktop, 72px mobile (larger touch target). Always floating, always accessible.

**Accessibility:** `aria-label` dynamically updates per state ("Start recording", "Recording... tap to stop", "Processing your speech", "AI is speaking"). Keyboard: Space/Enter to activate. `role="button"`.

### Message Bubbles

**User messages:**
- Aligned right
- Background: `--primary-800` with subtle gradient to `--primary-700`
- Border-radius: 16px 16px 4px 16px (sharp bottom-right corner = "I said this")
- Text: `--text-primary`
- IPA-flagged words: underline with `--accent-coral` dotted border-bottom, cursor pointer
- Max-width: 80% on desktop, 90% on mobile

**AI messages:**
- Aligned left
- Background: `--bg-elevated`
- Border: 1px solid `--border-subtle`
- Border-radius: 16px 16px 16px 4px (sharp bottom-left = "AI said this")
- Text: `--text-primary`

**System messages (corrections, prompts):**
- Centered, no bubble
- Text: `--text-tertiary`, italic
- Small icon prefix (lightbulb for tips, pencil for corrections)

**Animation:** Slide up 12px + fade in, duration 300ms, `--ease-out-expo`. Stagger 50ms between consecutive messages.

### Conversation Starter Chips

For A1-A2 learners. Critical for reducing blank-page anxiety.

- Horizontal scroll container on mobile, flex-wrap on desktop
- Each chip: `--bg-surface` background, `--border-default` border, `--radius-full` border-radius
- Padding: 8px 16px
- Text: `--text-secondary`, 14px, `--font-body`
- Hover: background lightens to `--bg-overlay`, border to `--border-strong`
- Active/pressed: scale 0.96, spring back
- German text with subtle translation hint below: "Hallo, ich bin..." / "Hello, I am..."
- Appear with staggered fade-in on session start (delay: index × 80ms)

### Corrections Panel (Real-Time Correction Mode)

**NOT a generic sidebar.** Design it as an integrated, helpful companion panel.

- Desktop: right panel, 320px wide, separated by a 1px `--border-subtle` divider
- Mobile: bottom sheet (slides up from bottom, 60% height, draggable handle)
- Each correction card:
  - Severity indicator: left border (4px) colored by severity
    - `--info` (style suggestion, sky blue)
    - `--warning` (grammar error, amber)
    - `--error` (meaning-changing, coral)
  - Original text: struck-through in `--text-tertiary`
  - Corrected text: bold in `--text-primary`
  - Explanation: collapsible, `--text-secondary`, with grammar rule name as badge
  - Expand/collapse with smooth height animation

### IPA Modal

Fluent's unique differentiator. Must feel **scientific and empowering**, not clinical.

- Opens from the tapped word's position (transform-origin = word coordinates)
- Animation: scale from 0.8 → 1.0 + fade, spring physics, 350ms
- Content layout:
  - **Header:** The word in large display font, with audio play button
  - **Comparison:** Two columns — "You said" (left, with user's IPA) vs "Target" (right, correct IPA)
  - **IPA Diff:** Color-coded character-by-character. Matching phonemes in `--success`, different phonemes in `--accent-coral`, missing phonemes with gap indicator
  - **Severity badge:** Top-right corner, pill-shaped
  - **Explanation:** Natural language section below, `--text-secondary`, generated by LLM
  - **"Listen" button:** Plays correct pronunciation via TTS. Primary pill button with speaker icon
- Background: `--glass-bg` with backdrop-blur
- Border: `--glass-border`
- Max-width: 400px, centered on mobile

### Progress & Data Visualization

**Session scores:** Three-metric display (Fluency, Grammar, Pronunciation). NOT generic progress bars.

- Use **radial/ring charts** (similar to Apple Watch activity rings)
- Each metric gets its own ring: primary-400 (fluency), accent-sky (grammar), accent-warm (pronunciation)
- Score number centered inside the ring, large `--font-display` weight 700
- Animate: rings fill from 0 to score on mount, 800ms ease-out

**Trend lines:**
- Sparkline charts for improvement over time
- Use subtle gradient fills below the line (primary-400 → transparent)
- No grid lines, minimal axis labels. Clean, not chart-heavy.

**Error patterns:**
- Horizontal bar chart, sorted by frequency
- Most common error type at top
- Color-coded by error category
- Show decrease arrow if improving

### Cards

**NOT uniform boxes.** Cards should have personality.

- Background: `--bg-elevated`
- Border: 1px solid `--border-subtle`
- Border-radius: `--radius-lg` (16px)
- Padding: `--space-6` (24px)
- Shadow: `--shadow-md`
- Hover: translate Y -2px, shadow expands to `--shadow-lg`, border lightens
- Transition: all `--duration-normal` `--ease-out-expo`
- **NO uniform card grids.** Vary card sizes based on content importance. Feature cards larger, stat cards compact.

### Buttons

**Primary:**
- Background: `--primary-600`
- Text: `--text-on-primary`, weight 600
- Padding: 12px 24px
- Border-radius: `--radius-md` (10px) — NOT pill-shaped for primary actions
- Hover: `--primary-500`, translateY -1px, `--shadow-glow`
- Active: `--primary-700`, translateY 0, scale 0.98
- Transition: spring physics

**Secondary:**
- Background: transparent
- Border: 1px solid `--border-default`
- Text: `--text-secondary`
- Hover: `--bg-surface`, border `--border-strong`

**Ghost:**
- Background: transparent
- No border
- Text: `--text-tertiary`
- Hover: text `--text-secondary`, subtle underline

---

## 5. Screen-by-Screen Direction

### Landing Page

**Current problem:** Generic dark gradient with centered text. Feels like a template. No emotional hook. The radial gradient background and floating dots are "AI slop."

**New direction:**
- **Hero concept:** Show the actual conversation UI as the centerpiece visual — a stylized mockup of someone mid-conversation with the AI, with IPA annotations floating around it. This IS the product; show it.
- **Layout:** Asymmetric. Headline + subtext on the left (60%), conversation preview on the right (40%). Break the centered-text-over-gradient pattern.
- **Background:** Replace flat radial gradient with layered atmospheric depth. Subtle noise texture overlay (opacity 0.03), very faint topographic/contour lines at the bottom (evoking a map/journey metaphor), gradient that shifts from `--bg-deepest` at top to slightly warmer at bottom.
- **Stats bar:** Redesign from generic "72 / 5 / A1-C1" numbers. Make them contextual: "72 conversation topics from ordering coffee to debating politics" — the numbers need meaning.
- **CTA:** Larger, more prominent. Add micro-copy below: "Free. No credit card. Start speaking in 2 minutes."
- **Remove:** The generic floating particle dots. They add nothing.

### Auth Page

- Continuation of landing page flow, not a separate "page." Use a full-screen modal or slide-in panel.
- Keep it minimal: email + password, or sign up with Google/GitHub.
- Add a subtle German phrase as flavor text: *"Jede Reise beginnt mit einem Schritt"* (Every journey begins with a step)
- Password strength indicator should use the primary color scale, not generic red/yellow/green.

### Onboarding (4-Step Wizard)

**Critical screen for Persona A (intimidated beginners).**

- **Step indicators:** NOT numbered dots. Use a flowing path/river metaphor that fills as you progress.
- **Level selection:** Show what each level FEELS like with example phrases:
  - A1: "Hallo, ich heiße Maria" (with audio play button)
  - B1: "Meiner Meinung nach sollten wir..."
  - C1: "Inwiefern lässt sich argumentieren, dass..."
- **Mode selection:** Use mini-preview illustrations/animations showing what each mode looks like mid-session, not just icons + text.
- **Mic test (add this):** Final step should include a "Say 'Hallo' to test your mic" interaction. This normalizes the mic before the first session and reduces anxiety.
- **Tone:** Encouraging micro-copy at every step. "Perfect choice. A1 is where everyone starts." / "Guided Teaching is great for building confidence."

### Session Page (All 3 Modes)

**This is where users spend 80%+ of their time. It must be immersive.**

**Common elements across modes:**
- Minimal chrome. Hide navigation during active sessions. Show only: back arrow, mode indicator badge, session timer, end session button.
- Message area takes full available height. No wasted space.
- Mic button floats at bottom center, always visible, never obscured.
- Subtle ambient background: very faint gradient that shifts slowly during the session (barely perceptible, creates sense of aliveness).

**Free Chat (A1-A2 variant):**
- Conversation starter chips visible above the mic button
- Word suggestion bar appears after user starts speaking (horizontal scroll, shows likely next words)
- AI messages include inline translation hints (toggleable) — tap a German sentence to see English below
- Scaffolding UI: when AI sends a prompt, key vocabulary words are highlighted and tappable (opens mini IPA popup)

**Free Chat (B2-C1 variant):**
- Clean conversation view. No scaffolding.
- Longer messages supported with smooth expand/collapse
- Topic indicator in header (so user knows the conversation territory)

**Real-Time Correction:**
- Desktop: 65/35 split — conversation (left) / corrections panel (right)
- Corrections appear in real-time as user speaks (slide in from right, staggered)
- Inline highlights in user's message text link to the corresponding correction card
- Mobile: corrections as dismissible bottom banners, or tap to expand full correction sheet

**Guided Teaching:**
- Lesson progress bar at top (thin, full-width, primary gradient fill)
- Vocabulary cards presented as a mini carousel above the conversation
- Conversation starters are more structured: "Now try saying: ___" with the target phrase shown
- Practice vs. teaching segments visually distinct (teaching = wider AI messages with vocabulary callouts, practice = normal conversation flow)

### Dashboard

**Two states to design for:**

**Early user (0-5 sessions):**
- Don't show empty charts. Show an encouraging "journey start" view.
- "You've completed 2 sessions! Most learners see improvement after 5."
- Show a simplified next-goal prompt: "Your next session: [topic] in [mode]"
- Large CTA to start next session.

**Active user (10+ sessions):**
- Three activity rings (Apple Watch style) for fluency/grammar/pronunciation
- Trend sparklines showing improvement
- Session history list with date, mode, topic, scores, duration
- Error patterns section: "Your most common errors this week" with clear improvement arrows
- Streak indicator (if streak exists)

### Settings

- Clean list-style layout, grouped by category
- Language switcher: show flag + language name, current selection highlighted
- LLM provider: explain what each option means simply ("Faster responses" vs "More nuanced corrections")
- Theme toggle: preview the theme change live before committing
- Danger zone (delete account): clearly separated at bottom, requires confirmation modal

### Session End / Score Summary

**This is the reward moment.** It bridges session → dashboard.

- Full-screen overlay with session results
- Scores animate in (count up from 0, staggered)
- Activity rings fill with spring animation
- If improvement detected: celebrate with a subtle shimmer/confetti effect and encouraging copy
- "Key corrections" section: top 3 corrections from the session, tap to review
- Buttons: "Practice Again" (primary) / "View Dashboard" (secondary)
- Streak badge if applicable: "🔥 3-day streak!"

---

## 6. Motion & Micro-Interactions

Use Framer Motion exclusively. Spring physics > linear easing.

**Global motion config:**
```typescript
// Default spring for most interactions
const spring = { type: "spring", stiffness: 300, damping: 24 };

// Snappy spring for buttons, toggles
const snappy = { type: "spring", stiffness: 400, damping: 20 };

// Gentle spring for page transitions, modals
const gentle = { type: "spring", stiffness: 200, damping: 28 };

// Bouncy spring for celebrations, score reveals
const bouncy = { type: "spring", stiffness: 350, damping: 15 };
```

**Key interactions:**

| Interaction | Animation | Specs |
|-------------|-----------|-------|
| Page transition | Crossfade + subtle directional slide | opacity 0→1, translateX ±20px, gentle spring |
| Mode switch | Quick dissolve | opacity swap, 200ms |
| Message appear | Slide up + fade | translateY 12→0, opacity 0→1, ease-out-expo, stagger 50ms |
| Mic press | Scale down + spring back | scale 1→0.92→1, snappy spring |
| Mic recording start | Pulse rings expand | 3 rings, scale 1→2.5, opacity 1→0, stagger 400ms |
| IPA modal open | Scale from word position | scale 0.85→1, opacity 0→1, spring |
| Score count-up | Animated number | 0→score over 800ms, ease-out |
| Activity ring fill | Arc draw | 0→score angle, 800ms, ease-out-expo |
| Card hover | Lift + shadow | translateY -2px, shadow expands, 250ms |
| Toast appear | Slide in from top-right | translateX 100%→0, spring, auto-dismiss with progress bar |
| Chip press | Scale bounce | scale 1→0.95→1, snappy |
| Correction slide-in | From right edge | translateX 24→0, opacity 0→1, stagger 100ms |

**Reduced motion:** ALL animations must respect `prefers-reduced-motion: reduce`. Replace spring/slide with instant opacity changes. Use Framer Motion's `useReducedMotion()` hook.

---

## 7. Responsive Behavior

| Breakpoint | Layout | Key changes |
|------------|--------|-------------|
| **Desktop (1024px+)** | Sidebar nav (240px collapsed / expanded) + main content | Corrections panel side-by-side, dashboard as grid, spacious message area |
| **Tablet (768-1023px)** | Top nav, no sidebar | Corrections panel as slide-over overlay, dashboard 2-col, messages full width |
| **Mobile (<768px)** | Bottom nav (4 tabs: Home, Session, Dashboard, Settings) or hamburger | Full-screen conversation, corrections as bottom sheet, mic button 72px centered, dashboard single column, cards stack vertically |

**Mobile-first priorities:**
- Mic button touch target: minimum 72px, with 16px clear space around it
- Message bubbles: max-width 90%
- All tap targets: minimum 44px × 44px
- Bottom sheet gestures: drag handle, swipe down to dismiss
- No hover-dependent interactions (everything must work with tap)

---

## 8. Accessibility Specifications

**Target: WCAG 2.1 AA**

### Color Contrast
- All body text: minimum 4.5:1 against background
- Large text (18px+ or 14px bold): minimum 3:1
- Interactive elements: minimum 3:1 against adjacent colors
- **Don't rely on color alone** for severity indicators — always pair with icons or text labels

### Screen Reader / VoiceOver
- Mic button: `aria-label` updates per state, `role="button"`, `aria-pressed` for toggle
- Messages: container has `aria-live="polite"`, new messages announced automatically
- IPA modal: `aria-modal="true"`, focus trap, `aria-label="Pronunciation details for [word]"`
- Corrections panel: `aria-live="polite"` for new corrections
- Score animations: final values set immediately for screen readers (don't wait for animation)

### Keyboard Navigation
- Full keyboard support for all interactive elements
- Visible focus rings: 2px solid `--primary-400`, 2px offset
- Tab order follows visual hierarchy: nav → main content → sidebar
- Mic button: Space/Enter to toggle recording
- IPA modal: Escape to close, Tab to cycle through internal elements
- Conversation: Arrow keys to navigate between messages

### Dynamic Type / Font Scaling
- All text uses rem/em units
- Layout doesn't break at 200% zoom
- Test all screens at 16px, 20px, 24px base font size
- Containers use min-height, not fixed height

### Reduced Motion
- Framer Motion: `useReducedMotion()` hook on every animated component
- Fallback: instant opacity transitions instead of spring/slide
- Pulse rings on mic button: replaced with static glow indicator
- Score count-up: shows final value immediately
- Page transitions: simple crossfade only

---

## 9. Background & Atmosphere

**Replace the flat, generic gradients with layered atmospheric depth.**

### Primary Background Treatment
```css
/* Layered background — NOT a single radial gradient */
.app-background {
  background-color: var(--bg-base);
  background-image:
    /* Subtle noise texture for organic feel */
    url("data:image/svg+xml,..."), /* inline SVG noise at 0.03 opacity */
    /* Very faint radial glow — centered, barely visible */
    radial-gradient(
      ellipse 60% 50% at 50% 30%,
      hsla(162, 30%, 15%, 0.25) 0%,
      transparent 70%
    ),
    /* Bottom ambient warmth */
    linear-gradient(
      to top,
      hsla(38, 20%, 10%, 0.08) 0%,
      transparent 30%
    );
}
```

### Session Page Ambient
During active sessions, the background subtly shifts to create a "living room" feel:
- Faint, slow-moving gradient that responds to conversation state
- Recording: barely perceptible green tint increases
- AI speaking: slight blue shift
- Transition: 2s ease, so slow it's felt not seen

### Landing Page
- Topographic contour lines (very faint, `--border-subtle` opacity) in the lower third — evoking a journey/map metaphor
- No floating particle dots (these are AI slop)
- Gradient mesh in the hero area using primary colors at very low opacity

---

## 10. Phase 2/3 Design Hooks

Leave room in the architecture for these future features:

| Feature | Design hook to implement now |
|---------|------------------------------|
| **Gamification (XP, streaks)** | Space in the dashboard header for a streak counter + XP bar. Session end screen already has a celebration moment. |
| **Visual Progress Map** | Dashboard has a "Your Journey" section placeholder that currently shows a simplified level indicator, but will become the winding path with German landmarks. |
| **Session Replay** | Session history list items have a "play" icon that's currently non-functional. |
| **Sound Design** | All interactive elements dispatch custom events (`fluent:interaction`) that a future sound engine can listen to. |
| **Haptic Feedback** | Mic button and chips use CSS transforms that map to haptic patterns when native. |
| **Spaced Repetition** | IPA modal has a "Practice this word" button that's currently hidden behind a feature flag. |
| **Active Vocabulary Mode** | Mode selector in onboarding has space for a 4th option. Session page mode switcher can accommodate it. |

---

## 11. Implementation Checklist for Claude Code

When implementing UI changes, follow this order:

1. **Read this file first.** Every decision here is intentional.
2. **Update CSS custom properties** to match the token system in Section 3.
3. **Replace fonts** — import Satoshi, General Sans, JetBrains Mono. Remove any Inter/Roboto/system-ui references.
4. **Backgrounds first** — update the base layer before touching components. The atmosphere sets the tone.
5. **Mic button** — implement all states from Section 4. This is the hero element.
6. **Message bubbles** — asymmetric border-radius, IPA word highlighting.
7. **Landing page** — asymmetric layout, remove particle dots, add conversation preview.
8. **Component-by-component** — cards, buttons, chips, corrections panel, IPA modal.
9. **Motion system** — apply Framer Motion spring configs from Section 6.
10. **Accessibility pass** — ARIA labels, focus rings, keyboard nav, reduced motion.
11. **Responsive pass** — test all breakpoints from Section 7.

**After every change, verify:**
- [ ] No generic AI-slop patterns introduced
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Mobile layout doesn't break
- [ ] Fonts load correctly (Satoshi, General Sans, JetBrains Mono)
- [ ] Mic button states are all visually distinct and accessible
