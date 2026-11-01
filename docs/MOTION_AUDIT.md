# Motion audit — DEWA approvals drawing-sheet prototype

Status: Phase 0 audit for the 3D scroll-motion upgrade.
Audited: 1 November 2026.
Scope: `design/prototypes/` (home, service, project-type and FAQ prototypes) and the
Vercel deployment at `https://dewa-approvals-dubai.vercel.app/`.

This document records what exists before the motion layer. It is deliberately
read-only: the issues in section 5 are reported, not silently changed.

---

## 1. Stack and delivery

| Item | Finding |
|---|---|
| Framework | None. Static HTML prototypes under `design/prototypes/`. No Astro, React, Next or build step. |
| HTML entry | `design/prototypes/index.html` (home), `faq.html`, `services/fit-out-electrical-approval.html`, `project-types/commercial-fit-out.html`. |
| CSS | One hand-written stylesheet: `assets/site.css` (3,001 lines, 52 KB). `@import url("./fonts.css")` at the top. Fonts are self-hosted WOFF2. |
| JavaScript | One deferred classic script: `assets/site.js` (196 lines, 7.9 KB). No modules, no bundler, no framework. |
| Asset loading | `site.css` and `fonts.css` are render-blocking stylesheets. `site.js` is `defer`. Eight WOFF2 files are requested by the CSS. |
| Deployment | Vercel, `framework: null`, `buildCommand` is `echo 'Static site ready'`, `outputDirectory: "."`. `vercel.json` rewrites `/assets/*` to `/design/prototypes/assets/*` and redirects the old prototype aliases to the home anchors. |
| Server | Local review uses the root `server.js` (zero-dependency Node static server, no compression). Production is served by Vercel with Brotli. |
| Motion libraries | None. All current motion is CSS transitions/animations plus two `IntersectionObserver` blocks in `site.js`. |

There is no app scaffold, no TypeScript, no test suite and no Lighthouse CI for the
prototype. `docs/TECH_RULES.md` describes the intended Next.js production stack, but
that stack is not present in this repository.

### Consequences for the motion upgrade

- The motion layer must be additive to static HTML. No route, heading, section order,
  copy or form field may move.
- A client island must be introduced without converting the site to a framework.
  The approved approach is a lazy ES-module bundle (`assets/motion/motion.js`) loaded
  after `load` + idle, with an inline tier gate in the HTML.
- The existing SVG schematic in the hero is the LCP poster and the T0–T2 fallback.
  It must stay in the DOM at first paint.
- The initial page must remain usable with JavaScript disabled. The current page
  already is; the motion layer must not introduce hidden-by-default content.

---

## 2. Existing animation and interaction inventory

