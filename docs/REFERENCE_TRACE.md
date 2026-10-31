# Reference trace: dewaconsultant.ae

Captured 31 October 2026. Raw HTML and extraction scripts are in `.research/` (git-ignored). This document records what the reference site actually contains, what it does well enough to learn from, and where Abbadi Tech must not copy it.

## Evidence and limits

- The reference was fetched as a single HTML document: `.research/reference.html`, 622,168 bytes.
- DOM, headings, cards, forms, links, media, metadata and structured data were extracted with the scripts in `.research/`.
- Lighthouse 12.8.2 was attempted against the live URL. It returned HTTP 403 from the site's WAF, so no performance, accessibility, best-practice or SEO score is claimed.
- The PageSpeed Insights API returned HTTP 429. No lab or field metric is claimed from it.
- The static source audit below is factual for the captured document. It is not a substitute for a live crawl, a rendered Core Web Vitals test or a legal review.
- No reference copy, image, logo or testimonial is approved for reuse. The legacy images in `_legacy/` have unknown provenance and rights.

## Snapshot

| Attribute | Reference |
|---|---|
| URL | `https://dewaconsultant.ae/` |
| Page model | One long WordPress page with anchor navigation |
| CMS / theme | WordPress 7.0.7 / Astra |
| Language | `en-US`; no Arabic version |
| Hreflang | None |
| Indexability | `index, follow` |
| Sitemap | One URL only: the home page |
| Title | `DEWA Consultant \| DEWA Approval, & NOC Consultants in Dubai` |
| Meta description | “Trusted DEWA consultant in Dubai. We handle DEWA authority approval, NOC, & permits. Fast & hassle-free process, expert support. Get free quote +971523585916” |
| H1 | `Dubai's Trusted DEWA Approval, & NOC Consultants` |
| Visible sections | 8 content sections plus header and footer |
| Services | 12 service cards, all linking to the same page |
| Project groups | 4 project cards |
| Area links | 24, all outbound to Google Maps |
| FAQ | 105 questions in 3 groups of 35 |
| Form | Name, phone, service, optional email, message |
| Images | 2 `<img>` elements, with 383,296 bytes of base64 image data |
| Inline CSS | 81,110 bytes |
| Inline JavaScript | 45,234 bytes |
| Anchors | 53 |
| External links | 40: 24 Google Maps, 12 DEWA, 4 `wa.me` |
| Blog | “Blog Soon”; no articles |
| Structured data | Person/Organization, WebSite, WebPage, Article, FAQPage |
| Twitter metadata | Personal Gmail address in `twitter:data1` |
| Canonical | Home page only |
| Analytics / consent | Not established from the captured HTML |

## Section order

1. Header and navigation
2. Hero `#home`
3. Trust / ribbon strip
4. Services `#services`
5. Project types `#projects`
6. About `#about`
7. Areas `#areas`
8. Quote / contact `#contact`
9. FAQ `#faq`
10. Footer

The order is conventional and scannable. It moves from promise to services, proof-by-project-type, company, coverage, conversion and objection handling. The weakness is that every step is a section on one URL, so no service, project type or area has a dedicated answer page.

## Services inventory

All 12 service cards link to the same page. There are no service URLs, no individual service FAQs and no service-specific metadata.

| # | Reference service | What the reference says it is for | Abbadi Tech opportunity |
|---|---|---|---|
| 01 | DEWA Fit-Out Electrical Approval | Shell-and-core or fitted commercial unit | Dedicated service page with document list, sequence, load drivers, inspection hand-off |
| 02 | DEWA Electrical Load Upgrade | Existing capacity insufficient for equipment | Dedicated page covering load schedule, maximum demand, protection and meter implications |
| 03 | DEWA New Electricity Connection | New building, villa, warehouse, commercial property or development | Dedicated page covering premise, connection type, design stage and inspection |
| 04 | DEWA New Water Connection Approval | New building, development or applicable property | Dedicated page covering demand, meter size, plumbing responsibility and adjacent approvals |
| 05 | DEWA Building NOC – Electricity and Water | Building permit, extension or demolition | Dedicated page covering NOC scope, drawings, validity and authority boundary |
| 06 | DEWA Load Schedule and Single-Line Diagram Approval | Technical documents explaining demand and distribution | Dedicated technical page with reviewer checklist and common comments |
| 07 | DEWA LV Inspection and Meter Connection | Completed installation before supply release | Dedicated page with readiness checklist, test pack and defect close-out |
| 08 | DEWA Temporary Construction Power Approval | Site offices, tools, machinery before permanent supply | Dedicated page covering temporary supply, duration, removal and site safety |
| 09 | DEWA Electricity Meter or Cable Shifting | Relocation or modification of DEWA assets | Dedicated page covering asset conflict, survey, NOC and reinstatement |
| 10 | Solar Approval Under Shams Dubai | Eligible PV systems connected to the network | Dedicated page covering eligibility, net metering, protection and inspection |
| 11 | DEWA Demolition NOC | Services addressed before demolition | Dedicated page covering disconnection, clearance, sequence and site records |
| 12 | Infrastructure NOC and Utility Clearance | Works near DEWA assets | Dedicated page covering reservations, corridors, design-and-build NOC and utility clearance |

The reference names the services clearly, but treats them as card summaries. It does not answer the questions a client asks before appointing a consultant: what stage, what documents, what can block the file, what is adjacent, what happens at inspection.

## Project groups

The reference has four project groups:

