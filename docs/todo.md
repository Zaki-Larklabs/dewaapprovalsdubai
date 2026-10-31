# Delivery todo

Status: Gate A in progress. Do not start Gate B production implementation until Gate A is signed off.

## Gate A — foundation and page designs

### Repository

- [x] Capture legacy site in `_legacy/`.
- [x] Initialise git and baseline commit.
- [x] Create `docs/gate-a-foundation` branch.
- [x] Add `.gitignore` for env, build output, `.research`, uploads and generated artefacts.
- [x] Add root `README.md` with status, brand assumption and prototype instructions.
- [x] Add `_legacy/README.md` warning about rights and deployment.
- [ ] Commit Gate A documents and prototype changes.
- [ ] Push branch to GitHub after auth is fixed.
- [ ] Enable branch protection and required checks.
- [ ] Add CodeRabbit or an equivalent review bot after repository access is fixed.

### Research

- [x] Capture reference HTML and save it under `.research/`.
- [x] Extract headings, sections, service cards, project cards, area links, forms, metadata and FAQ groups.
- [x] Record the 12 services, 4 reference project groups, 24 areas and 105 FAQ questions.
- [x] Attempt Lighthouse; record the 403 WAF block and the 429 PageSpeed response.
- [x] Write `docs/REFERENCE_TRACE.md`.
- [ ] Re-check live reference after the WAF block clears, if a lab comparison is still useful.
- [ ] Capture reference screenshots for the internal gap review, without reusing them in the product.

### Product and content

- [x] Define the independent-consultancy positioning and prohibited claims.
- [x] Define the audience, goals, non-goals and Phase 1 scope.
- [x] Write `docs/PRD.md`.
- [x] Draft the sitemap and redirect plan in `docs/SITEMAP.md`.
- [x] Draft the keyword map in `docs/keyword-map.csv`.
- [x] Draft content briefs in `docs/content-briefs.md`.
- [x] Create `docs/claims-to-verify.md`.
- [ ] Owner confirms legal entity, licence, address, phone, email and domain.
- [ ] Owner confirms the claims register.
- [ ] Owner confirms whether fees, timelines or project evidence will be published.
- [ ] Arabic translator and reviewer appointed.

### Design

- [x] Define tokens, typography, grid and component language.
- [x] Build the home page design.
- [x] Build the service page design.
- [x] Build the project-type page design.
- [x] Build the FAQ page design.
- [x] Self-host the font files used by the prototypes.
- [x] Add desktop and mobile screenshots.
- [x] Check primary colour contrast.
- [ ] Visual QA on a physical iOS device and a low-end Android device.
- [ ] Review the quote form and file input on mobile.
- [ ] Approve the design direction.
- [ ] Build remaining templates: service hub, project-type hub, area hub, area page, about, contact, legal, 404, thank-you.
- [ ] Build the Arabic mirror for the four designed templates.
- [ ] Replace all `[VERIFY]` placeholders before publication.

### Technical

- [x] Decide the production stack and document it in `docs/TECH_RULES.md`.
- [x] Define CMS collections, roles and publish guard.
- [x] Define form, upload, spam and retention rules.
- [x] Define SEO, i18n, accessibility, performance, security and CI rules.
- [ ] Scaffold the Next.js app after Gate A approval.
- [ ] Add the CI workflow after the app exists.
- [ ] Add the CMS models and publish guard.
- [ ] Add form, upload, Turnstile and email integration.
- [ ] Add analytics consent and error monitoring.
- [ ] Add redirects and sitemap generation.

### Gate A review

- [ ] Present the four page designs and screenshots.
- [ ] Present the PRD, design system, technical rules and sitemap.
- [ ] Resolve or explicitly defer every open question.
- [ ] Record sign-off in `docs/GATE_A_SIGNOFF.md`.
- [ ] Stop. Do not start production implementation before sign-off.

## Gate B — production build

### Foundation

- [ ] Create the app, TypeScript config, linting and formatting.
- [ ] Add design tokens and base styles.
- [ ] Add self-hosted fonts and RTL styles.
- [ ] Add layout, header, footer, title block and skip link.
- [ ] Add the 404, thank-you and search pages.

### CMS

- [ ] Create the Payload collections and globals.
- [ ] Add roles and access control.
- [ ] Add draft preview.
- [ ] Add the publish guard and claims validation.
- [ ] Add redirects and SEO fields.
- [ ] Seed the service, project-type and FAQ taxonomies.
- [ ] Add source and reviewer records.

### Templates

- [ ] Home.
- [ ] Services hub and 12 service pages.
- [ ] Project-types hub and 8 project-type pages.
- [ ] Areas hub and 8 priority area pages.
- [ ] FAQ hub and 10 category pages.
- [ ] About and how we work.
- [ ] Contact.
- [ ] Legal pages.
- [ ] Arabic priority mirror.

### Content

- [ ] Write or commission every Phase 1 page.
- [ ] Add official sources, reviewer and review date to every procedural page.
- [ ] Verify every claim in `docs/claims-to-verify.md`.
- [ ] Add internal links and related content.
- [ ] Add image alt text and rights records.
- [ ] Human-review the Arabic copy.
- [ ] Run the duplicate-content and thin-content checks.

### Forms and integrations

- [ ] Server-side validation.
- [ ] Turnstile and honeypot.
- [ ] Rate limiting.
- [ ] Private R2 uploads.
- [ ] Malware scanning.
- [ ] Resend notifications and autoresponder.
- [ ] Consent and retention.
- [ ] Failure alerts.

### Quality

- [ ] Unit tests.
- [ ] Playwright end-to-end tests.
- [ ] axe checks on every template.
- [ ] Keyboard and screen-reader smoke tests.
- [ ] Lighthouse budgets.
- [ ] Link check.
- [ ] Redirect check.
- [ ] Schema validation.
- [ ] Hreflang validation.
- [ ] Security headers and CSP review.
- [ ] Dependency audit and secret scan.
- [ ] Backup and restore test.

### Launch

- [ ] Preview sign-off.
- [ ] Production deploy.
- [ ] DNS and canonical verification.
- [ ] Search Console and analytics verification.
- [ ] Sitemap submission.
- [ ] Monitoring and alerting.
- [ ] 30-day review.

## Gate C — post-launch

- [ ] Review search queries and enquiry quality.
- [ ] Fix content gaps and underperforming pages.
- [ ] Add Phase 2 area pages only with local evidence.
- [ ] Add verified case files only with consent.
- [ ] Review source links and review dates.
- [ ] Add Arabic pages beyond the Phase 1 mirror.
- [ ] Review performance and accessibility quarterly.
- [ ] Update the claims register and corrections log.

## Blockers

| Blocker | Impact | Owner |
|---|---|---|
| GitHub CLI auth invalid | No remote, branch protection, PR checks or CodeRabbit | Owner |
| Legal entity, licence, address, phone, email unverified | Cannot publish contact or trust details | Owner |
| No verified project evidence | No case files or project claims | Owner |
| No Arabic reviewer | Arabic mirror cannot publish | Owner |
| No pricing/timeline policy | Cost and timeline pages remain conditional | Owner |
| Legacy image rights unknown | Legacy images cannot be used | Owner |
| Reference Lighthouse blocked by WAF | No live reference performance comparison | Research |
