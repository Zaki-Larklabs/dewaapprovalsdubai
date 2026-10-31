# Technical rules

Status: Gate A decision record. The production app is not scaffolded yet. These rules are the contract for Gate B.

## 1. Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Current stable Next.js, App Router | Server rendering, route handlers, static generation, metadata |
| Language | TypeScript, strict | Safer content and form contracts |
| Styling | CSS Modules plus global design tokens | Custom drawing-sheet design, no utility-class lock-in |
| CMS | Payload CMS 3 | Typed collections, roles, hooks, draft preview |
| Database | PostgreSQL on Neon | Managed Postgres, branching for previews |
| i18n | next-intl | Locale routing, RTL, message catalogs |
| Email | Resend | Transactional notifications and autoresponder |
| Uploads | Cloudflare R2, private bucket | Large drawings, signed URLs, no public bucket |
| Spam | Cloudflare Turnstile plus honeypot | Low-friction bot defence |
| Monitoring | Sentry | Server and client error tracking |
| Hosting | Vercel | Preview deployments, edge caching, rollback |
| Testing | Vitest, Playwright, axe-core | Unit, browser and accessibility checks |
| CI | GitHub Actions | Lint, typecheck, test, build, audit, secret scan |

Pin exact versions at scaffold time. Do not upgrade a major version during Gate B without a written reason and a regression run.

## 2. Repository shape

```text
/
├── app/
│   ├── (site)/
│   ├── (payload)/
│   ├── api/
│   └── ar/
├── components/
│   ├── drawing/
│   ├── layout/
│   ├── forms/
│   └── content/
├── content/
│   ├── services/
│   ├── project-types/
│   ├── areas/
│   └── faqs/
├── lib/
│   ├── cms/
│   ├── forms/
│   ├── seo/
│   ├── analytics/
│   └── security/
├── public/
│   ├── fonts/
│   ├── drawings/
│   └── icons/
├── styles/
│   ├── tokens.css
│   ├── base.css
│   └── print.css
├── tests/
│   ├── unit/
│   ├── e2e/
│   └── a11y/
├── docs/
└── .github/workflows/
```

Do not put content copy in components. Do not put secrets in the repository.

## 3. Rendering and performance

- Default to Server Components.
- Use Client Components only for menus, filters, form state, upload progress and other genuine interaction.
- Static generation for service, project-type, area and FAQ pages; revalidate on publish.
- No client-side data fetching for page content.
- No large UI library. No component library that ships unused JavaScript.
- Self-host subset WOFF2 fonts through `next/font/local` or a local `@font-face` file. No Google Fonts at runtime.
- Images: `next/image` with explicit width/height, `sizes`, AVIF/WebP, lazy loading below the fold.
- No base64 images in HTML.
- Inline only critical CSS if measured; otherwise use cacheable CSS.
- Third-party scripts load after consent and never block rendering.

Budgets:

- LCP < 2.0 s p75 mobile.
- INP < 200 ms.
- CLS < 0.05.
- Initial JS < 170 KB gzipped.
- Page weight < 1.2 MB excluding user uploads.
- Lighthouse mobile performance ≥ 90 on the built site.

## 4. CMS model

### Collections

- `services`: title, slug, short definition, answer, scope, who it is for, documents, sequence, comments, inspection, FAQs, related services, sources, reviewer, lastReviewed, status, SEO.
- `projectTypes`: title, slug, answer, ranked sequence, documents, load drivers, pitfalls, inspection, example, FAQs, related services, sources, reviewer, lastReviewed, status, SEO.
- `areas`: title, slug, local context, property types, authority boundaries, constraints, related services, verified project, FAQs, sources, reviewer, lastReviewed, status, SEO.
- `faqCategories`: title, slug, description, order, SEO.
- `faqs`: question, answer, category, service links, project-type links, area links, sources, reviewer, lastReviewed, status, order.
- `pages`: legal, about, how-we-work, contact, editorial policy, with a flexible but constrained block set.
- `projects`: only with written consent, redacted evidence, client approval and a publication date.
- `people`: name, role, qualifications, bio, photo, consent, order.
- `sources`: title, URL, publisher, published date, accessed date, source type, notes.
- `claims`: claim text, status (`unverified`, `verified`, `rejected`), evidence, owner, review date, where used.
- `redirects`: from, to, status code, note.
- `media`: alt text, caption, credit, rights, focal point.

