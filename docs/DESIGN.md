# DESIGN.md — Behind CG

Design system for the Behind CG website (3D product visualization studio). Format follows the Google Stitch DESIGN.md structure used by awesome-design-md. Agents building any Behind CG surface read this file first.

---

## 1. Visual Theme & Atmosphere
- **Mood:** a dark product studio. Ink-black teal grounds, one soft key light, the product as the brightest thing on screen. Calm, precise, premium.
- **Why dark:** the work is lit 3D renders; they read best on a dark, low-reflectance ground (the brief also asks for a dark-led site). Light sections (White, Mist) are used for commerce and reading blocks so the rhythm alternates.
- **Density:** generous. One idea per section; the hero stands alone on the first screen.
- **Philosophy:** the work leads, the interface recedes. Colour is reserved for actions (Orange) and brand signals (Teal).

## 2. Color Palette & Roles

### Brand
| Token | Hex | Role |
|---|---|---|
| `teal-600` Deep Teal | `#008484` | Brand primary: brand band, fills, icons on light |
| `teal-400` Bright Teal | `#0EC1B3` | Accent on dark: links, focus ring, highlights, progress |
| `teal-700` Deep Teal text | `#006B6B` | Small teal text on White/Mist (AA safe) |
| `teal-300` | `#5FD9CF` | Bright Teal hover |
| `orange-500` | `#FF8F3B` | Primary CTA only |
| `orange-600` | `#F27A1F` | Primary CTA hover |

### Neutrals
| Token | Hex | Role |
|---|---|---|
| `ink-900` | `#061617` | Page ground (dark) |
| `ink-800` | `#0B2527` | Dark surface, cards, inputs |
| `ink-700` | `#12363A` | Raised surface, subtle borders |
| `ink-600` | `#1E4A4F` | Strong borders on dark |
| `ink-500` | `#4E6A6B` | Secondary text on light (5.8:1 on White) |
| `ink-400` | `#7C9897` | Tertiary/meta text on dark |
| `muted` | `#9DB4B3` | Secondary text on dark (8.5:1 on Ink 900) |
| `white` | `#FFFFFF` | Light ground, text on dark |
| `mist` | `#F3F8F8` | Light surface |
| `mist-200` / `mist-300` | `#E2EDED` / `#C9DCDB` | Borders on light |

### Contrast rules (hard)
- Text on Orange and Bright Teal is **Ink 900**, never white.
- On dark grounds, teal text/links are **Bright Teal**, never Deep Teal (4.1:1 fails).
- White on Deep Teal is 4.53:1: allowed for text ≥ 16px on the brand band.
- Secondary text on a coloured surface is tinted from that surface or the foreground, never a neutral grey.

### Themes
Both token sets exist (Figma collection **Theme**, `dark/*` and `light/*`), mapping one semantic name to two values, e.g. `bg/canvas` = Ink 900 / White, `text/primary` = White / Ink 900, `text/link` = Bright Teal / Deep Teal text, `action/primary/bg` = Orange in both.

## 3. Typography Rules
- **Display/headings (h1–h4, prices, step numbers, marquee):** Montserrat 700–800, Google Fonts. It matches the BEHIND lettering in the logo. Tracking −1% to −2.5% on large sizes. Italic (Bright Teal) may mark one word in the home hero.
- **Utility (technical text):** JetBrains Mono 500–600 for durations, timecodes, dates, read times, category labels, badges, breadcrumbs, footer headings, table headers, step numbers and code. Never for headings or running text.
- **Body/UI, h5, buttons:** Raleway 400–700. Body sets `font-variant-numeric: lining-nums`, because Raleway's default old-style figures look wrong in prices, dates and durations.
- Chosen by the owner on 2026-11-08, replacing Instrument Serif + Geist (and the original Space Grotesk + Inter).

| Style | Desktop | Mobile | Use |
|---|---|---|---|
| H1 | 60/66 Montserrat 800 | 38/44 | One per page |
| H2 | 42/50 Montserrat 700 | 30/36 | Section headings |
| H3 | 28/36 Montserrat 700 | 24/30 | Sub-sections, feature blocks |
| H4 | 20/28 Montserrat 700 | 20/28 | Card titles |
| H5 | 16/22 Raleway 700 | 16/22 | Small titles, nav groups |
| Lead | 20/30 | 16/26 | Hero and section sub-lines |
| Body | 18/28 | 16/26 | Paragraphs, measure 60–70ch |
| Body M | 16/24 | 16/24 | Card text |
| Small | 14/20 | 14/20 | Labels, legal |
| Meta | 13/18 JetBrains Mono 500 | 13/18 | Durations, dates, read time |
| Label/Badge | 11/16 JetBrains Mono 600, uppercase, +6–10% | | Badges, category labels |

- **Eyebrow labels above headings are not used.** The heading carries the section. Uppercase tracked labels appear only as card categories (Tutorial, Packaging) and breadcrumbs.
- Numerals in prices, durations and timecodes use `font-variant-numeric: tabular-nums`.
- Headings follow h1 → h2 → h3 with no skipped levels.

