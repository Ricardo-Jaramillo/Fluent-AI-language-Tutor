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

12. **Icon system** — apply consistent sizing, stroke, and color rules from Section 12.
13. **Forms & validation** — implement input states, validation timing, error styles from Section 13.
14. **Toast system** — configure types, positioning, stacking, auto-dismiss from Section 14.
15. **Loading & empty states** — skeleton patterns, empty state templates from Section 15.
16. **Error states** — network, API, auth, 404, and disconnect recovery from Section 16.
17. **Navigation** — verify route hierarchy, nav behavior, deep linking from Section 17.
18. **First-run experience** — onboarding polish, tooltip system, mic test from Section 18.
19. **Sound design** — implement Web Audio API sounds per Section 19 (Phase 2).
20. **Gesture & touch** — implement mobile gesture interactions from Section 20.
21. **Audio visualization** — waveform and indicator animations from Section 21.
22. **Spacing & layout grid** — verify all spacing follows the 4px grid from Section 22.
23. **Copy & microcopy** — apply tone, formatting, and copy rules from Section 23.
24. **Performance** — optimize per metrics and techniques in Section 24.
25. **Level-adaptive UI** — implement CEFR-based visual adaptations from Section 25.

**After every change, verify:**
- [ ] No generic AI-slop patterns introduced
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Mobile layout doesn't break
- [ ] Fonts load correctly (Satoshi, General Sans, JetBrains Mono)
- [ ] Mic button states are all visually distinct and accessible
- [ ] Icons follow system from Section 12 (24x24 grid, 1.5px stroke, correct sizing)
- [ ] All forms follow validation timing and error patterns from Section 13
- [ ] Toast notifications stack and auto-dismiss correctly per Section 14
- [ ] Empty states have illustration + encouraging copy + CTA per Section 15
- [ ] Error recovery flows are user-friendly, never blaming per Section 16
- [ ] All spacing is a multiple of 4px per Section 22
- [ ] Copy follows tone guidelines from Section 23
- [ ] Core Web Vitals targets met per Section 24

---

## 12. Icon System

Fluent uses **lucide-react** exclusively. No mixing icon libraries. Every icon must feel intentional, not decorative.

### Grid & Stroke

All icons follow the lucide 24×24 grid with a 1.5px stroke width. Never adjust stroke weight per-icon — consistency is non-negotiable.

### Size Tokens

| Token | Size | Use |
|-------|------|-----|
| `icon-xs` | 16px | Inline with caption text, badge prefixes, toast type indicators |
| `icon-sm` | 20px | Inline with body text, form field icons, chip prefixes |
| `icon-md` | 24px | Default. Nav items, button icons, card action icons |
| `icon-lg` | 32px | Empty state illustrations, feature highlights, onboarding visuals |

### Color Rules

- **Default:** Icons inherit the current text color (`currentColor`). Never assign a standalone color to a non-semantic icon.
- **Semantic icons:** Use semantic colors sparingly and only when the icon represents a status:
  - `--success` for checkmarks, completed states
  - `--error` for alerts, failed states
  - `--warning` for caution indicators
  - `--info` for tips, grammar notes
  - `--accent-warm` for XP, streaks, celebrations
- **On primary backgrounds:** Use `--text-on-primary`
- **Disabled state:** `--text-muted` with `opacity: 0.5`

### Semantic Icon Mapping

| Concept | Icon | lucide name |
|---------|------|-------------|
| Microphone / Record | Filled mic | `Mic` |
| Microphone off | Slashed mic | `MicOff` |
| Chat / Conversation | Speech bubble | `MessageCircle` |
| Corrections | Pencil in square | `PenSquare` |
| Pronunciation / IPA | Audio waveform | `AudioLines` |
| Progress / Stats | Trending up | `TrendingUp` |
| Settings | Gear | `Settings` |
| Level / Difficulty | Signal bars | `Signal` |
| Free Chat mode | Message dots | `MessageSquare` |
| Real-Time Correction | Spell check | `SpellCheck` |
| Guided Teaching | Graduation cap | `GraduationCap` |
| Play audio | Play circle | `PlayCircle` |
| Pause audio | Pause circle | `PauseCircle` |
| Close / Dismiss | X | `X` |
| Back / Navigate back | Chevron left | `ChevronLeft` |
| Menu / Hamburger | Three lines | `Menu` |
| Globe / Language | Globe | `Globe` |
| User / Profile | User circle | `UserCircle` |
| Streak / Fire | Flame | `Flame` |
| Star / Achievement | Star | `Star` |
| Info / Tip | Lightbulb | `Lightbulb` |
| Error / Warning | Alert triangle | `AlertTriangle` |
| Success / Correct | Check circle | `CheckCircle` |
| Copy text | Clipboard | `Clipboard` |
| Timer / Duration | Clock | `Clock` |
| Logout | Log out | `LogOut` |

### Icon + Text Pairing

- Minimum 8px (`--space-2`) gap between icon and adjacent text
- Icon vertically centered with the first line of text
- In buttons: icon before label (leading), 8px gap
- In nav items: icon above label on mobile bottom nav, icon left of label on desktop sidebar
- Never use an icon alone without an `aria-label` — if no visible text accompanies it, the icon must have a screen-reader-accessible label