### Roles

| Role | Rights |
|---|---|
| Admin | All settings, users, publish |
| Editor | Create and edit drafts, submit for review |
| Reviewer | Review, approve, publish within assigned collections |
| Contributor | Create drafts only, no publish |
| Viewer | Read-only |

### Publish guard

A server-side `beforeChange` hook blocks publication when:

- a procedural page has no `sources[]`;
- `reviewer` is empty;
- `lastReviewed` is empty or older than the allowed window;
- a referenced claim is `unverified` or `rejected`;
- an FAQ answer is shorter than 40 words or longer than 90 words without an editor override;
- a service or project page has no unique answer;
- an area page has no local content marker;
- the slug collides with an existing route;
- a required Arabic field is missing for a Phase 1 Arabic page.

The hook must return a field-level error, not a generic failure.

## 5. Content and source rules

- Every procedural page has at least one official source.
- Prefer the authority's own page, PDF or portal over a blog or news article.
- Record the source URL, publisher, publication date (if any) and access date.
- A source that has changed or disappeared is a review trigger.
- Do not paraphrase a procedure into a guarantee.
- Do not publish a fee, timeline or approval probability without a scope condition and a source.
- Do not use the reference site as a source.
- Do not use another consultancy's copy, images or case studies.
- Every page carries the independence notice.
- Every FAQ answer is 40–90 words and states the dependency.
- Arabic content is reviewed by a human, not published from machine translation alone.

## 6. Forms and uploads

- Use a server action or route handler with a Zod schema shared by client and server.
- Validate on the server even when the client validates.
- Normalise phone numbers to E.164 where possible; do not reject international numbers silently.
- Honeypot field must be hidden from users and assistive technology.
- Turnstile verification is server-side.
- Rate limit by IP and by session; return a generic error without leaking whether an address exists.
- File upload:
  - allowed types: PDF, DWG, DXF, DOC, DOCX, XLS, XLSX, JPG, PNG;
  - maximum 15 MB per file, 3 files;
  - signed upload URL;
  - private bucket;
  - malware scan before staff access;
  - store original filename only as metadata, never as a path;
  - expire download links.
- Email notification contains a link to the CMS record, not the file contents.
- Autoresponder is plain text and states the next step without promising a quote or timeline.
- Consent is required and links to the privacy notice.
- Log form failures without logging message bodies or file contents.

## 7. Security

- HTTPS only, HSTS.
- CSP with nonces for any inline script; no `unsafe-eval`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` denies camera, microphone, geolocation unless needed.
- Frame protection via CSP `frame-ancestors 'none'`.
- No secrets in client bundles.
- Environment variables validated at boot; fail closed if missing.
- CMS access requires MFA for Admin and Reviewer.
- Least-privilege database and storage credentials.
- Signed URLs for private files.
- Dependency audit and secret scanning in CI.
- No `dangerouslySetInnerHTML` for CMS content unless sanitised with an allow-list.
- Rate limit authentication and form endpoints.
- Backups encrypted at rest.

## 8. SEO

- One canonical per page.
- `en-AE` default; `ar-AE` mirror with reciprocal hreflang and `x-default`.
- Unique title, description and H1.
- Breadcrumbs on inner pages.
- `Service` schema on service pages.
- `FAQPage` only when the questions and answers are visible on the page and reviewed.
- `Organization` schema for Abbadi Tech Technical Solutions LLC.
- No `AggregateRating` or `Review` schema without real, consented reviews.
- XML sitemap generated from published routes.
- `robots.txt` allows public pages and blocks CMS, preview, search results and API routes.
- Redirects use 301 for permanent moves; 410 for removed content with no replacement.
- No orphan pages. Every page is reachable from a hub or an internal link.
- No keyword-stuffed exact-match anchors. Use descriptive anchors.
- No doorway pages for areas. Each area page needs local content.

## 9. Internationalisation

- Locale routing: `/` for English, `/ar/` for Arabic.
- `dir="rtl"` and `lang="ar-AE"` on Arabic pages.
- Logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline`).
- Mirrored icons only where direction matters.
- Arabic typography uses IBM Plex Sans Arabic; do not force uppercase.
- Numbers, phone numbers and Latin acronyms keep their reading direction.
- hreflang pairs only when both pages are published and equivalent.
- Do not publish a half-translated page.

