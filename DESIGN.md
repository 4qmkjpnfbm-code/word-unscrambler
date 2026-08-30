# DESIGN.md — lettersunscrambler.com

Word Unscrambler. Tool-first. Cinematic wood/felt table visible in **both** themes. Frosted glass panel over `stage.jpg`. Apple-like restraint. Not a SaaS dashboard. Not a casino. Not a kids’ word-game skin.

Live overlay: `/modern-v39.css` (v41 theme + v42 WCAG + v43 consent + v44 mobile nav). Base: `/styles.css`. Domain: https://lettersunscrambler.com  
Legal: HDK Distribution Ltd · GB · contact hdkdistributionltd@gmail.com  
Never publish `twitter:site`, `sameAs` x.com/h4_rry2, or any public X handle.

---

## Product job

One primary action: type letters → find words. Modes sit under the field (Unscrambler, Scrabble, Anagrams, Wordle, Crossword, Lists). Results are the hero after submit. Ads never cover the letter box or Best play.

Voice: British English (en-GB). Short. Concrete. No “unlock your word potential.” No stock-photo people. No purple-gradient AI slop.

---

## Surfaces

| Surface | Role |
|---|---|
| Stage | Full-bleed wood + felt photo. Dark film in dark theme; light wash in light theme. Always visible behind the tool. |
| Panel | Frosted glass card over the stage. Holds the form. |
| Results | Best play card + length chips + word tiles. After first solve, stage copy hides on mobile. |
| Chrome | Slim header: tile mark + Word Unscrambler + Theme + Menu. Footer: tools, legal, Feedback. |
| Consent | Compact bar pinned to bottom. Never overlaps Best play. |

Mobile breakpoint: **720px**. Touch targets ≥ 44px.

---

## Colour

### Light (`html[data-theme="light"]`)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#f1e6d2` | Page parchment |
| `--bg-elevated` | `#fff8ea` | Cards, open mobile nav drawer, inputs |
| `--bg-inset` | `#e8dcc6` | Recessed wells |
| `--fg` | `#1c1710` | Body, nav links in light drawer |
| `--fg-muted` | `#5a5248` | Secondary |
| `--fg-subtle` | `#5f564c` | Meta (WCAG AA floor) |
| `--felt` | `#1f4a38` | Primary actions, brand green |
| `--felt-deep` | `#163528` | Pressed / hover deep |
| `--felt-fg` | `#f4ead8` | Text on felt buttons |
| `--tile` | `#f4e2b4` | Scrabble-like tile face |
| `--tile-edge` | `#c4a574` | Tile lip |
| `--tile-ink` | `#1c1710` | Letter on tile |
| `--bingo` | `#6b3e22` | Bingo / high-score accent |
| `--danger` | `#7a2e24` | Errors only |
| Stage cream | `#f6ecda` | Dark-theme text only — **never** on light panels |

### Dark (`html[data-theme="dark"]`)

Ink on stage: `#f6ecda` / `#f3eadc`. Muted: `#b5a790`. Cards: `#241f1b`. Borders: cream at 22–36% mix. Focus ring: `#7dcea0`. Best play card stays readable dark wood, not neon.

### Hard rules

- Light open **Menu** drawer: dark text `#1c1710` on `#fff8ea`. Never cinematic cream `#f6ecda` on parchment.
- Dark open Menu: cream `#f6ecda` on near-black `#171410`.
- Do not introduce a second green, a blue link colour, or Inter/Roboto as brand type.
- Ad regions use the same tokens. Label them “Advertisement”. No flashy networks skins.

---

## Type

- Display / titles / best word: **Fraunces** (`opsz` 9–144, weights 560 / 640, italic 480). Tracking `-0.03em`. Tight leading `1.08`.
- UI / body: **Source Sans 3** 400 / 600 / 700. Body size `1.0625rem`, line `1.6`.
- Mono: system ui-monospace only for raw letter strings if needed.
- Load: Google Fonts CSS already on the page. Do not swap to variable-font CDNs that change metrics.

Scale:

