# Motion 3D — “The drawing set in depth”

Status: implementation plan and storyboard for the scroll-driven 3D layer.
Phase 1 (engine + S5 process + S1 hero) is built first. Phase 2 (S3, S2, S4, S7, S6,
S9) follows after owner review as requested in the brief.

Design constraint: this is a technical drawing in space, not a game, product demo or
particle show. Flat shading, ink edges, paper fog, copper for energy, approved green
only for approved/energised states.

---

## 1. Motion tokens

| Token | Value | Use |
|---|---|---|
| `xs` | 160 ms | Hover, focus, small state changes |
| `s` | 240 ms | Accordion icon, stamp press |
| `m` | 400 ms | Gate re-layout, sheet lift, route change |
| `l` | 700 ms | Section rule, heading line, sheet unfold |
| `xl` | 1200 ms | Hero line draw, process cable draw |
| Standard easing | `cubic-bezier(.2,.7,.2,1)` | UI state |
| Emphasised easing | `cubic-bezier(.16,1,.3,1)` | Sheets, gates, stamps |
| Scrub | linear (ScrollTrigger `scrub: 0.6`) | Scroll-linked camera and cable |
| Stagger | 40–60 ms | Node rise, gate energise, rails |
| Amplitude | small, slow | One attention-grabbing animation per viewport |

All values are mirrored in `design/prototypes/assets/motion/motion.css` as
`--motion-xs` … `--motion-xl` and the two easing tokens.

---

## 2. Tier ladder

| Tier | When | What runs | Content state |
|---|---|---|---|
| **T0** | No JS, `prefers-reduced-motion: reduce`, `saveData`, `?motion=off`, user chooses Reduced | Nothing. Existing site.js does not animate. | Complete static page, existing SVG schematic, instant accordions. |
| **T1** | Motion allowed but only CSS/SVG is safe (bundle not loaded, very low hardware, test flag `?motion=t1`) | Existing CSS line draws, reveals, accordions, section rules. | Complete static page, no canvas, no GSAP. |
| **T2** | Phones/tablets, coarse pointer, width < 1024, no WebGL2, low core/memory, or T3 probe fails. Default on mobile. | CSS 3D transforms + GSAP ScrollTrigger. Hero drawing panel tilts/translates in Z; process becomes a vertical SVG cable with CSS 3D stage rows and sheet unfold. | Complete static page. No canvas. |
| **T3** | WebGL2, no reduced motion, viewport ≥ 1024 px, fine pointer, `hardwareConcurrency ≥ 4`, `deviceMemory ≥ 4` where exposed, not `saveData`, 500 ms frame probe mean < 18 ms. `?motion=full` bypasses hardware/width checks but still respects reduced motion. | One fixed WebGL2 stage, lazy-loaded OGL scenes, GSAP ScrollTrigger clock. | Complete static page; canvas is decorative and `aria-hidden`. Scene text stays DOM. |

Tier gate lives in an inline HTML script (before first paint for the `motion-ok` class,
after parse for the probe). It logs `{tier, reason, meanFrameMs}` to the console,
`window.__motionTier`, and `document.documentElement.dataset.motionTier`. A RUM hook is
a one-line replacement point in `design/motion/src/boot-log.js`; no analytics endpoint
is invented in the prototype.

### Feature flags

`?motion=off` → T0, no bundle.
`?motion=css` → T2, bundle loaded (for review without WebGL).
`?motion=full` → T3 if WebGL2 is available, otherwise T2; reduced motion still wins.
`?motion=t1` → T1 test alias, no bundle.

The visible control is `Motion: Full` / `Motion: Reduced`. It writes
`localStorage["dewa-motion"]` and reloads into the chosen state. It is a pause control
for the only auto-playing motion (the hero pulse), which is capped at two cycles.

---

## 3. Engine architecture

```
one <canvas id="motion-stage"> fixed, aria-hidden, pointer-events:none, z-index:0
one <div id="motion-labels"> fixed, aria-hidden, z-index:1
main { position:relative; z-index:2 }   ← all text above the canvas
canvases clip to the active scene viewport (hero panel / process visual)
```

- Renderer: OGL `Renderer` (WebGL2), DPR clamped to `min(devicePixelRatio, 1.75)`.
- Camera: perspective, FOV 26° (24–30° range), near 0.1, far 200. An off-centre
  projection maps the scene into the active DOM panel while keeping full-canvas
  rendering.