1. Commercial Fitout Projects — offices, retail, restaurants, cafés, salons, clinics, gyms, supermarkets, showrooms.
2. Villa Construction & Renovation Projects.
3. Warehouse, Industrial & Factory Projects.
4. Infrastructure, Road & Utility Projects.

The prototype expands these into eight project-type pages because the reference's four groups mix very different approval sequences. The expansion is a content-planning decision, not a claim that the reference has eight groups.

## FAQ inventory

The reference publishes 105 questions in three groups of 35:

1. Connections, Fit-Out & Load Approvals.
2. NOCs, Building Permits & Inspections.
3. Solar, Process, Costs & Compliance.

The FAQ is the strongest part of the reference because it covers long-tail questions. Its weaknesses are:

- The answers are often short, generic or circular.
- Several answers say “it depends” without naming the dependency.
- Cost and timeline answers avoid a usable decision rule.
- The same page carries all 105 answers, so the HTML is heavy and the topics are not individually addressable.
- The FAQPage schema is large and repeats content that is also visible, with no reviewer or review date.

The Abbadi Tech library should keep the long-tail coverage but make each answer source-backed, dated, reviewed and linked to the relevant service or project type. The planned library is 120+ questions across ten categories, with 40–90 word answers.

## Form gap

Reference fields:

- Name (required)
- Phone (required)
- Service select
- Email (optional)
- Project message

Missing or weak:

- No project type, area, premise number, existing supply or opening date.
- No file upload for drawings, load schedule, tenancy or NOC.
- No consent checkbox or privacy link at the point of submission.
- No visible spam protection, honeypot or Turnstile.
- No server-side validation evidence.
- No confirmation state or response-time expectation.
- No separation between a sales enquiry and a project file.

The Abbadi Tech form should collect the minimum needed to route a project, allow a drawing upload, require consent, use server-side validation and Turnstile, and return a clear next step. It must not promise a quote or a timeline that has not been verified.

## Metadata and schema gap

The reference title and description are keyword-led and make trust claims (“Trusted”, “Fast”, “hassle-free”) without evidence. The page is `en_US` with no Arabic or hreflang. The structured data includes a Person/Organization named “DEWA Consultant”, an Article authored by a personal Gmail address, and a 105-question FAQPage.

Abbadi Tech should:

- Use `en-AE` and an Arabic mirror with reciprocal hreflang.
- Use `Organization` for Abbadi Tech Technical Solutions LLC, not a person or a “DEWA Consultant” entity.
- Use `Service` schema on service pages and `FAQPage` only where the questions are visible, unique, reviewed and dated.
- Use `BreadcrumbList` on inner pages.
- Publish a named reviewer, role, review date and source list for procedural content.
- Keep the independence notice visible, not buried in schema.

## Technical and accessibility gaps

- No `<main>` landmark.
- One H1, but the heading order is not a clean page outline.
- Two images, no `srcset`, no `sizes`, no explicit dimensions and no `loading` policy.
- 383,296 bytes of base64 images inside the HTML.
- 81,110 bytes of inline CSS and 45,234 bytes of inline JavaScript.
- Google Fonts Raleway and Inter loaded externally.
- No reduced-motion handling in the captured source.
- 24 area links are outbound to Google Maps, not internal area pages.
- 12 repeated exact-match “DEWA approval” anchors.
- No visible skip link.
- No evidence of a cookie/consent layer.
- The mobile navigation is a button with an `aria-label`, but the captured markup does not establish a robust focus trap or expanded state.

These are source-level observations. The site may behave differently when rendered or behind its WAF.

## Performance and asset gap

The single document carries the entire site: 622 KB of HTML, 81 KB of inline CSS, 45 KB of inline JavaScript and 383 KB of base64 image data. Every service, project type and FAQ answer shares one URL. That is a poor foundation for caching, mobile delivery and topic-level search.

Abbadi Tech must not reproduce this pattern. The production rules are:

- One topic per URL.
- No base64 images in HTML.
- Responsive images with width/height, `srcset`, `sizes` and lazy loading below the fold.
- Self-hosted, subset fonts with `font-display: swap`.
- CSS and JS in cacheable files, with minimal client JavaScript.
- A page-weight budget of 1.2 MB and a JS budget of 170 KB gzipped.

## What to learn from the reference

- The service list is complete enough to be useful as a taxonomy.
- The FAQ covers real long-tail questions.
- The section order is understandable.
- The area list reflects Dubai's actual geography.
- The page gives a clear phone/WhatsApp path.

## What not to copy

- The “DEWA Consultant” entity name and any implication of authority affiliation.
- “Trusted”, “fast”, “hassle-free”, “guaranteed” or similar claims without evidence.
- The personal Gmail address in metadata.
- The single-page architecture for every topic.
- The 105-question FAQPage dumped onto one URL.
- The base64 image pattern.
- The outbound Google Maps area links as a substitute for local content.
- The reference's images, logo, copy, testimonials or project claims.
- Any fee, timeline or approval guarantee that is not sourced and approved.

## Source files

- `.research/reference.html` — captured HTML.
- `.research/headings.txt` — heading outline.
- `.research/faqgroups.js` — 105-question inventory by group.
- `.research/cards.js` — service, project and area card extraction.
- `.research/forms.js` — form field inventory.
- `.research/meta.js` — metadata and JSON-LD.
- `.research/a11y.js` — landmarks, headings and alt text.
- `.research/assets.js` — scripts and inline asset weights.
- `.research/media.js` — image and media inventory.
- `.research/lighthouse-reference.json` — failed 403 Lighthouse run; no scores.
- `.research/page-sitemap.xml` — reference sitemap with one URL.
