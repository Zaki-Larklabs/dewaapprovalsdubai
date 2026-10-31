# Design system: drawing sheet

Status: Gate A. The coded reference is `design/prototypes/`. The screenshots are in `design/prototypes/screenshots/`.

## 1. Concept

The site should feel like a well-controlled approval drawing set: paper, title blocks, sheet numbers, revision marks, hatching, cable runs, approval stamps and precise annotations.

It should not feel like a construction company, a software startup or an AI product. The visual argument is: **this consultant works from documents, not slogans**.

Three rules:

1. **The document is the interface.** Title blocks, sheet indices, revision tables, source notes and review dates are part of the design language.
2. **Precision over decoration.** Every line, number and label has a job. No ornamental gradients, blobs or floating cards.
3. **One accent, used sparingly.** Copper marks the live path, the changed state or the action. It is not a background wash.

## 2. Design tokens

### Colour

| Token | Value | Use |
|---|---|---|
| Paper | `#F2EEE6` | Primary background |
| Paper 2 | `#E9E3D7` | Alternate section background |
| Ink | `#101820` | Primary text, dark sections, primary buttons |
| Ink 70 | `rgba(16, 24, 32, 0.70)` | Secondary text |
| Ink 52 | `rgba(16, 24, 32, 0.52)` | Metadata |
| Hairline | `#CFC8BA` | Rules, borders |
| Hairline strong | `#B8AE9D` | Table and title-block rules |
| Copper | `#B5562B` | Fills, graphics, lines, stamps |
| Copper text | `#9A4520` | Copper-coloured text on paper |
| Approved green | `#2F6B4F` | “Approved” / verified status only |
| Paper on ink | `#F2EEE6` | Text on dark sections |

Do not use copper as a large background behind normal text. Do not use copper text on ink without checking contrast.

### Contrast checks

| Pair | Ratio | Use |
|---|---:|---|
| Ink on Paper | 15.46:1 | Body text |
| Copper text on Paper | 5.59:1 | Kickers, links, small labels |
| Approved green on Paper | 5.44:1 | Verified status |
| Paper on Copper | 4.19:1 | Large text only; avoid normal body text |
| Ink on Copper | 3.69:1 | Large text only; avoid normal body text |

Primary buttons use Ink background with Paper text. Secondary buttons use a hairline border on Paper with Ink text.

### Type

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display | Barlow Condensed | 600/700 | Uppercase, tight leading, short lines |
| Body | IBM Plex Sans | 400/500/600 | Long-form reading |
| Data / labels | IBM Plex Mono | 400/500 | Sheet numbers, metadata, status, source notes |
| Arabic | IBM Plex Sans Arabic | 400/600 | RTL mirror |

Display sizes use a fluid scale:

- H1: `clamp(3.4rem, 2.1rem + 5.4vw, 7.2rem)`
- H2: `clamp(2.65rem, 1.85rem + 3.4vw, 5rem)`
- H3: `clamp(2rem, 1.55rem + 2vw, 3.2rem)`
- H4: `clamp(1.22rem, 1.08rem + 0.6vw, 1.5rem)`

Headings are uppercase, line-height `0.94`, max 18–28ch. Body line-height is at least `1.6`. Paragraphs max 66ch.

### Grid and spacing

- 12-column grid with a max container of 1280px.
- Page gutter: `clamp(20px, 4vw, 56px)`.
- 8px base spacing scale.
- Section padding: `clamp(56px, 8vw, 104px)`.
- Sheet grid lines: 1px at low opacity, aligned to the 12-column grid.
- Tables and registers are full-width; do not box every row.

### Surfaces and lines

- Backgrounds are flat paper or ink. No glassmorphism.
- Borders are 1px hairlines. No heavy shadows except the mobile menu and the drawing panel.
- A dotted or hatched top rule marks a new sheet.
- Stamps are outlined, slightly rotated and labelled “DESIGN PROOF”, “DRAFT” or “VERIFIED”. Never use a fake approval stamp.

## 3. Components

### Title block header

- Utility bar: independence notice, location, enquiry link, Arabic switch.
- Main title block: brand, project, sheet, revision, date.
- Navigation: Home, Services, Project types, Process, FAQ, Quote.
- Desktop CTA: “Start a project file”.
- Mobile: brand and date, language switch, 44px menu button.

The title block is not decorative. It tells the visitor what this document is and when it was reviewed.

### Hero

- Left: kicker, H1, short subhead, primary and secondary actions, scope/document/review metadata.
- Right: a technical drawing panel with a single-line schematic, sheet number and “illustrative only” note.
- The drawing must be an SVG or a real project drawing. Do not use a stock photo of a handshake or a laptop.

### Approval pathfinder

Three inputs: property, activity, what is changing. The result is an ordered route with owner, output and document list. It is an example, not a quote or guarantee. In production, the result should be a crawlable URL with sourced conditions.

### Service register

A table-like list of 12 services. Each row has a sheet number, title, typical trigger, stage and an expandable short definition. The row opens to reveal scope, documents, adjacent approvals and a link to the full service page.

Do not use icon cards in a 3-up grid. The register is the visual differentiator.

### Project-type matrix

A dense table ranking approvals by dependency for each project type. The columns are project type, ranked sequence, typical load drivers and file link. Adjacent approvals are labelled as adjacent, not as DEWA scopes.

### Process cable run

Six stages on a horizontal cable run: scope and document audit, design and load schedule, landlord and authority submission, comment response, inspection readiness, energisation and handover. Each stage names the owner and the output. On mobile, the cable run becomes a vertical list.