- Scene manager API:

```js
registerScene({
  id, sectionEl,
  build(),          // create geometries/programs, labels
  enter(),          // active in viewport
  exit(),           // no longer active
  update(progress, time, dt),
  dispose(),        // 3 viewports away
  getViewportRect(),// DOM rect the scene projects into
  continuous        // true only when idle drift needs a loop
})
```

- Lazy-build when the section is within 1.5 viewports (`IntersectionObserver`,
  `rootMargin: 150% 0px`). Dispose when 3 viewports away (`rootMargin: 300% 0px`).
- Shared geometries for repeated station boards; merged fat-line geometry for all
  edges of a node; InstancedMesh only if a future scene needs repeated identical parts.
- No textures. No model downloads. No post-processing. No bloom, glow, gradients,
  particles, PBR or environment maps.
- Render on demand. The only continuous loop is the hero idle drift at ~30 fps while
  the hero is active. Stop on `visibilitychange`, offscreen, and when the tab is
  hidden. Handle `webglcontextlost` (show T2 fallback, prevent default) and
  `webglcontextrestored` (rebuild scenes on next enter).
- Dispose all geometries (`Geometry.remove()`), programs (`Program.remove()`) and
  labels on scene disposal. Max 80 draw calls and ~4,000 line segments per scene.

### Camera rig

- One Catmull-Rom curve per scene. `progress` from ScrollTrigger (scrub 0.6) is
  damped toward the scroll target with `lerp 0.1`; camera position is damped again
  with `lerp 0.1`. Look-at target is a second curve (or a point ahead on the same
  curve).
- Keyboard and anchor jumps (`#process`, `#pathfinder`, `#quote`) never bypass the
  rig: ScrollTrigger updates the same progress value, so the camera catches up.
- Pointer parallax is ±3° at T3 desktop only, damped, and disabled when reduced.

### Labels

- Labels are real DOM text in `#motion-labels`, projected from 3D world coordinates
  every frame with the active camera. They are `aria-hidden` to avoid duplicating the
  accessible SVG/heading text, but remain selectable, translatable and crawlable.
- Each label has an opaque paper chip (`background: var(--paper)`, 1 px hairline) so
  small text never sits directly on linework.
- Hero label set: DEWA LV NETWORK, CT METER, MDB, BUSBAR, SMDB-01, SMDB-02, EARTH,
  SCALE NTS. They are the same words as the SVG, not new copy.

### Title-block HUD

- Existing top title block updates its Sheet value by section. Existing
  `.sheet-indicator` updates `SHT NN / 09`. Footer title block mirrors the Sheet.
- Mapping: A-101, R-201, A-201, P-301, W-601, C-601, L-701, Q-801, E-901.
- Pure DOM text. No canvas text.

---

## 4. Scene storyboards

### S1 / SHT 01 — Hero “Typical LV fit-out route”

**Scroll range.** Hero section (`#hero`), `start: top top`, `end: bottom top`, scrub
0.6. Approximately the first viewport. Not pinned.

**Camera spline.**
`[(0,14,3) → (4,11,9) → (8,8,12) → (9,7,13)]`, look-at `(0,0,0)`.
Top-down plan at progress 0, isometric 3/4 at progress 1. Pointer parallax ±3° and a
0.01 rad idle drift at T3 desktop only.

**Build.**
Base plane at `y = -4.5` with a hairline grid fading with distance (paper fog).
Extruded paper boxes with ink edges for DEWA LV NETWORK, CT METER, MDB, BUSBAR,
SMDB-01, SMDB-02 and EARTH. Copper fat lines (2.5 px) for conduit. A small copper
diamond marker travels the conduit as the energy pulse. No spheres, no glow.

**Timings.**
Nodes rise with a 40 ms stagger, 500 ms each, `power2.out`.
Pulse path 1: network → CT meter → MDB → busbar, 600 ms.
Pulse path 2: busbar → SMDB-01, 400 ms.
Pulse path 3: busbar → SMDB-02 → earth, 500 ms.
Two cycles, 400 ms repeat delay, then stop. Final energised node edges fade to approved
green once. Total auto-playing motion < 5 s.