| # | Element | Trigger | Duration / easing | Properties | Cost / note |
|---|---|---|---|---|---|
| 1 | Hero SLD line draw (`.sld .draw`) | Page load (CSS animation) | 1.2 s, delay 0.25 s, `cubic-bezier(.2,.7,.2,1)`, one-shot | `stroke-dashoffset` (8 paths) | Cheap. Animates on the LCP SVG after first paint. |
| 2 | Drawing stamp “Design proof” | Static | None | — | No animation. |
| 3 | `[data-reveal]` blocks, `.section-rule`, `.process`, `.stamp` | IntersectionObserver (`site.js`), rootMargin `0 0 -12% 0`, threshold 0.15 | 700 ms, `--ease`; stagger 60–240 ms via `data-reveal-delay` | `opacity`, `translateY(12px)`, `scaleX` | Cheap. Only elements present on the page are observed. The home currently has no `[data-reveal]` or `.section-rule` elements; the observer mostly acts on `.process` and `.stamp`. |
| 4 | Process cable rule (`.process::after`) | `.process` enters viewport | 1.2 s, `--ease` | `transform: scaleX(0 → 1)` | Cheap. Desktop only; the rule is hidden at `max-width: 1100px`. |
| 5 | Process stage diamonds (`.step::before`) | `.process` enters viewport | 420 ms, `--ease`; 160 ms + 120 ms stagger per step | `background`, `border-color` | Cheap. Seven timeouts created once. |
| 6 | Proof stamp press (`.stamp.is-pressed`) | `.stamp` enters viewport | 240 ms, `--ease`, one-shot | `transform: rotate(-4deg) scale(1.12 → 1)` | Cheap. |
| 7 | Register accordions (`<details>`) | User click | 200 ms plus icon; body not height-animated | `transform: scaleY` on the plus icon | Native `<details>`; no height animation, so no layout jank. |
| 8 | FAQ accordions (`<details>`) | User click | 420 ms, `--ease` | `grid-template-rows: 0fr → 1fr` | Good pattern; no measured height. |
| 9 | Nav underline (`.nav-link::after`) | Hover / current page | 200 ms, `--ease` | `transform: scaleX` | Cheap. |
| 10 | Mega menu (`.has-mega:hover/focus-within`) | Hover / keyboard focus | 200 ms, `--ease` | `opacity`, `translateY(-6px → 0)`, `visibility` | Cheap. Keyboard reachable through `:focus-within`. |
| 11 | Buttons and links | Hover / focus | 200 ms, `--ease` | `background`, `color`, `border-color`, arrow `translateX(4px)` | Cheap. |
| 12 | Form field underline | Focus | 200 ms, `--ease` | `border-bottom-color` | Cheap. |
| 13 | Mobile nav | Button click | None (display change) | `display`, class state | No transition; `aria-expanded` updated. |
| 14 | Sheet indicator (`.sheet-indicator`) | IntersectionObserver on `[data-sheet]` | None | Text content `SHT NN / 09` | Cheap, but only updates the counter. The title-block Sheet value does **not** update today. |
| 15 | Smooth scrolling | `html { scroll-behavior: smooth }` | Browser default | Scroll position | Applies to anchor links. Reduced-motion media query disables it. |
| 16 | Body paper grain (`body::before`) | Static | None | Fixed SVG turbulence overlay, `opacity: .16` | Existing; not a motion cost. |
| 17 | Editorial hover backgrounds (table rows, register rows, area rows) | Hover | Instant | `background` | Cheap. |

### Existing motion tokens

`--ease: cubic-bezier(.2,.7,.2,1)`, `--dur-fast: 200ms`, `--dur-mid: 420ms`,
`--dur-slow: 700ms`. Reduced motion is already handled globally with a media query
that collapses animation and transition durations to `0.001ms`.

### Existing accessibility/behaviour notes that affect motion

- The only persistent scroll-linked animation is the process cable draw. It is
  one-shot, triggered by the section entering the viewport, not scrubbed.
- There is no pinned section, no scroll hijacking, no Lenis, no GSAP and no WebGL.
- `site.js` reorganises itself cleanly when `prefers-reduced-motion` matches: it
  applies the finished state immediately.
- The FAQ and register use native `<details>`, so keyboard and screen-reader
  behaviour are already correct and must not be replaced.

---

## 3. Baseline measurements

### 3.1 Production-like build (Vercel, mobile throttled)

Lighthouse 12.x, mobile default preset (simulated 4G, 4× CPU throttle), headless
Chrome, 1 November 2026. URL measured after the `/` → `/design/prototypes/` redirect.

| Metric | Baseline | Budget | Status |
|---|---:|---:|---|
| Performance score | **81** | ≥ 90 | Fail |
| Accessibility | **97** | ≥ 95 | Pass |
| Best Practices | **100** | ≥ 95 | Pass |
| SEO | **100** | 100 | Pass |
| First Contentful Paint | 1.8 s | — | — |
| Largest Contentful Paint | **1.8 s** | < 2.0 s | Pass (no headroom) |
| Total Blocking Time | **490 ms** | INP < 200 ms | At risk |
| Cumulative Layout Shift | **0.093** | < 0.05 | Fail |
| Speed Index | 4.7 s | — | — |
| Time to Interactive | 2.7 s | — | — |
| Total page weight | 233 KiB | — | — |
| Initial JS transfer | ~2.4 KiB (`site.js`) | < 170 KiB gz | Pass |
| Long tasks > 50 ms | 8 | 0 | Fail |
| Longest main-document task | 743 ms | < 50 ms | Fail |

