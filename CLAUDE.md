# Lovt — Claude Context File

Everything a fresh Claude session needs to know to work on this project without asking questions.

---

## What This App Is

**Lovt** is a couples web app. Not a messaging app. Short 2-minute interactions with natural exit points. Games-first, modular architecture. Each feature is a self-contained plug-in.

**Core philosophy:**
- Low attention span — tap, play, done. No chore-like "sit down together time"
- Async play > synchronous. Partner answers on lunch break, you answer on the train, reveals happen when both are done
- Suggest, don't force — every creative input gets an optional suggestion button. Never leave users staring at a blank screen, never make them feel controlled
- No messaging feature. Users have iMessage/WhatsApp. We're not competing with that
- No photos stored anywhere. Hard rule, no exceptions
- Guest mode = local/session-only play, clearly labeled "nothing is saved"

**Target user:** Android-first (owner has Android, partner has iPhone). Web app works for both. No Apple App Store required.

**Monetization:** Guests and free accounts see ads. Paid tier removes ads. Not yet implemented.

**Live URL:** https://lovt.1box.online (Cloudflare Pages, custom domain via CNAME → lovt.pages.dev)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS + inline styles (inline for precision, Tailwind for utilities) |
| Routing | React Router v6 (BrowserRouter) |
| Backend | Supabase (auth, Postgres, RLS, Realtime) |
| Deploy | Cloudflare Pages (auto-deploy from GitHub `main`) |
| Repo | github.com/advantiqmind/Lovt (was PawLoft — GitHub redirects old name) |

**Key dependencies:**
```json
"@supabase/supabase-js": "^2.49.0"
"react-router-dom": "^6.28.0"
```

---

## Project Structure

```
src/
  App.tsx                    # Routes only
  index.css                  # Tailwind directives + heartbeat keyframes
  vite-env.d.ts              # Vite env type declarations
  lib/
    supabase.ts              # Supabase client + Profile type
  hooks/
    useAuth.ts               # Auth state, profile, refetch
  pages/
    Landing.tsx              # Animated heart rings, entry point
    Auth.tsx                 # Sign up / sign in
    Pair.tsx                 # Connect with partner code
    Home.tsx                 # Game grid (authenticated + paired users)
    Guest.tsx                # Guest mode game list
    games/
      ThisOrThat.tsx         # Pass-and-play choices game
      Hangman.tsx            # SVG gallows word game
      WordChain.tsx          # Letter-chaining word game with suggestions
      Countdown.tsx          # localStorage event timers
supabase/
  schema.sql                 # DB schema — must be run manually in Supabase SQL Editor
public/
  _redirects                 # Cloudflare SPA routing: /* /index.html 200
```

---

## Routes

```
/                  Landing (→ /home if authed+paired, → /pair if authed only)
/auth              Sign up / sign in
/pair              Connect with partner (authed, not yet paired)
/home              Game grid (authed + paired only)
/guest             Guest mode
/game/this-or-that
/game/hangman
/game/word-chain
/game/countdown
```

---

## Supabase

**Project URL:** https://eoyymhwufjocahrffssg.supabase.co
**Anon key:** sb_publishable_bq4Ii8gzmL32zsZXLuyuoQ_GQ3LfSrP
**DB password:** /fX2SB5DzfQ6r9Kvm
**Confirm email:** OFF (users sign up without email confirmation)

Credentials are baked into `src/lib/supabase.ts` as fallbacks so the app works without env vars. This is intentional for a consumer app with a public anon key.

### Schema Status
**THE SCHEMA HAS NOT BEEN RUN YET.** This is the biggest blocker. Until `supabase/schema.sql` is executed in the Supabase SQL Editor, auth works but pairing, profiles, and all couple features are broken. The app runs in effectively guest-only mode.

To fix: go to Supabase dashboard → SQL Editor → paste contents of `supabase/schema.sql` → run.

### Database Tables
- `profiles` — extends auth.users. Fields: id (uuid, FK to auth.users), display_name, pair_code (unique 6-char auto-generated), couple_id (nullable FK to couples), created_at
- `couples` — id, user1_id, user2_id, created_at

### Key Functions (SECURITY DEFINER — bypass RLS safely)
- `my_couple_id()` — returns current user's couple_id without recursive RLS
- `pair_with_code(partner_code text)` — finds partner by code, creates couple, links both profiles. Returns JSON `{success: true, couple_id}` or `{error: "..."}`. Called from Pair.tsx via `supabase.rpc('pair_with_code', { partner_code })`
- `handle_new_user()` — trigger, auto-creates profile row on auth.users INSERT

### RLS Policies
- Users can only read their own profile + their partner's profile
- Users can only read their own couple row
- No direct INSERT to couples table — handled by `pair_with_code` function

---

## Design System

### Colors
```
Background:        #080808
Brand accent:      #e11d48  (rose red)
This or That:      #e11d48
Hangman:           #7c3aed  (purple)
Word Chain:        #f59e0b  (amber)
Countdown:         #f97316  (orange)
Draw Together:     #0ea5e9  (sky blue)
Compass:           #10b981  (emerald)
```