**Proxy/T0–T2.**
The existing SVG schematic remains the poster and fallback. T2 tilts the whole
drawing panel with CSS 3D (`perspective`, `rotateX/Y`, `translateZ`) driven by the same
ScrollTrigger; the SVG stays visible. T1/T0 keep the static SVG and its 1.2 s line
draw.

**Labels.** DOM chips projected from 3D positions; the SVG title/desc stays for
assistive technology.

**Content guardrails.** The “Illustrative only / not a construction drawing” note,
`[VERIFY]` premise text and the “Design proof” stamp remain visible.

---

### S5 / SHT 05 — Process “The cable run is the project file” (signature scene)

**Scroll range.** `#process` is 460 vh on T3 desktop. A sticky `.process-pin` holds
the stage and the six DOM steps. `start: top top`, `end: bottom bottom`, scrub 0.6.
Scroll distance ≈ 360 vh. No ScrollTrigger pin (CSS sticky avoids iOS address-bar
jumps). No pin on mobile/T2.

**Layout.**
`.process-pin` = flexible `.process-visual` (3D stage) above the existing
`ol.process` six-step list on an opaque paper panel. The list stays in DOM order and
stays keyboard reachable while the section is sticky. A visible “Skip animation”
button scrolls to the end of the run. A `Stage 03 / 06` counter is pure DOM.

**Camera spline.**
Station curve through six 3D positions:
`(-8,0,0) (-4.5,1.2,-1.5) (-1,-0.5,1.5) (2.5,1,-1) (6,-0.4,1.2) (9.5,0.6,0)`.
Camera curve above/front of the run: `(-12,5,9) (-8,4,8) (-4.5,4,8) (-1,4,8)
(2.5,4,8) (6,4,8) (11,5,9)`, look-at the station curve 8% ahead, y +0.5. Damped.

**Build.**
Six station boards (paper faces, ink edges), one output sheet per station (thin paper
box with ink edges) on a pivot that unfolds as the camera arrives. One merged copper
cable (fat line, 2.5 px) along the station curve, revealed by a `uReveal` uniform.
A copper revision cloud at stage 04 fades out as the file resolves; three approved-green
check marks at stage 05 fade in; a green edge overlay on the final board fades in at
stage 06. A meter dial (ring + needle) rotates once at the final station. A small
copper tab marks the active station. No glow, no particles.

**Timings.**
Output sheet unfold: 700 ms equivalent, driven by progress over 18% of the run.
Revision cloud resolves between progress 0.70 and 0.78.
Inspection checks fade in between 0.80 and 0.88.
Meter needle rotates between 0.90 and 1.00; final node green at 0.95.
Active step highlight is instant on progress change; the step list is not animated.

**Content guardrails.**
The six existing headings, owner/output `<dl>` blocks, section copy and SHT meta are
unchanged. The DOM list is the source of truth; the 3D is an echo. “Skip animation”
is visible whenever the pinned stage is active.

**Proxy/T2.** Vertical timeline. The cable is an SVG stroke drawn with
`stroke-dashoffset` on scroll; each stage row lifts with a small CSS 3D
`rotateX/translateZ` unfold. No sticky, no canvas, no hidden text.

---

### S3 / SHT 03 — Service register “Twelve approval sheets” (Phase 2)

- 12 sheets in a stack on a base plane; S-01 at the front. Sticky (not pinned) visual
  beside the existing `<details>` table.
- Scroll fans the stack by 12° with `rotateY` and `translateZ`.
- Hover/focus on a row lifts its sheet 400 ms and draws that service’s mini schematic
  with a 500 ms stroke draw. The table remains the accessible source.
- T2: CSS 3D fan of 12 stacked divs; no canvas.

### S4 / SHT 04 — Project-type matrix rails (Phase 2)

- For each of the eight rows, a 3D rail of five numbered nodes
  (01 Landlord NOC … 05 Civil Defence) energises in order on row entry, 60 ms stagger.
- Table text, column order and links unchanged. Adjacent approvals stay visually
  distinct from DEWA scopes.
- T2: CSS rail underline/stagger inside the table cell.

### S2 / SHT 02 — Pathfinder echo (Phase 2)

- The three DOM selects remain the only input. The stage shows three gates on a 3D
  cable path: Landlord/developer consent → DEWA fit-out electrical approval → LV
  inspection + meter release.