---

## 13. Form Design & Validation

Forms in Fluent are minimal — Auth and Settings are the primary form contexts. They must feel effortless, not bureaucratic.

### Input States

| State | Background | Border | Text | Additional |
|-------|-----------|--------|------|------------|
| **Default** | `--bg-surface` | `--border-default` | `--text-muted` (placeholder) | — |
| **Focus** | `--bg-surface` | `--primary-500` (2px) | `--text-primary` | Subtle `--shadow-glow` ring around input |
| **Filled** | `--bg-surface` | `--border-default` | `--text-primary` | — |
| **Error** | `--bg-surface` | `--accent-coral` (2px) | `--text-primary` | Error icon prefix in field, shake animation (3 cycles, ±3px) |
| **Disabled** | `--bg-elevated` at 0.5 opacity | `--border-subtle` | `--text-muted` | `cursor: not-allowed` |
| **Read-only** | `transparent` | `none` | `--text-secondary` | Looks like static text, not an input |

Reference: `components/ui/Input.tsx`, `components/ui/Select.tsx`

### Validation Timing

- **First validation:** On blur (when user leaves the field). Never validate while the user is still typing for the first time.
- **After first error:** Switch to on-change validation (validate on every keystroke so the user sees the error clear as they fix it).
- **Submit validation:** Always re-validate all fields on form submit as a safety net.
- **Server errors:** Display inline below the relevant field, same style as client errors.

### Error Message Style

```
[ErrorIcon 16px, --accent-coral] Error message text here
```

- Text: `--accent-coral`, `--text-body-sm` (14px), `--font-body`
- Position: directly below the input, 4px gap
- Icon: `AlertCircle` from lucide, 16px, same color as text
- Animation: fade in + slide down 4px, 200ms `--ease-out-expo`
- Max one error per field. Show the most relevant error, not all errors.

### Password Strength Indicator

On the Auth sign-up form:

- 4-segment horizontal bar below the password field
- Segments fill left-to-right as strength increases
- Colors use the **primary scale**, not traffic-light colors:
  - 1 segment (weak): `--primary-800`
  - 2 segments (fair): `--primary-700`
  - 3 segments (good): `--primary-500`
  - 4 segments (strong): `--primary-400`
- Text label below: "Weak" / "Fair" / "Good" / "Strong" in `--text-tertiary`
- Segment transitions: width fill, 200ms ease-out

### Form Layout Rules

- **Always single column** — even on desktop. Forms are narrow (max-width: 400px).
- Labels above inputs, `--text-body-sm`, `--text-secondary`, weight 500
- 24px (`--space-6`) vertical gap between fields
- 16px (`--space-4`) gap between label and input
- 32px (`--space-8`) gap before submit button
- Submit button is full-width within the form container
- Inline helper text below input: `--text-caption`, `--text-tertiary`, 4px gap

---

## 14. Toast & Notification System

Toasts are the primary feedback mechanism for async operations. They must be noticeable but never disruptive to the learning flow.

Reference: `stores/toast.ts`, `components/ui/Toast.tsx`

### Toast Types

| Type | Left Border | Icon | Use |
|------|-------------|------|-----|
| **Success** | `--success` | `CheckCircle` | Session saved, settings updated, profile updated |
| **Error** | `--accent-coral` | `AlertCircle` | API failure, save failed, network error |
| **Warning** | `--accent-warm` | `AlertTriangle` | Mic permission needed, slow connection |
| **Info** | `--accent-sky` | `Info` | Tip of the day, feature announcement |

### Visual Specs

- Background: `--bg-elevated`
- Border: 1px solid `--border-subtle` + 4px left border in type color
- Border-radius: `--radius-md` (10px)
- Padding: 12px 16px
- Shadow: `--shadow-md`
- Width: 360px on desktop, calc(100vw - 32px) on mobile
- Content: icon (20px) + message text (`--text-primary`, 14px) + optional dismiss X button

### Positioning

- **Desktop:** Top-right corner, 24px from edges
- **Mobile:** Top-center, 16px from top edge, horizontally centered
- Z-index: `--z-toast` (50)

### Auto-Dismiss & Stacking

- Default auto-dismiss: 4 seconds
- **Error toasts:** persist until manually dismissed (X button or swipe)
- Progress bar at bottom of toast: thin (2px) line in type color, shrinks left-to-right over the dismiss duration
- **Stacking:** Maximum 3 visible. Newest appears on top. Older toasts compress (scale 0.95, translate down, opacity 0.8). 4th+ toast queued until a slot opens.
- Stack gap: 8px between toasts

### Animation

- **Enter:** slide in from right + fade (desktop) or slide down from top + fade (mobile). Spring physics (stiffness: 300, damping: 24). Duration ~300ms.
- **Exit:** slide out to right + fade (desktop) or slide up + fade (mobile). 200ms ease-out.
- **Progress bar:** linear shrink from 100% to 0% width over dismiss duration.

---

## 15. Loading & Empty States

Loading and empty states are where most apps feel broken or lazy. Fluent uses them as confidence-building moments.

Reference: `components/ui/Skeleton.tsx`