## 4. Component Stylings
- **Buttons (48px, radius 8):** Primary = Orange fill, Ink 900 label. Secondary = 1.5px Bright Teal outline + label on dark (Deep Teal text step on light); hover fills it. Ghost = text + arrow; hover draws an underline and moves the arrow 4px. Max two actions in a hero. Labels: verb + object.
- **States:** hover steps (−1px), press scales to 0.98, focus = 2px ring with a 2px ground-coloured gap, disabled = 8% white fill / muted label.
- **Cards (radius 12):** declare elevation once. On dark: Ink 800 + 1px Ink 700 border, hover = Bright Teal border + 2px lift (no shadow). On light: white, soft shadow only (no border), hover = deeper shadow + 2px lift. Never nest cards.
- **Image frames:** media fills its frame edge to edge; on hover the image scales 1.03 inside the frame. **No captions or labels on images.**
- **Inputs (52px, radius 8):** label always visible above; placeholder shows an example; error text names the problem and the fix.
- **Navigation:** one opaque sticky bar (80px, Ink 900 at 92%, 1px bottom border): logo, Work ▾, Services ▾ (mega menu), Products ▾, Learn ▾, Membership, About; right: Member Login + Get a Quote. Collapses to logo + menu button under 1024px.
- **Badges:** pill, 24px, uppercase 11px. Orange = New, Teal = availability, Brand-tint = compatibility, Outline = level.
- **Filter tabs:** 44px pills; selected = Bright Teal fill + Ink 900 label; `aria-pressed`.
- **Video frame:** 16:9, radius 16, Orange 88px play button, controls bar on a 60% Ink scrim, Bright Teal progress.

## 5. Layout Principles
- **Grid:** 12 columns, 1280 max content width, 24px gutter, 80px side margins at 1440 (32 at 768, 20 at 390).
- **Spacing:** 8pt scale (4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128, 160). Section padding 120 desktop / 64 mobile. More space above a heading than below it.
- **Rhythm:** alternate dark and light grounds; after two visual-heavy sections, place a calmer one.
- **Hero:** alone on the first screen; the work (render or reel) is the hero, copy is left-aligned over its dark side.
- **Equal edges:** every block sits on the content edges; nothing pokes out on one side.

## 6. Depth & Elevation
| Level | Use | Value |
|---|---|---|
| 0 | Page, sections | none |
| 1 | Light cards | `0 1px 2px rgba(6,22,23,.06), 0 8px 24px -8px rgba(6,22,23,.10)` |
| 2 | Light card hover | `0 2px 4px rgba(6,22,23,.06), 0 24px 48px -12px rgba(6,22,23,.18)` |
| Dark | Dark cards | border only (Ink 700 → Bright Teal on hover) |
| Focus | All controls | `0 0 0 2px <ground>, 0 0 0 4px <teal>` |
No glows, no zero-offset coloured halos, no glassmorphism, no gradient text.

## 7. Do's and Don'ts
**Do**
- Show the real work big; one different render per section.
- Write headings that name things; keep sub-lines to 1–2 sentences.
- Keep one primary action per view, worded the same everywhere.
- Theme browser surfaces: selection (Bright Teal / Ink), caret, scrollbars, underline offset.
- Use one authored motion moment per page; everything else is quiet hover feedback.

**Don't**
- Eyebrow kickers above headings, numbered section markers (01/02) unless it is a real sequence like the process.
- Identical icon-tile card grids as page structure; check-icon feature lists; hero stat strips.
- Captions, ratio labels or "placeholder" text on images in production.
- Invented testimonials, client logos, ratings, numbers or prices.
- Gradient washes, glows, stripes, grid backgrounds, decorative blur.
- Violet/lavender anywhere.

## 8. Responsive Behavior
| Breakpoint | Changes |
|---|---|
| ≥ 1280 | Full 12-col layout |
| 1024–1279 | Same layout, fluid columns |
| 720–1023 | Nav collapses; 3-col grids → 2; masonry 2 cols; feature rows stack |
| < 720 | Single column; H1 40/44, H2 32/38; buttons full width; footer stacks |
- Touch targets ≥ 44px. Images stack after their text on phones (except the hero, where the work leads).

## 9. Agent Prompt Guide
- **Quick palette:** ground `#061617`, surface `#0B2527`, border `#12363A`, text `#FFFFFF`, secondary `#9DB4B3`, accent `#0EC1B3`, CTA `#FF8F3B` (label `#061617`), brand band `#008484`.
- **Prompt:** "Build a Behind CG page using DESIGN.md: dark studio ground, Montserrat headings (700–800) and Raleway body, Orange primary CTA with Ink label, Bright Teal links on dark, renders as the hero, no eyebrows, no captions on images, verb-plus-object buttons, cards with a single elevation, 12-col 1280 grid."