The 743 ms main-document long task is attributed to the document URL, not to
`site.js` (which is ~2.4 KiB compressed). It is most likely parse/layout of the large
single-page HTML (59 KB, 912 lines, 12 register rows, 12 FAQ answers) under simulated
CPU throttling. It must be re-measured after the motion layer, because the stage and
lazy bundle must not add to it.

The LCP element is the static hero drawing panel / SVG region. It must remain the
static hero after the upgrade; the WebGL canvas must never become the LCP element.

### 3.2 Local uncompressed build

Same Lighthouse mobile preset against `node server.js` (no compression, `Cache-Control:
no-cache`). This is a worst case and is included for comparison only.

| Metric | Local baseline |
|---|---:|
| Performance | 66 |
| Accessibility | 97 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 3.2 s |
| TBT | 770 ms |
| CLS | 0.093 |
| Total weight | 327 KiB |

The delta is almost entirely compression and caching. Motion work must be measured
against the Vercel production baseline, not the local server.

### 3.3 Network and JS weight

- Home document: 13.4 KiB compressed on Vercel; 59.4 KiB raw locally.
- `site.css`: 11.1 KiB compressed on Vercel; 52.7 KiB raw locally.
- `site.js`: 2.4 KiB compressed on Vercel; 8.1 KiB raw locally.
- Fonts: seven WOFF2 files on the home view (IBM Plex Sans 400/500, IBM Plex Mono
  400/500, Barlow Condensed 600/700, IBM Plex Sans Arabic 400) totalling ~210 KiB.
- No images. One inline SVG favicon. One inline SVG noise overlay.
- Initial JS therefore passes the `initial JS < 170 KB gz` budget with a very large
  margin. The new motion bundle has room to be lazy without competing with content.

---

## 4. What the motion layer may reuse

- The existing `data-sheet="01"`…`"09"` attributes, section ids and DOM order.
- The existing hero SVG (`role="img"`, title + desc) as the T0/T1/T2 poster.
- The existing `.process` six-step list as the accessible S5 content.
- The existing `--paper`, `--paper-2`, `--ink`, `--hairline`, `--copper`,
  `--approved` tokens and the mono/display/body font stacks.
- The existing native `<details>` accordions (S8 must not get a 3D layer).
- The existing reduced-motion media query; the new tier gate must compose with it.

The motion layer must add:

- one fixed stage canvas (single WebGL context),
- a tier gate (T0–T3) with a visible `Motion: Full / Reduced` control,
- a live title-block HUD (Sheet value + SHT counter),
- lazy, disposal-safe scene registration,
- DOM/SVG labels projected from 3D coordinates,
- `?motion=off|css|full` review flags,
- Playwright/axe/Lighthouse QA that can force each tier.

---

## 5. Issues found during the audit (reported, not silently changed)

### 5.1 Canonical/OG host differs from the served host

`index.html` declares:

- `link rel="canonical" href="https://dewaapprovals.abbaditech.ae/"`
- `og:url` = `https://dewaapprovals.abbaditech.ae/`

The prototype is served from `https://dewa-approvals-dubai.vercel.app/`. With no
`noindex`, the prototype host is indexable while claiming a different canonical host.
**Recommendation:** add `noindex` to the prototype host now; keep exactly one canonical
host at launch and do not change canonical logic until the production host is live.
This audit does not change the canonical URLs.

### 5.2 Placeholder links

These links are placeholders and must stay visible until resolved:

- `#services`, `#quote`, `#ar` anchors in the utility bar, nav, footer and body copy.
- All eight project-type rows link to `project-types/commercial-fit-out.html`, not to
  distinct project-type pages.