### Skeleton Patterns

- **Shape-matched:** Skeletons must match the exact layout shape of the content they replace. Message skeletons look like message bubbles. Card skeletons have the card's border-radius and proportions. Never use generic rectangular blocks.
- **Color:** `--bg-surface` as the base, with a shimmer highlight of `--bg-overlay`
- **Shimmer:** Left-to-right sweep, 1.5s cycle, infinite loop. Use a CSS gradient animation:
  ```css
  background: linear-gradient(
    90deg,
    var(--bg-surface) 0%,
    var(--bg-overlay) 50%,
    var(--bg-surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  ```
- **Border-radius:** match the content element (message bubble skeleton has the same asymmetric radii)

### Progressive Loading

1. Skeleton appears **immediately** on page mount (no blank flash)
2. Skeleton displays for a minimum of 300ms (even if data arrives faster) to avoid jarring flash
3. Content fades in over the skeleton: opacity 0→1, 250ms ease-out
4. **No layout shift:** skeleton dimensions must exactly match rendered content dimensions. Use fixed or min-height containers.

### Empty State Templates

Each empty state follows the same structure: **icon/illustration → heading → body copy → primary CTA**

| Context | Icon | Heading | Body | CTA |
|---------|------|---------|------|-----|
| **No sessions yet** | `MessageCircle` (32px, `--text-tertiary`) | "Dein erstes Gespräch wartet" | "Start a conversation to begin your German journey. Pick a topic, choose your level, and just speak." | "Start First Session" |
| **No messages** (session start) | `Mic` (32px, `--primary-400`) | "Bereit? Los geht's!" | "Tap the mic and say something in German. Don't worry about mistakes — that's what I'm here for." | Mic button pulsing gently |
| **No corrections** | `CheckCircle` (32px, `--success`) | "Alles richtig!" | "No corrections this session. Your German is sounding great." | "Keep Practicing" |
| **First-time dashboard** | `TrendingUp` (32px, `--text-tertiary`) | "Deine Reise beginnt hier" | "Complete a few sessions and your progress will appear here. Every conversation counts." | "Start a Session" |
| **No search results** | `Search` (32px, `--text-tertiary`) | "Nichts gefunden" | "Try a different search term or browse topics by level." | "Browse Topics" |

**Layout:** Centered vertically and horizontally in the content area. Max-width 320px. Icon has 16px margin-bottom to heading, heading has 8px to body, body has 24px to CTA. All text centered.

---

## 16. Error States & Recovery

Errors must never feel like dead ends. Every error screen offers a clear, calm path forward. Never blame the user. Never show technical jargon.

### Network Error (No Connection)

- **Trigger:** Fetch/WebSocket fails due to network
- **Display:** Full-screen glass card overlay, centered
- **Content:**
  - Icon: `WifiOff` (32px, `--text-tertiary`)
  - Heading: "Keine Verbindung"
  - Body: "Couldn't connect — check your internet and try again."
  - CTA: "Try Again" (primary button, triggers retry)
  - Secondary: "Go to Dashboard" (ghost button)
- **Behavior:** Auto-retry in background every 10s. If connection restores, dismiss automatically with success toast.

### API Error (Server Error)

- **Trigger:** 5xx response from backend
- **Display:** Inline error banner at top of content area (NOT full-screen). Does not clear existing content.
- **Content:**
  - Left icon: `AlertTriangle` (20px, `--accent-coral`)
  - Text: "Something went wrong. Your data is safe." + "Try Again" link
  - Background: `hsla(0, 72%, 58%, 0.08)` (faint coral tint)
  - Border: 1px solid `hsla(0, 72%, 58%, 0.2)`
  - Border-radius: `--radius-md`
- **Behavior:** Dismissible with X button. Retry re-attempts the failed request.

### Auth Error (Session Expired / Unauthorized)

- **Trigger:** 401 response or Supabase auth state change
- **Display:** Redirect to auth page with a toast
- **Toast message:** "Your session expired. Please sign in again." (info type)
- **Behavior:** Preserve the intended URL in query params so user returns after re-auth.

### 404 Page

- **Display:** Full content area (uses page layout, not overlay)
- **Content:**
  - Large text: "404" in `--font-display`, `--text-tertiary`, 72px
  - Heading: "Seite nicht gefunden"
  - Body: "This page doesn't exist. It might have been moved or removed."
  - CTA: "Back to Dashboard" (primary button)
- **Style:** Centered vertically and horizontally. Subtle, not dramatic.

### Session Disconnect (WebSocket Drop)

- **Trigger:** WebSocket connection lost during active session
- **Display:** Inline status badge in the session header area
- **Content:**
  - Badge: amber/warning background, "Reconnecting..." text with animated dots (... cycling)
  - Position: next to the session timer, replaces the mode indicator temporarily
- **Behavior:**
  - Auto-reconnect with exponential backoff (1s, 2s, 4s, 8s, max 30s)
  - On reconnect: badge changes to "Connected" (success color) for 2s, then fades out
  - After 5 failed attempts: switch to a persistent banner — "Connection lost. Check your internet." + "Retry" button
  - User's typed/recorded messages are buffered locally and sent on reconnect

---

## 17. Navigation & Information Architecture