- Building a route re-lays the gates in 400 ms and pulse-runs the sequence. The 3D is
  an echo of the DOM result, never the source of truth. No input depends on WebGL.
- T2: CSS gate rows with a drawn SVG connector.

### S7 / SHT 07 — Coverage busbar (Phase 2)

- Ten areas become nodes on a 3D busbar. Scroll pans the camera along it; hover/focus
  raises a node and shows its label. Each node remains a real link to `#quote`.
- Touch/T2: the ordinary two-column list, unchanged.

### S6 / SHT 06 — Proof layers (Phase 2)

- The redacted drawing slot becomes three layers (plan, loads, SLD) separated along Z.
  Scroll explodes then merges them; a drag/keyboard slider scrubs the same state.
- Keep “Redacted / not for construction” and all `[verify]` facts. No fabricated
  project content. T2: a simple before/after overlay.

### S9 / SHT 09 — Enquiry + footer close (Phase 2)

- Camera pulls back to reveal the whole drawing set. A thin CSS/SVG stamp presses once
  as the form enters view. The form, upload, consent and Turnstile area stay 2D,
  unobstructed and in the document flow.
- The closing stamp is not WebGL.

### S8 / SHT 08 — FAQ (all tiers)

- No 3D behind the text. Only the existing `<details>` accordion
  (`grid-template-rows: 0fr → 1fr`), deep links and search. Keep “Draft / source
  verification pending” labels.

---

## 5. Micro-interactions (small set, one per viewport)

- Title-block hairlines draw on first paint (CSS, 700 ms).
- Heading line reveal via a CSS `::after` underline; the heading text is never split
  into spans that change its accessible name.
- Section rules extend on entry.
- Link underline draws on hover/focus.
- Primary CTA offset 2 px on hover.
- Optional drafting crosshair cursor at T3 desktop only, with a section label.
- No marquees, parallax text, cursor trails, sound or preloader.

---

## 6. Performance budgets and ladder

| Metric | Budget |
|---|---|
| LCP | < 2.0 s; LCP element is the static hero, never the canvas |
| INP | < 200 ms |
| CLS | < 0.05; stage uses `aspect-ratio`/`min-height` reserve |
| Initial JS | < 170 KB gz |
| Motion + WebGL code | < 150 KB gz, lazy-loaded after load + idle |
| Long tasks | none > 50 ms |
| Desktop T3 | 60 fps |
| Draw calls | ≤ 80 per scene |
| Line segments | ≤ 4,000 per scene |
| DPR | `min(devicePixelRatio, 1.75)` |

Frame-time ladder: if the mean frame time is > 20 ms over 60 frames, reduce DPR by
25%, then disable the idle drift/parallax, then switch the session to T2. The ladder is
logged with the tier reason.

---

## 7. Accessibility and SEO safety

- All content present in static HTML at load. Canvas `aria-hidden` and
  `role="presentation"`. Labels are DOM text.
- No focus trap. Visible focus rings. No flashing > 3/s.
- `prefers-reduced-motion`, `saveData`, no-JS and the on-page toggle all resolve to the
  static state.
- Arabic/RTL mirrors CSS transforms and timelines; scene layouts use logical
  positioning for labels where direction matters.
- Headings, FAQ text, links, `[verify]` and “pending” labels are never hidden or
  delayed by the motion layer.
- `robots noindex` is added to the prototype pages on the `vercel.app` host. The
  canonical/OG host is reported in `MOTION_AUDIT.md` and unchanged. Remove the
  noindex only when the canonical host serves the same page.

---

## 8. Asset list

None. All geometry is procedural: boxes, merged fat-line segments, grids and rings.
No textures, models, images, video or sound.

---

## 9. Review artefacts and tests

- `docs/MOTION_AUDIT.md` — before state.
- `docs/MOTION_3D.md` — this storyboard.
- `docs/MOTION_PERFORMANCE.md` — before/after metrics, after the build.
- `tests/motion.spec.js` — forced tiers, no-JS, reduced motion, WebGL disabled,
  context loss, axe, keyboard path through S5.
- `playwright.config.js` — Chromium (system Chrome channel), mobile and desktop
  projects.
- `lighthouserc.cjs` — mobile budgets for home and FAQ with and without WebGL.
- `design/prototypes/screenshots/motion/` — stills and WebM captures per scene/tier.