### Proof / case file

A dark sheet with a redacted drawing and a case-file block. No invented project. Until a verified case exists, the block is labelled “LAYOUT PROOF” and all facts are `[VERIFY]`.

### Coverage index

A two-column index of Dubai areas. Internal links, not Google Maps outlinks. The index does not claim a local office or a completed project in every district. Area pages publish only with local content and evidence.

### FAQ

- Search field, result count and category filters.
- Category sections with 40–90 word answers.
- Each answer has source links and a review line.
- `<details>` accordion, keyboard accessible.
- Empty state when no question matches.
- No FAQPage schema until the answers are visible, unique, sourced and reviewed.

### Quote form

Three groups: contact, project, drawings. Use underlined fields, not rounded boxes. Required fields are marked. Consent is explicit. File upload is optional but encouraged. The submit state must be clear and must not promise a quote.

### Footer

- Brand and independence notice.
- Service links, knowledge links, contact links.
- Title block with project, sheet, revision, date and status.
- Legal links.
- Registrations and address `[VERIFY]` until confirmed.

## 4. Page templates

### Home

Sections: hero, trust strip, pathfinder, service register, project-type matrix, process, proof, coverage, FAQ preview, quote, footer.

The home page should answer “what do you do, who is it for, how does the route work, why should I trust the file” without becoming a brochure.

### Service page

Sections: hero with sheet metadata, plain-language answer, scope, who it is for, document checklist, sequence and dependencies, reviewer comments, inspection hand-off, FAQs, sources and document control, related services, CTA.

Every service page needs a unique answer box, document list and failure modes. Do not clone the same paragraph across 12 pages.

### Project-type page

Sections: hero, plain-language answer, ranked approval sequence, document checklist, load drivers, pitfalls, inspection hand-off, project example slot, FAQs, sources, sidebar summary, CTA.

### FAQ page

Sections: hero, search and filters, ten category sections, source/review note, correction policy, CTA.

### Area page

Sections: hero, local approval context, common property and activity types, authority boundaries, local constraints, related services, verified project slot, FAQs, CTA. Do not publish an area page with only a map and a list of services.

### About / how we work

Sections: who we are, independence, review method, document control, roles, corrections policy, contact. No invented team photos or credentials.

### Contact

Sections: project form, direct contact details, response expectation, privacy note, map only if a verified office address exists.

### Legal

Plain-language privacy, terms, cookies, accessibility and editorial/corrections pages. These are not design showcases.

## 5. Motion

- Use motion to explain state: a line drawing, a stamp pressing, a cable run energising.
- Durations: 120–600ms. No infinite decorative animation.
- Respect `prefers-reduced-motion`; disable transforms and smooth scrolling.
- Do not animate text in a way that delays reading.
- No parallax, autoplay video or cursor followers.

## 6. Accessibility

- WCAG 2.2 AA.
- Skip link.
- One H1 per page and a logical heading order.
- Visible focus ring using Ink and Copper text.
- 44px minimum target for primary mobile controls.
- Menus close on Escape and outside click; focus returns to the trigger.
- Accordions use native `<details>` / `<summary>`.
- Form errors are text, linked to the field and announced.
- No colour-only status.
- Arabic RTL uses logical properties and mirrored icons where direction matters.
- Tables have captions or accessible names.
- Decorative SVGs are `aria-hidden`; informative SVGs have a title.

## 7. Content design

- Start with the answer, then the dependency, then the document, then the next action.
- Use “usually”, “can”, “depends on” only when followed by the dependency.
- Name the authority and the owner of each step.
- Do not say “DEWA approval” when the step is a landlord NOC, Civil Defence review or Municipality permit.
- Do not publish a fee or timeline without a source and a scope condition.
- Every procedural page carries a named reviewer, role, review date and source list.
- Every page carries the independence notice.
- Arabic is a real translation, not machine output published without review.

## 8. Imagery

- Prefer real, consented, redacted project drawings and site photographs.
- No stock handshakes, laptops, blueprints on desks, AI robots or generic Dubai skylines.
- No client logos without written consent.
- No before/after claims without evidence.
- Every image needs alt text, width/height, a caption where useful and a rights record.
- Legacy images in `_legacy/` are not approved for use.

## 9. Do and do not

### Do

- Use the title block, sheet number and revision language consistently.
- Let tables, rules and white space carry the structure.
- Use copper for the live path, the changed state and the action.
- Write short, specific labels.
- Show the document, the reviewer and the date.
- Design the mobile sheet as a single-column drawing, not a shrunken desktop.

### Do not

- Use purple or blue gradients, glass cards, blobs, neon or glow.
- Use emoji, AI/robot/sparkle icons or “magic” language.
- Use icon-in-circle feature cards.
- Use three rounded cards in a row as the main content pattern.
- Use centred-everything layouts.
- Use fake stamps, fake approvals or fake project numbers.
- Use “trusted”, “fast”, “guaranteed” or “hassle-free” without evidence.
- Use the reference site's copy, images or entity name.

## 10. Review artefacts

- `design/prototypes/index.html`
- `design/prototypes/services/fit-out-electrical-approval.html`
- `design/prototypes/project-types/commercial-fit-out.html`
- `design/prototypes/faq.html`
- `design/prototypes/assets/site.css`
- `design/prototypes/assets/site.js`
- `design/prototypes/screenshots/` — desktop and mobile review captures.

The prototypes are design proofs. They contain draft copy, `[VERIFY]` placeholders and sample questions. They are not publication-ready.