- Display H1: `clamp(1.9rem, 1.25rem + 2vw, 3.4rem)` — on mobile results-first, shrink stage title.
- Best word: Fraunces, large, sentence case as played (`jazzy` not `JAZZY` in the card unless the tile style demands caps).
- Labels: 0.68–0.78rem, letter-spacing `0.16em`, uppercase sparingly (kickers only).

---

## Shape, space, motion

- Radii: 4 / 8 / 12 / 18 / 26. Buttons often pill (`999px`) for Theme / Menu / primary Find words.
- Space: 4–8–12–16–24–32–48–72.
- Wrap: `min(920px, calc(100% - 32px))`.
- Shadow: hairline + long soft drop. No material-elevation stacks.
- Ease: `cubic-bezier(0.23, 1, 0.32, 1)`. Press 160ms. No bounce. Respect `prefers-reduced-motion`.
- Stage photo stays; do not replace with a CSS-only gradient “to save weight” on homepage.

---

## Components

**Brand mark** — Small cream tile with a serif **W** and subscript 4 (as in W₄). Do not invent a new logo.

**Primary button** — Felt `#1f4a38`, cream label, full-width on mobile in the panel, min-height 44–48px. Copy: “Find words”.

**Ghost / Share / Copy** — On stage: cream text, hairline cream border, dark glass fill. Off stage in light UI: ink text, 28% ink border.

**Mode chips** — Unselected: cream/muted on glass. Selected: `#f3e2b8` fill, ink text.

**Length chips** — Same. Hover invert to tile cream + ink.

**Best play** — Elevated parchment card. Label “Best play”. Word in Fraunces. Meta: points · letters. Definition line muted.

**Word tiles** — Light: `#fff8ea` + ink. Dark: `#241f1b` + cream. Min-height 48px on mobile results.

**Inputs** — Large, single field, placeholder like `LISTEN OR A?PPLE`. Light theme border ≥ 32% ink mix (WCAG). Caret colour felt.

**Mobile nav** — Full-width drawer under header when Menu → Close. One link per row, 44px, divider hairlines. Current page: felt underline + weight 700.

**Consent** — Fixed bottom, compact, z-index 100, max ~360px desktop centered; edge-to-edge inset on ≤720px. Dark glass even in light theme is allowed for this bar only.

**Ads** — After results, dashed separator, `min-height: 90px` slot. Hidden until results exist. `data-ad-client="ca-pub-2666058844257008"`.

---

## Layout recipes

### Homepage / tool

1. Header  
2. Stage (photo + lede + panel with letters + Find words)  
3. Status (count + best + Share/Copy) — **not sticky on ≤720px**  
4. Length chips  
5. Best play  
6. Word list  
7. Ad after results  
8. Prose / FAQ  
9. Footer  

On `body.has-results` + mobile: hide `.stage-copy`. Tool stays first.

### Content / list pages

Same chrome. No empty cinematic hero if the page is a dictionary list — still use felt/parchment tokens.

---

## Do

- Keep the wooden table in both themes.
- Prefer one accent (felt) + one warm paper + one tile gold.
- Write unique 150–300 word intros on tool pages. No doorway clones.
- en-GB spelling (colour, organised, favourite only if you must; prefer plain).
- 44px targets, `:focus-visible` 2px felt (light) / `#7dcea0` (dark).

## Don’t

- Inter, Roboto, Poppins, “AI indigo”, glassmorphism everywhere, 3D mascots.
- Sticky toolbars that cover length chips on mobile (already fixed once — do not regress).
- Cream text on cream menus.
- Ads over the letter field or Best play.
- Public X identity on the site.
- Thin mass `/unscramble/*` pages without unique prose.
- Placeholder `index.html` stubs on `main`.

---

## Verification (taste check)

A frame is on-brand if:

1. You can still see wood/felt behind the glass.  
2. Find words is the only loud control.  
3. Light menu links are as dark as body text.  
4. Best play looks like a physical card on a table, not a dashboard KPI.  
5. A colour-blind user can still find the primary button (shape + label, not colour alone).

If a mock fails any one of those, reject it and restyle from this file — do not “spice it up.”