## 10. Accessibility

- WCAG 2.2 AA.
- Semantic landmarks: header, nav, main, footer.
- Skip link.
- One H1; logical heading order.
- Keyboard-complete menus, filters, accordions and forms.
- Focus visible and not obscured by the sticky header.
- Form labels, descriptions, errors and `aria-invalid`.
- Status messages use `aria-live`.
- Reduced motion.
- No colour-only meaning.
- Tables have captions or accessible names.
- Test with keyboard, screen reader and 200% zoom.

## 11. Testing

### Unit

- Form schema validation.
- Phone normalisation.
- Slug and redirect generation.
- Publish guard rules.
- Schema builders.
- Date and review-status logic.

### End-to-end

- Home, service, project-type, area and FAQ pages render.
- Navigation and mobile menu.
- FAQ search and category filters.
- Form validation, consent, upload and success state.
- 404 and thank-you pages.
- Redirects.

### Accessibility

- axe-core on every template.
- Keyboard-only path through the enquiry form.
- Screen-reader smoke test for menu, accordion and errors.

### Performance

- Lighthouse CI on the built site for home, top service, top project type and FAQ.
- Budget assertions for LCP, CLS, INP where available, JS and page weight.

### Security

- `npm audit` (or the package manager equivalent).
- Gitleaks.
- Dependency review on pull requests.
- Manual review of CSP and headers.

## 12. CI

The workflow must run on pull requests and on `main`:

1. Install with a locked lockfile.
2. Lint.
3. Typecheck.
4. Unit tests.
5. Build.
6. Start the production server.
7. Playwright end-to-end tests.
8. axe checks.
9. Lighthouse CI.
10. Gitleaks.
11. Dependency audit.

No deploy from a failing workflow. Preview deploys are allowed from branches; production deploy only from `main` after checks and approval.

## 13. Deployment and operations

- Vercel project with preview and production environments.
- Neon Postgres with separate preview and production branches.
- R2 private bucket with lifecycle rules.
- Resend domain verification and SPF/DKIM/DMARC.
- Turnstile site and secret keys per environment.
- Sentry project per environment.
- Environment variables documented in `.env.example` with placeholders only.
- Daily database backup; monthly restore test.
- Rollback: redeploy the previous Vercel deployment and restore the database only if the release included a migration.
- Incident runbook: form failure, CMS outage, email failure, upload failure, certificate issue.

## 14. Prohibited

- Copying the reference site's HTML, CSS, copy, images, logo or case studies.
- Using the legacy images without rights verification.
- Publishing unverified registrations, licence numbers, addresses, phone numbers, emails or project facts.
- Inventing clients, reviews, project counts, approval times, fees or guarantees.
- Calling Abbadi Tech “DEWA” or implying affiliation.
- Shipping a page with no source or reviewer.
- Shipping a form that emails file attachments.
- Shipping analytics that collect form contents.
- Using a public storage bucket for drawings.
- Using `dangerouslySetInnerHTML` without sanitisation.
- Adding a dependency without checking licence, maintenance and bundle impact.