- Legal links `#privacy`, `#terms`, `#cookies`, `#sitemap` are placeholders.
- The Arabic switch and `/ar/` mirror are not built.

The motion layer must not remove, hide or delay these links.

### 5.3 `[verify]` and “source verification pending” content

These must stay visible and must not be covered by the stage canvas:

- `PREMISE NO. / [VERIFY]` in the hero SVG.
- Phone, email and registrations in the footer.
- All four `[Verify]` case-file facts in S6.
- `Draft / source verification pending` in all eight FAQ answers.
- `Layout proof`, `Design proof`, `Redacted / not for construction` labels.
- The independence notice in the utility bar, enquiry section and footer.

The motion layer must never place small text directly over linework. Labels get an
opaque paper chip; section text stays on paper panels.

### 5.4 Baseline accessibility failures

Lighthouse reports two pre-existing failures:

1. **Colour contrast** — `--ink-52` (`rgba(16,24,32,.52)`) resolves to about `#7c7f7f`
   on paper, a 3.49:1 ratio. It is used for `.tb-label`, `.mono-note`, the matrix
   caption and several metadata spans. 8–10 px text needs 4.5:1. This is a content-wide
   token issue, not a motion issue. The motion layer will use `--ink` or `--ink-70` for
   new labels and controls; it will not silently change `--ink-52`.
2. **Label/content name mismatch** — the two brand links have
   `aria-label="Abbadi Tech home"` while their visible text is “Abbadi Tech / Utility
   approvals engineering”. The accessible name does not contain the visible label.
   Reported for the content/accessibility pass.

Baseline axe also flags the same contrast pair on `.tb-label` and `.mono-note`.

### 5.5 CLS and font swap

CLS 0.093 is above the 0.05 budget. `fonts.css` uses `font-display: swap` on eight
faces and the page has no preload for the hero-critical faces. The exact shifted
elements are not exposed by this Lighthouse run, but the pattern is consistent with
font-swap reflow in the title block, hero and process grid. This is a performance
task for the production build; the motion layer must not add layout shift when the
canvas or sticky process stage appears.

### 5.6 No prototype test/CI coverage

`.github/workflows/ci.yml` only checks for Gate A documents and runs npm scripts if a
lockfile exists. There are no Playwright, axe or Lighthouse checks for the prototypes.
The motion work adds these; the workflow is extended rather than replaced.

### 5.7 Pinned-scene risk on iOS Safari

No pinned scene exists today, so there is no current address-bar issue. The new S5
sticky process scene must be tested on iOS Safari; sticky positioning is used instead
of ScrollTrigger pinning to reduce the risk.

---

## 6. Assumptions for the upgrade

1. The prototype remains static HTML. The motion bundle is built with esbuild and
   committed so Vercel can serve it without a Node build step.
2. “Production-like” measurement means the Vercel deployment above. Local numbers are
   for regression triage only.
3. T3 is desktop-only. Phones and tablets default to T2 (CSS 3D + GSAP scroll) and
   never download the WebGL scene code unless the review flag forces it.
4. The hero SVG remains the LCP poster. The canvas is created after load + idle and is
   `aria-hidden`.
5. The title-block Sheet mapping used by the HUD is:

   | Section | Sheet |
   |---|---|
   | SHT 01 hero | A-101 |
   | SHT 02 pathfinder | R-201 |
   | SHT 03 service register | A-201 |
   | SHT 04 project matrix | P-301 |
   | SHT 05 process | W-601 |
   | SHT 06 proof | C-601 |
   | SHT 07 coverage | L-701 |
   | SHT 08 FAQ | Q-801 |
   | SHT 09 enquiry | E-901 |

6. The stage canvas sits behind `main` and in front of the body paper. Scene sections
   become transparent only under `html.motion-full`; all other sections keep their
   opaque paper/ink backgrounds so text never sits on linework.