### Typography
- Headings: `fontWeight: 900`, `letterSpacing: '-0.04em'`
- App name "LOVT": all-caps, `fontSize: 22`, `fontWeight: 900`, `letterSpacing: '-0.05em'`
- Section labels: `fontSize: 10-11`, `fontWeight: 700`, `letterSpacing: '0.18-0.2em'`, `textTransform: 'uppercase'`, `color: rgba(255,255,255,0.2)`
- Body/secondary: `rgba(255,255,255,0.25-0.35)`

### Visual Patterns
- Every page has a radial ambient glow at the top (tinted to page accent color)
- Cards: `borderRadius: 16-20`, subtle border `rgba(255,255,255,0.06-0.1)` or accent-tinted
- Buttons: `active:scale-95 transition-transform` (Tailwind) for press feedback
- Top accent line on active/ready cards: `linear-gradient(90deg, transparent, {accent}80, transparent)`, height 1px, `position: absolute, top: 0`
- Glow on primary buttons: `boxShadow: 0 4px 24-28px {accent}30`
- Gradients: `linear-gradient(135deg, {accent}, darker-shade)`

### Rules — Never Break These
1. **No emojis anywhere.** Replace every emoji with an inline SVG. The user called emoji usage "AI generated looking." This applies to icons, win/lose states, results screens, everything.
2. **No photos stored.** Hard rule.
3. **Suggest, don't force.** Any feature where a user needs to create something (word, question, name) must offer an optional suggestion. The suggestion fills the input — user can edit or ignore it.
4. **No comments explaining WHAT code does.** Only comment WHY when it's non-obvious.
5. **No emojis.** (Worth saying twice.)

### Landing Page
- 4 concentric animated rings (200px outer) behind a centered heart SVG
- Heartbeat CSS animation after entrance (double-beat rhythm) defined in `index.css`
- "Lovt" title at 86px, fontWeight 900, gradient white text
- Buttons: "Get Started", "Sign In", "Continue as Guest"

---

## What's Built

### Games (all local/pass-and-play, no real-time yet)

| Game | Status | Notes |
|------|--------|-------|
| This or That | Done | 25 couple-specific questions, shuffle, progress bar, results screen |
| Hangman | Done | 45-word list, SVG gallows 6 stages, A-Z keyboard with color feedback |
| Word Chain | Done | Free-form start, last-letter chaining, "Suggest a word" button, 200-word pool by letter |
| Countdown | Done | localStorage persistence, live 1s tick, add/remove events |
| Draw Together | Coming Soon | Planned: Supabase Realtime + canvas lib (Konva.js or Fabric.js) |
| Compass | Coming Soon | Planned: GPS + Supabase Realtime location sync, Android-first |

### Pages
- Landing, Auth, Pair, Home, Guest — all done
- All game pages wired in App.tsx and accessible from both Home (authenticated) and Guest mode

---

## What's NOT Built Yet (Priority Order)

### 1. Run the Supabase schema (USER must do this)
Two-minute task. Without it, pairing doesn't work and the app is guest-only.

### 2. Async multiplayer for This or That (highest value feature)
Both partners answer the same question independently on their own time. App holds answers until both are in, then reveals side-by-side. This is the core differentiator — "natural conversation on your own time." Requires Supabase schema to be running.

Implementation plan:
- New table: `game_sessions` (couple_id, game_type, question_index, answers jsonb, state: waiting/revealed)
- Both players see the same question (pulled from a shared seed)
- Answer is written to Supabase, state flips to "revealed" when second player answers
- Real-time subscription shows reveal animation

### 3. This or That content expansion
Current: 25 questions. Target: 150-300 questions in 5 categories.
- Category selector before game: Playful / Flirty / Deep / Random / Spicy
- Mix ratio: ~30% funny, 25% flirty, 20% deep, 15% random, 10% spicy
- Flow: easy entry (silly) → engagement (playful banter) → connection (deeper)
- "Why did you pick that?" prompt after each answer (conversation springboard, not an endpoint)
- Intensity toggle (can escalate through a session)

### 4. Favorites / Save questions
Heart icon on questions. Saved to Supabase per couple. Revisit screen.

### 5. Draw Together
Shared real-time canvas. Both partners draw simultaneously. Canvas erases after both confirm.
Requires: Supabase Realtime for stroke sync, Konva.js or Fabric.js for canvas.

### 6. Compass
Points toward partner's last known location. Code-based pairing (no account needed for guest version).
Requires: Geolocation API, Supabase Realtime for location updates. Android-first (iOS has permission friction).

### 7. Push notifications
Android Web Push (service worker). Trigger: partner answered a question / it's your turn.
iOS requires a paid Apple developer account + App Store — user explicitly doesn't want this.

### 8. Ads + remove-ads purchase
Guests and free accounts see ads. Paid tier removes them. Not started.

---

## Git Workflow

**Critical:** Direct pushes to `main` via local git proxy return HTTP 503 intermittently. Use this workflow:

1. Make changes locally
2. Create a new branch off main: `git checkout -b claude/your-feature`
3. Commit locally
4. Try pushing: `git push -u origin claude/your-feature`
5. If that fails, use `mcp__github__push_files` to push files directly via GitHub API
6. Create PR: `mcp__github__create_pull_request`
7. Merge: `mcp__github__merge_pull_request` with `merge_method: "squash"`