### Route Hierarchy

```
/                       → Landing page (public)
/auth                   → Auth page (public, redirect if logged in)
/onboarding             → Onboarding wizard (requires auth)
/session                → Active session (requires auth + onboarding state)
/dashboard              → Progress dashboard (requires auth)
/settings               → User settings (requires auth)
```

### Nav Visibility Rules

| Page | NavBar | Sidebar (Desktop) | Bottom Nav (Mobile) |
|------|--------|-------------------|---------------------|
| Landing | Hidden | Hidden | Hidden |
| Auth | Hidden | Hidden | Hidden |
| Onboarding | Hidden | Hidden | Hidden |
| **Session** | **Hidden** (immersive) | **Hidden** | **Hidden** |
| Dashboard | Visible | Visible | Visible |
| Settings | Visible | Visible | Visible |

Reference: `components/layout/NavBar.tsx`, `components/layout/Sidebar.tsx`, `components/layout/MobileDrawer.tsx`

### Back Navigation

- Back button (`ChevronLeft` icon + "Back" text on desktop, icon only on mobile)
- Predictable destinations:
  - Session → Dashboard (with confirmation modal if session is active: "End this session?")
  - Settings → Dashboard
  - Onboarding → Landing (with confirmation if partially completed)
  - Dashboard → no back (it's home)
- Browser back button must work identically to in-app back button
- History: use `router.push` (not `router.replace`) for forward navigation so back works

### Deep Linking

- All pages are bookmarkable and shareable
- `/session` requires active session state. If no state exists, redirect to `/onboarding` with an info toast: "Let's set up your session first."
- `/dashboard` with no sessions shows the early-user empty state (Section 15)
- Auth-protected routes redirect to `/auth` and preserve the intended URL as a `?redirect=` query param

### Mobile Navigation

- **Hamburger drawer** (`MobileDrawer.tsx`): slides in from left, 280px wide, glass background
- Edge gesture: swipe right from left edge (first 20px) to open drawer
- Drawer items: Dashboard, Settings, current level badge, sign-out
- Active item: `--primary-500` text + left border indicator (4px)
- Drawer overlay: `hsla(0, 0%, 0%, 0.5)` backdrop, tap to close

---

## 18. First-Run Experience & Onboarding Polish

First impressions determine whether a nervous learner continues or bounces. Every first-run interaction must reduce anxiety and build confidence.

### Progressive Disclosure

- Never show all options at once. One decision per step.
- Each onboarding step reveals only after the previous is committed.
- Step transitions: slide left (next) or slide right (back), 300ms spring animation.

### Onboarding Step Flow

1. **Level Selection** — "What's your German level?" (A1–C1 with example phrases + audio)
2. **Module Selection** — "What would you like to practice?" (filtered by selected level)
3. **Topic Selection** — "Pick a conversation topic" (filtered by selected module)
4. **Mode Selection** — "How do you want to practice?" (Free Chat / Real-Time Correction / Guided Teaching with mini-preview animations)
5. **Mic Test** *(new step)* — "Let's test your mic. Say 'Hallo'!"
   - Shows a large mic button (same as session mic button)
   - User records, system confirms audio is captured: "Got it! Your mic sounds great."
   - If mic permission denied: friendly explanation + link to browser settings
   - If no audio detected: "I didn't catch anything — try speaking a bit louder"
   - This step normalizes recording before the first session and reduces speaking anxiety

### Post-Onboarding Tooltips

After the first session page load, show contextual tooltips for key features the user hasn't interacted with yet.

**Tooltip Style:**
- Background: `--bg-overlay` with `backdrop-filter: blur(8px)`
- Border: 1px solid `--border-default`
- Border-radius: `--radius-md`
- Padding: 12px 16px
- Arrow: 8px CSS triangle pointing to the target element
- Text: `--text-secondary`, 14px
- Dismiss: "Got it" link in `--primary-400`, or tap anywhere outside
- Shadow: `--shadow-md`
- Max-width: 260px

**Tooltip Sequence** (shown one at a time, 3-second delay after page load):

1. **Mic button:** "Tap and hold to record. Release to send." → shown on first session page visit
2. **IPA words:** "Tap underlined words to see pronunciation details." → shown after first AI response with IPA words
3. **Corrections panel** (Real-Time Correction mode): "Your corrections appear here in real-time." → shown when first correction arrives

**Display Rules:**
- Show each tooltip only once per user (persist via `localStorage` flag: `fluent_tooltip_[name]_seen`)
- 3–5 second delay after the trigger condition is met
- Only one tooltip visible at a time
- If user interacts with the target element before the tooltip appears, mark as seen and skip

---

## 19. Sound Design Specification

Sound in Fluent is **subtle, functional, and warm**. Sounds confirm actions and create a sense of physicality without demanding attention. They are Phase 2 features, but the architecture must be ready now.

### Sound Inventory

| Event | Sound | Specs | Priority |
|-------|-------|-------|----------|
| Recording start | Soft "pop" | 80ms, 440Hz sine wave, quick exponential fade-out | Phase 2 |
| Recording stop | Subtle "click" | 40ms, 880Hz, sharp attack, instant decay | Phase 2 |
| Good pronunciation | Warm "ding" | 200ms, C major chord (C4+E4+G4), sine waves, slow decay | Phase 2 |
| Correction received | Gentle "tap" | 60ms, muted percussion hit (filtered noise burst) | Phase 2 |
| Session complete | Achievement sound | 400ms, ascending C major arpeggio (C4→E4→G4→C5), 80ms per note | Phase 2 |
| Page transition | Subtle "whoosh" | 150ms, band-pass filtered white noise, frequency sweep 200→800Hz | Phase 3 |
| Error / failure | Low "thud" | 100ms, 220Hz sine, heavy filter, no ring | Phase 2 |
| Toast appear | Soft "knock" | 50ms, 660Hz, minimal | Phase 3 |

### Implementation Architecture

```typescript
// Sound engine skeleton — use Web Audio API
class SoundEngine {
  private ctx: AudioContext;
  private buffers: Map<string, AudioBuffer>;
  private enabled: boolean;
  private volume: number; // 0.0 - 1.0

  // Preload all sounds on first user interaction (AudioContext requirement)
  async init(): Promise<void>;

  // Play a named sound
  play(name: string): void;

  // Volume control (persisted in settings store)
  setVolume(v: number): void;

  // Master enable/disable (persisted in settings store)
  setEnabled(enabled: boolean): void;
}
```

### Rules

- **System mute:** Respect the operating system mute state. Do not play sounds if the device is muted.
- **Settings control:** Volume slider in Settings page (0–100%). Master on/off toggle.
- **Reduced motion:** If `prefers-reduced-motion: reduce`, disable all sounds by default (user can re-enable in settings).
- **Custom events:** All interactive elements dispatch `fluent:interaction` custom events with a `{ sound: "pop" }` detail payload. The sound engine listens to these events globally.
- **No blocking:** Sound playback must never block UI interaction. Fire-and-forget.
- **AudioContext:** Created lazily on first user gesture (click/tap) to comply with browser autoplay policies.

---

## 20. Gesture & Touch Interactions

Fluent's gesture system makes the app feel native on mobile while maintaining full accessibility through alternative controls.

### Gesture Inventory

| Element | Gesture | Action | Accessibility Alt |
|---------|---------|--------|-------------------|
| **Mic button** | Press-and-hold | Start recording; release to stop | Tap to toggle recording on/off |
| **Message bubble** | Long-press (500ms) | Show context menu (Copy, Listen, View IPA) | Three-dot menu button on hover/focus |
| **Message bubble** | Swipe left | Reveal action buttons (Copy, Listen) | Same three-dot menu |
| **Corrections panel (mobile)** | Swipe down on drag handle | Dismiss bottom sheet | Close button (X) in top-right |
| **Corrections panel (mobile)** | Swipe up on drag handle | Expand to full height | "Expand" button |
| **Onboarding cards** | Horizontal swipe | Navigate between options (level/module/topic) | Left/Right arrow buttons, or tap option directly |
| **Dashboard (mobile)** | Pull-to-refresh | Refresh session history and stats | Refresh button in header |
| **IPA modal** | Swipe down | Dismiss modal | Close button (X) or tap backdrop |

### Implementation Rules

- **Touch feedback:** All touchable elements get `whileTap={{ scale: 0.97 }}` via Framer Motion for tactile feedback.
- **Gesture thresholds:**
  - Swipe: minimum 50px horizontal distance, < 30° angle from horizontal
  - Long-press: 500ms hold duration
  - Pull-to-refresh: 60px minimum pull distance with elastic resistance
- **Velocity-based dismissal:** If user swipes a dismissable element fast enough (velocity > 500px/s), dismiss immediately without requiring the full threshold distance.
- **Visual indicators:**
  - Swipe actions: revealed buttons slide into view from the right edge as the message translates left
  - Pull-to-refresh: spinner icon appears and rotates once pull threshold is reached
  - Long-press: subtle scale-down (0.98) + faint highlight after 200ms to signal "keep holding"
- **Cancel gesture:** User can reverse a swipe/pull and return to resting state. No commitment until threshold is crossed.
- **All gestures must have button/tap equivalents** — gestures are enhancements, not requirements.

---

## 21. Audio Visualization

Audio visualization makes the invisible (sound) visible, reinforcing the connection between speaking and learning. All visualizations are functional, not decorative.

### Recording Waveform (Inside Mic Button)

During active recording, the mic icon is replaced by a real-time amplitude visualization:

- **Layout:** 5 vertical bars centered inside the 64px (72px mobile) mic button circle
- **Bar specs:** 3px width, 2px gap between bars, rounded ends (`border-radius: 1.5px`)
- **Height mapping:** Each bar's height maps to a frequency band of the input audio (via `AnalyserNode.getByteFrequencyData`). Minimum height: 6px. Maximum height: 28px (32px mobile).
- **Color:** `--primary-300` with a gradient to `--primary-400` from bottom to top
- **Update rate:** 60fps via `requestAnimationFrame`
- **Smoothing:** Apply exponential smoothing (factor 0.7) to prevent jittery bar movements

### AI Speaking Indicator

When the AI is generating speech (TTS playback):

- **Layout:** Sine wave animation inside the mic button area, replacing the bars
- **Wave specs:** 3 overlapping sine waves with different phases and amplitudes
- **Color:** `--primary-300` at varying opacities (1.0, 0.6, 0.3 for each wave)
- **Animation:** Smooth oscillation, ~2s cycle. Not tied to actual audio data (TTS output isn't analyzed in real-time). CSS-driven, not canvas.
- **Transition:** Bars morph into wave on state change (300ms crossfade)

### Audio Playback Progress (IPA Modal "Listen" Button)

When the user taps "Listen" in the IPA modal to hear the correct pronunciation:

- **Layout:** Mini waveform progress bar replacing the button text during playback
- **Progress:** A pre-rendered static waveform shape (from the TTS audio buffer) fills left-to-right with `--primary-400` as audio plays. Unfilled portion in `--text-muted`.
- **Controls:** Tap to play, tap again to pause. Button toggles between `PlayCircle` and `PauseCircle` icons.
- **Duration:** The waveform width corresponds to audio duration. Short words (~0.5s) show a compact bar.

### Message Audio Indicator

For messages that have associated audio (user recordings, AI TTS):

- **Icon:** Small `Volume2` icon (16px, `--text-tertiary`) in the bottom-right corner of the message bubble
- **Tap action:** Replay the audio. While playing, icon changes to `VolumeX` (tap to stop) and pulses gently.
- **Hover (desktop):** Icon lightens to `--text-secondary`

---

## 22. Spacing & Layout Grid

Consistent spacing creates visual rhythm. Every spatial decision in Fluent is based on a **4px base unit**.

### Base Unit

- **4px** is the atomic unit. All spacing, padding, margins, and gaps must be multiples of 4px.
- This aligns with the token system in Section 3 (`--space-1: 4px` through `--space-16: 64px`).

### Content Width

| Breakpoint | Max Content Width | Sidebar | Total Layout |
|------------|-------------------|---------|--------------|
| Desktop (1280px+) | 1024px | 240px | sidebar + gap + content |
| Large (1024–1279px) | 768px | 240px collapsed (64px) | sidebar + gap + content |
| Tablet (768–1023px) | 100% - 32px padding | None (top nav) | full width |
| Mobile (<768px) | 100% - 32px padding | None (drawer) | full width |

### Page Padding

- **Desktop:** 24px (`--space-6`) horizontal padding on content area
- **Mobile:** 16px (`--space-4`) horizontal padding
- **Top padding:** 24px desktop, 16px mobile (below NavBar)
- **Bottom padding:** 32px desktop, 88px mobile (clear the bottom nav / mic button)

### Section Spacing

- **Between major page sections:** 48px (`--space-12`) — e.g., between dashboard stats and session history
- **Between subsections:** 24px (`--space-6`) — e.g., between chart and its legend
- **Between heading and content:** 16px (`--space-4`)
- **Between a section's last item and the next section heading:** 48px (`--space-12`)

### Card Grid Gaps

- **Mobile:** 16px (`--space-4`) gap between cards
- **Desktop:** 24px (`--space-6`) gap between cards
- **Dashboard grid:** CSS Grid with `auto-fill, minmax(300px, 1fr)` + 24px gap

### Message Spacing

- **Between consecutive messages (same speaker):** 8px (`--space-2`)
- **Between message groups (different speakers):** 16px (`--space-4`)
- **Message list top/bottom padding:** 16px
- **Message horizontal padding from edges:** 16px mobile, 24px desktop

### Vertical Rhythm

- **Body text** (`--font-body`): `line-height: 1.6` (25.6px at 16px font)
- **Headings** (`--font-display`): `line-height: 1.2`
- **Captions/labels**: `line-height: 1.4`
- **IPA text** (`--font-mono`): `line-height: 1.5` (extra space for diacritics)

---

## 23. Copy & Microcopy Guidelines

Words matter as much as pixels. Every string in Fluent should feel like it was written by a supportive teacher, not generated by a machine.

### Tone Principles

| Principle | Do | Don't |
|-----------|-----|-------|
| **Warm** | "Great session! You're getting the hang of it." | "Session completed successfully." |
| **Encouraging** | "Try again — speaking gets easier with practice." | "Failed. Please retry." |
| **Precise** | "'Der' is masculine. This noun always takes 'der'." | "Wrong article." |
| **Never patronizing** | "That's a tricky one. Most learners mix these up." | "Oops! That's wrong! 😅" |
| **Never clinical** | "Couldn't hear you — try speaking a bit louder." | "Error: Audio input below threshold." |

### German Flavor

Sprinkle German naturally in empty states, celebrations, and headers. Always with a subtle translation for non-German UI language settings.

**Patterns:**
- Empty state headings: German phrase as heading, English explanation as body
- Section headers on Dashboard: "Dein Fortschritt" (Your Progress), "Letzte Sitzungen" (Recent Sessions)
- Celebration moments: "Ausgezeichnet!" (Excellent!), "Weiter so!" (Keep it up!)
- These German phrases render in `--font-display` for visual distinction

### Button Labels

- **Action verbs only.** Maximum 3 words.
- Pattern: `[Verb] [Object]` — "Start Session", "Try Again", "View Progress", "End Session"
- Never vague: "Submit", "OK", "Continue" without context
- Primary CTA should complete the sentence "I want to ___": "Start Speaking", "Practice Again"

### Error Messages

Structure: **What happened** + **What to do**.

| Context | Message |
|---------|---------|
| Network failure | "Couldn't connect — check your internet and try again." |
| Mic permission denied | "Fluent needs mic access to hear you. Tap here to enable it in your browser settings." |
| No audio detected | "I didn't catch anything — try speaking a bit louder, or move to a quieter spot." |
| Server error | "Something went wrong on our end. Your data is safe — try again in a moment." |
| Session expired | "Your session expired. Sign in again to continue." |

**Never:** Error codes, stack traces, "An unexpected error occurred", or "Please contact support."

### Number & Date Formatting

- **Numbers:** Use locale-appropriate separators via `Intl.NumberFormat`. EN: 1,234 / DE: 1.234 / ES: 1.234
- **Percentages:** Always include the % symbol. "78%" not "78 percent" or "0.78".
- **Dates — recent:** Use relative time ("2 hours ago", "Yesterday", "3 days ago") for anything within the last 7 days.
- **Dates — older:** Use absolute format via `Intl.DateTimeFormat`. EN: "Jan 15, 2026" / DE: "15. Jan. 2026"
- **Durations:** "12 min" not "12 minutes" or "00:12:00". For sessions: "12 min session".
- **Scores:** Always integer, never decimal. "78" not "78.3". The precision is false confidence.

### Copy Table for Key Touchpoints

| Touchpoint | Copy (EN) |
|------------|-----------|
| Landing hero headline | "Speak German with confidence" |
| Landing sub-headline | "Practice real conversations with AI. Get pronunciation feedback in real-time." |
| Landing CTA | "Start Speaking — It's Free" |
| Auth sign-in heading | "Willkommen zurück" |
| Auth sign-up heading | "Deine Reise beginnt hier" |
| Auth flavor text | *"Jede Reise beginnt mit einem Schritt"* |
| Onboarding level step | "What's your German level?" |
| Onboarding mic test | "Let's test your mic. Say 'Hallo'!" |
| Onboarding mic success | "Got it! Your mic sounds great." |
| Session start (A1) | "Bereit? Los geht's! Tap the mic and say something." |
| Session start (C1) | "Ready when you are." |
| Dashboard — no sessions | "Dein erstes Gespräch wartet. Start a conversation to begin your journey." |
| Dashboard — streak | "3-day streak! Weiter so!" |
| Session end — improvement | "Your pronunciation improved since last session. Toll gemacht!" |
| Session end — no improvement | "Every session builds your confidence. Keep going!" |
| Settings — danger zone | "Delete my account and all data. This can't be undone." |

All copy must go through `next-intl` for i18n. Never hardcode user-visible strings. The copy table above represents the EN base — translators adapt tone for ES, FR, DE.

---

## 24. Performance & Perceived Speed

A language learning app must feel instant. Any delay between speaking and seeing a response breaks the conversational immersion. Performance is a UX feature.

### Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Preload fonts, optimize critical CSS, server-render above-fold |
| **FID** (First Input Delay) | < 100ms | Defer non-critical JS, keep main thread free |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Fixed dimensions on skeletons, `font-display: swap`, no late-loading banners |

### Skeleton Timing

- Show skeleton on **immediate mount** — never show a blank page.
- Minimum skeleton display: 300ms. If data arrives in 50ms, still show skeleton for 300ms to avoid a jarring flash.
- Transition: content fades in over skeleton, 250ms ease-out.
- Skeleton **never** appears on top of already-loaded content. One-way transition only.

### Optimistic Updates

- **Messages:** User messages appear in the chat instantly when sent. A subtle "sending" indicator (faint opacity or spinner) shows until the backend confirms. If the send fails, the message shows an error state with a retry option.
- **Settings changes:** Toggle/select changes apply instantly to the UI. Persist to Supabase in background. If save fails, revert with a warning toast.
- **Session start:** Navigate to session page immediately on "Start Session" click. WebSocket connects in background. Show a connecting indicator only if it takes > 1s.

### Font Loading

```css
/* Body font — swap to show text ASAP */
@font-face {
  font-family: 'General Sans';
  font-display: swap;
}

/* Display font — optional: if it doesn't load, fallback is fine */
@font-face {
  font-family: 'Satoshi';
  font-display: optional;
}

/* Mono font — swap: IPA text needs to be readable immediately */
@font-face {
  font-family: 'JetBrains Mono';
  font-display: swap;
}
```

### Route Prefetching

- Use Next.js `<Link prefetch>` for likely next pages:
  - Landing → Auth (prefetch on CTA hover)
  - Auth → Onboarding (prefetch after successful sign-in)
  - Dashboard → Session (prefetch on "Start Session" card hover)
  - Onboarding → Session (prefetch on last step)
- Prefetch mode components on the onboarding mode-selection step (user has indicated intent)

### Bundle Optimization

- **Lazy-load mode components:** `FreeChat`, `RealTimeCorrection`, `GuidedTeaching` are loaded dynamically:
  ```typescript
  const FreeChat = dynamic(() => import('@/components/modes/FreeChat'), {
    loading: () => <SessionSkeleton />,
  });
  ```
- **Tree-shake lucide-react:** Import icons individually (`import { Mic } from 'lucide-react'`), never import the full library.
- **Code split by route:** Next.js handles this automatically. Verify with `next/bundle-analyzer`.
- **Supabase client:** Use `createBrowserClient` only in client components. Server components use `createServerClient`.

### WebSocket Performance

- **Connect:** On session page mount. Not before.
- **Reconnect:** Exponential backoff — 1s, 2s, 4s, 8s, max 30s. With jitter (±20%) to avoid thundering herd.
- **Heartbeat:** Send ping every 25s, expect pong within 5s. If no pong, trigger reconnect.
- **Message buffering:** If WebSocket is disconnected, buffer outgoing messages (max 10) and flush on reconnect.
- **Cleanup:** Close WebSocket on session page unmount. Abort pending requests.

---

## 25. Level-Adaptive Visual Language

Fluent isn't one app — it's five apps, one per CEFR level. The visual density, scaffolding, and tone adapt to match the learner's confidence and skill.

### Visual Density by Level

| Aspect | A1-A2 (Beginner) | B1-B2 (Intermediate) | C1 (Advanced) |
|--------|-------------------|----------------------|----------------|
| **Font size** | Body 17px, generous leading | Body 16px, standard leading | Body 15px, tighter leading |
| **Whitespace** | Extra generous. 32px between message groups. | Standard spacing per Section 22. | Tighter. 12px between message groups. |
| **Scaffolding** | Conversation starters visible, word hints, translation toggles | Conversation starters hidden after 3 sessions, hints on-demand only | No scaffolding. Clean conversation view. |
| **Message max-width** | 85% (shorter messages encouraged) | 80% desktop, 90% mobile | 75% desktop (longer, denser messages) |
| **Corrections** | Inline gentle nudges with explanations auto-expanded | Corrections panel with explanations collapsed by default | Subtle inline annotations only (underline + tooltip on hover) |
| **Onboarding guidance** | Detailed explanations at every step, slow pace | Standard explanations, moderate pace | Minimal text, fast pace, "You know the drill" tone |

### Level Badge Colors

Each CEFR level has a distinct badge color for instant visual recognition:

| Level | Color | Token | Hex |
|-------|-------|-------|-----|
| **A1** | Emerald | `--level-a1` | `hsl(152, 55%, 48%)` |
| **A2** | Teal | `--level-a2` | `hsl(168, 45%, 42%)` |
| **B1** | Sky | `--level-b1` | `hsl(210, 65%, 55%)` |
| **B2** | Indigo | `--level-b2` | `hsl(232, 50%, 55%)` |
| **C1** | Amber/Gold | `--level-c1` | `hsl(38, 90%, 58%)` |

Badge style: pill-shaped (`--radius-full`), 8px 12px padding, level color background at 15% opacity, level color text. `--text-caption` font size.

### Adaptive Conversation Starters

- **A1:** Always visible at session start. 4–6 chips with simple phrases + translations.
  - "Hallo, ich bin..." / Hello, I am...
  - "Wie heißt du?" / What's your name?
  - "Ich komme aus..." / I come from...
- **A2:** Visible at session start. 3–4 chips, slightly more complex, no translations.
  - "Was machst du gerne?"
  - "Erzähl mir von deinem Tag"
- **B1:** Visible only on first session of a new topic. 2–3 topic-specific prompts.
  - "Was hältst du von...?"
  - "Meiner Meinung nach..."
- **B2+:** **Hidden.** The learner drives the conversation. If no input after 10s, AI sends a gentle open-ended prompt.
- **C1:** No starters. AI may send a challenging topic prompt after 5s silence.

### Adaptive Correction Intensity

- **A1:** Only correct meaning-changing errors. Ignore grammar nuances. Focus: "You were understood."
- **A2:** Correct major grammar + meaning errors. Ignore style and word choice.
- **B1:** Correct all grammar errors. Note word choice alternatives as suggestions.
- **B2:** Full corrections including style, register, and natural phrasing.
- **C1:** Correct everything. Note subtle nuances, idiom usage, and register appropriateness. Treat the learner as a near-native speaker.

### Adaptive UI Elements Summary

| Feature | A1 | A2 | B1 | B2 | C1 |
|---------|----|----|----|----|-----|
| Conversation starters | Always | Always | First session per topic | Hidden | Hidden |
| Translation hints | Visible by default | Toggle on/off | Hidden by default | Removed | Removed |
| Word suggestion bar | Active | Active | On-demand | Removed | Removed |
| Correction detail level | Minimal | Moderate | Full | Full + style | Full + nuance |
| Corrections auto-expand | Yes | Yes | No | No | No (inline only) |
| IPA detail on tap | Simplified | Standard | Standard | Detailed | Detailed + comparison |
| Onboarding steps | 5 (incl. mic test) | 5 | 4 (skip mic test if returning) | 4 | 3 (skip guidance text) |
| Post-session detail | Encouraging summary only | Summary + top corrections | Full breakdown | Full + trend analysis | Full + near-native benchmark |
