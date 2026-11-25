# mirahmadov.uz — Cozy & Quiet

Goal: a personal website that **shows nothing**. No portfolio, no pitch, no game.
You open it and it's a calm place: a picture, soft light, slow motion, maybe sound.
Like sitting by a window.

---

## 1. What the project is now

Stack: Next.js 16 (App Router), React 19, Tailwind v4, framer-motion, zustand, lucide-react.

Uncommitted state (working tree): the old "desktop / Telegram folders" UI was deleted
and replaced with a **"nature world" game**:

| File | What it does | Cozy verdict |
|---|---|---|
| `app/page.tsx` | renders `<NatureWorld />` | keep |
| `components/nature-world.tsx` | background image + weather overlays + everything below + 5 modals | keep, slim down |
| `components/nature-particles.tsx` | canvas: leaves / rain / star motes per weather | **keep**, this is the core of the mood |
| `components/firefly-entity.tsx` | 6 clickable fireflies, "catch" counter | keep the glow, drop the clicking/counting |
| `components/interactive-hotspots.tsx` | 4 pulsing pins (Nexura, About, GitHub, Campfire) + talking owl | **delete** — loud, `animate-ping` beacons, sales copy |
| `components/nature-hud.tsx` | top profile badge, firefly counter, weather buttons, sound toggle, help, bottom link dock | **mostly delete** — keep only a tiny sound toggle |
| `components/modals/*` (5 files) | about / nexura / github / campfire / guide popups | **delete all** |
| `stores/game-store.ts` | weather, audio, fireflies count, active modal, marshmallows | shrink to `weather` + `audioEnabled` (or drop zustand entirely) |
| `lib/audio.ts` | procedural Web Audio: noise ambience + click/chime/hoot | keep ambience, drop click/hoot |
| `app/layout.tsx` | SEO metadata full of "Software Engineer @ Nexura" | soften |
| `app/globals.css` | fonts, float keyframes, scrollbar | keep float keyframes, drop scrollbar |

Unused files in `public/`: `background.jpg` (1.3 MB), `folder.png`, `placeholder.svg`,
`projects/*`, `socials/*`. Fonts `Havelock` / `Gilroy` are declared but not used by any component.

**Main problem:** the current build is a *game* — counters, pins, badges, popups, an owl
telling you to check GitHub. It's busy and it's asking for attention. Cozy is the opposite.

---

## 2. The cozy version (what it should be)

One screen. No scroll. No text except maybe one small line.

- **The picture** — `nature-bg.jpg`, full screen, slow Ken-Burns drift (scale 1 → 1.05 over ~60s, back).
- **Time follows the real clock** — no weather buttons. Visitor's local hour picks the mood:
  - 06–17 → day, 17–20 → sunset, 20–06 → night.
  - Optional: rain on random visits (e.g. 1 in 5), not a button.
- **Particles** — existing canvas, but slower and fewer. Night = fireflies + few stars, day = drifting leaves/dust.
- **Fireflies** — just glow and float. Not clickable. No counter.
- **Sound** — off by default (browsers block autoplay anyway). One small, almost invisible
  speaker icon in a corner. Fades in over 2–3 s. Rain/wind/night noise already exists in `lib/audio.ts`.
- **One whisper of identity** (optional) — bottom-left, low opacity, small: `mirahmadov`
  or nothing at all. On hover it can reveal a mail link. That's the only "content".
- **Cursor** — normal. No glow-follow, no trails. Quiet.
- **Respect `prefers-reduced-motion`** — stop drift and particles, keep the picture.

Rules for everything added later:
1. Nothing pulses, pings, bounces or spins.
2. Animations are ≥ 4 s long and ease-in-out.
3. No popups, no modals, no counters, no "click me".
4. Colors stay warm and dim; no neon badges.
5. If it needs explaining, it doesn't belong.

---

## 3. Steps

1. Delete `components/interactive-hotspots.tsx` and `components/modals/`.
2. Strip `nature-hud.tsx` down to the sound toggle (or move the toggle into `nature-world.tsx` and delete the file).
3. Make fireflies non-interactive (remove `onCatch`, `pointer-events-auto`).
4. Replace weather state with `const mood = moodFromHour(new Date().getHours())` in `nature-world.tsx`.
5. Shrink `game-store.ts` to `audioEnabled` only — or replace with `useState` and delete zustand.
6. Remove `playClick` / `playOwlHoot` from `lib/audio.ts`; keep `updateAmbience` + `setMuted`.
7. Slow down particles in `nature-particles.tsx` (lower speed + count).
8. Add slow background drift + `prefers-reduced-motion` CSS in `globals.css`.
9. Clean `layout.tsx` metadata: title `mirahmadov`, short calm description, keep OG url.
10. Delete unused `public/` assets and unused `@font-face` blocks.
11. Optional: drop `lucide-react` (only the speaker icon left — inline SVG is fine).

Result: ~4 small files instead of ~15, nothing to click except sound.

---

## 4. Ideas for later (only if they stay quiet)

- Seasonal tint by month (snow particles in Dec–Feb).
- Different background picture for night (a real night photo instead of a dark overlay).
- A single line that changes daily, e.g. a short poem fragment — very small, fades in after 10 s.