**After a squash merge:** Always create a new branch from the updated main for the next PR. Squash merges rewrite commit SHAs — if you base a new PR on an old branch, you'll get merge conflicts even when there are none.

**Local sync after MCP pushes:** When files are pushed via `mcp__github__push_files` instead of git, the local working tree gets out of sync. Run:
```bash
git fetch origin main && git reset --hard origin/main
```
Or to discard just the specific files:
```bash
git checkout -- src/path/to/file.tsx
```

**Commit signature:** Always set before committing:
```bash
git config user.email noreply@anthropic.com
git config user.name Claude
```

---

## Cloudflare Pages

- Auto-deploys from `main` branch on push
- Build command: `npm run build`
- Output directory: `dist`
- No framework preset (plain Vite)
- `public/_redirects` handles SPA routing: `/* /index.html 200`
- Custom domain `lovt.1box.online` is a CNAME pointing to `lovt.pages.dev`
- Preview deployments are created for PRs — production only triggers on main merges

---

## Product Principles (User's Words)

- **"Fix the flat tire, don't reinvent the wheel"** — targeted improvements, not rewrites
- **"This is not a messaging app. Low attention span thing."** — 2-minute interactions, natural exit points
- **"No emojis. Make it look like a triple A game website."** — premium dark aesthetic, SVG everything
- **"Let it be optional. Give suggestions for those who aren't creative."** — Suggest button on every creative input, going forward this applies to ALL new features
- **"I'm not worried about iPhone right now"** — Android-first, web works for iPhone as fallback
- **"Nothing is saved [in guest mode]. Create an account to keep your history."** — this exact wording is in Guest.tsx and must stay accurate

---

## Component Patterns

### Page wrapper (every page uses this)
```tsx
<div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', flexDirection: 'column', padding: '0 20-24px' }}>
  {/* Ambient glow */}
  <div className="pointer-events-none fixed inset-0 z-0" style={{
    background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(R,G,B,0.07-0.1) 0%, transparent 65%)',
  }} />
  {/* Content at zIndex: 10 */}
</div>
```

### Game header
```tsx
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingBottom: 16, position: 'relative', zIndex: 10 }}>
  <button onClick={() => navigate(-1)} style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>← Back</button>
  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>GAME NAME</span>
  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>counter or score</span>
</div>
```

### Suggest button pattern (apply to ALL new creative inputs)
```tsx
<button
  onClick={handleSuggest}
  style={{
    width: '100%', padding: '13px', marginTop: 8,
    borderRadius: 12,
    background: `${accentColor}10`,
    border: `1px solid ${accentColor}25`,
    color: accentColor, fontSize: 13, fontWeight: 600,
  }}
  className="active:scale-95 transition-transform"
>
  Suggest a word  {/* or "Suggest an idea" / "Give me one" etc */}
</button>
```

### Primary action button
```tsx
<button
  style={{
    width: '100%', padding: '16-17px', borderRadius: 16,
    background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
    boxShadow: '0 4px 28px rgba(225,29,72,0.3)',
    color: '#fff', fontWeight: 700, fontSize: 15,
    border: 'none', cursor: 'pointer',
  }}
  className="active:scale-95 transition-transform"
>
```

---

## Research Notes (saved for feature decisions)

From Reddit/app store research on couples apps:

- **Async beats sync.** People want to answer on their own schedule, not forced "sit down together" sessions
- **Intensity levels matter.** Playful → Deep → Spicy toggle. Start light, level up as trust builds
- **No chat needed.** Apps that added messaging saw users default to existing apps. Stay focused on games
- **Long-distance couples are the core audience.** Fills gap between calls
- **Conversation springboards, not answer endpoints.** The "why did you pick that?" discussion is the real value
- **Speed is popular.** Quick-fire 3-second rounds beat long drawn-out formats
- **Content freshness matters.** Seasonal packs, new questions regularly
- **This or That content targets:** 150-300 questions, 5 categories, 30% funny / 25% flirty / 20% deep / 15% random / 10% spicy
- **Saving/favoriting.** "Remember when you answered this?" — couples want to revisit moments

---

## Known Quirks / Gotchas

1. **Supabase schema not deployed** — biggest blocker. App auth works, pairing does not.
2. **GitHub repo name mismatch** — repo was renamed from `PawLoft` to `Lovt`. GitHub redirects transparently but MCP tools must use `PawLoft` as the repo name in the `advantiqmind` org (they follow the redirect).
3. **Local git proxy 503s** — `http://127.0.0.1:36953` proxy sometimes returns 503 for main branch pushes. Use MCP push as fallback.
4. **Squash merge divergence** — after a PR is squash-merged, the local branch history diverges from main. Always `git reset --hard origin/main` before starting new work, or create a fresh branch.
5. **TypeScript** — `src/vite-env.d.ts` exists to fix `import.meta.env` type errors. Don't delete it.
6. **No test suite** — none exists. `npm run build` (which runs `tsc && vite build`) is the verification step.
