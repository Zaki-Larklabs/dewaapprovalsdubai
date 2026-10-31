# Product requirements: Abbadi Tech DEWA approvals website

Status: Gate A draft for owner review. No production build or publication is authorised until the Gate A sign-off and the claims verification in `docs/claims-to-verify.md` are complete.

## 1. Product summary

Abbadi Tech is an independent Dubai consultancy that prepares and manages DEWA electricity and water approval files for fit-outs, connections, load changes, NOCs, inspections and solar connections.

The website must do four jobs:

1. Help a project owner or contractor identify the likely approval route before they appoint anyone.
2. Explain each service and project type with enough technical specificity to be credible to a consultant, contractor or developer.
3. Convert a qualified enquiry into a structured project file without pretending to be DEWA or promising an outcome.
4. Publish original, sourced, dated content that is more useful than the reference site's single-page service list and generic FAQ.

The site is not an official DEWA property. It must say so on every page.

## 2. Problem

The reference site at `dewaconsultant.ae` ranks and converts despite:

- one URL for every service, project type and area;
- 105 FAQ answers on one page;
- generic cost and timeline answers;
- an entity name that implies authority affiliation;
- unverified trust language;
- 622 KB of HTML with 383 KB of base64 images;
- no Arabic and no hreflang;
- outbound Google Maps links instead of area content;
- no project-file workflow.

A better site can win on specificity, structure, trust and technical quality without copying the reference's claims or design.

## 3. Audience

### Primary: tenant or business owner

Needs to open or change a commercial unit. They know the business, not the approval sequence. They need a plain-language route, a document list and a realistic next step.

### Primary: fit-out contractor or MEP consultant

Needs a consultant who can review the load schedule, SLD, metering and inspection pack. They value technical precision, comment handling and schedule certainty more than marketing copy.

### Secondary: villa owner or small developer

Needs a new connection, water connection, building NOC, meter shifting or solar approval. They need to know which authority owns which step and what can block the file.

### Secondary: warehouse, industrial or infrastructure contractor

Needs load, HV/LV, NOC, utility clearance and asset-conflict expertise. They need evidence of process, not lifestyle imagery.

### Internal: owner, editor and reviewer

Needs a CMS workflow that prevents unpublished claims, unsourced procedures and stale review dates from going live.

## 4. Positioning

**Category:** independent DEWA approvals consultancy.

**Promise:** an approval file that is technically complete before it is submitted.

**Proof:** document discipline, source-linked procedures, named review, comment handling, inspection readiness and a clear scope.

**Tone:** calm, exact, commercial. No hype, no authority cosplay, no “fast and hassle-free” claims.

**Differentiators to demonstrate, not assert:**

- A route sheet that ranks approvals by dependency.
- Service pages that name documents, stages, adjacent approvals and failure modes.
- A project file that starts with the premise, activity, supply and drawings.
- A public correction and review policy.
- Arabic parity for priority pages.
- No invented projects or testimonials.

## 5. Goals and non-goals

### Goals

- Rank for service, project-type and long-tail question intent in Dubai.
- Generate qualified project enquiries with drawings or a document list.
- Reduce unqualified “how much and how fast” enquiries by answering the dependency first.
- Build a content library that can be reviewed, corrected and translated.
- Meet WCAG 2.2 AA and the performance budgets in `docs/TECH_RULES.md`.
- Launch with no unverified factual, legal or authority claims.

### Non-goals

- Compete with DEWA's official portal or reproduce authority forms.
- Publish a price list before the scope is defined.
- Publish guaranteed approval times.
- Publish client names, logos or testimonials without written consent.
- Build a blog before the core service and FAQ library is complete.
- Build a customer portal or document management system in Phase 1.
- Claim to be “DEWA approved”, “DEWA registered” or “DEWA consultant” unless the exact registration is verified and the wording is approved.

## 6. Scope

### Phase 1 launch pages

| Group | Pages |
|---|---|
| Core | Home, About, How we work, Contact, Thank you, 404, Search |
| Services | Hub plus 12 service pages |
| Project types | Hub plus 8 project-type pages |
| Areas | Hub plus 8 priority area pages |
| FAQ | Hub plus 10 category pages |
| Legal | Privacy, Terms, Cookies, Accessibility, Editorial and corrections |
| Arabic | Priority mirror for home, services hub, top 4 services, FAQ hub and contact |

### Phase 2

- Remaining 16 area pages, only after each has local content and a verified project or local evidence.
- Full Arabic mirror.
- Insights/articles, only with a named author, reviewer and source list.
- Project case files, only with written client consent and redacted evidence.
- Interactive route tool with saved results, only after the content model and legal review.

## 7. Information architecture

```text
/
├── about/
├── how-we-work/
├── contact/
├── thank-you/
├── services/
│   ├── fit-out-electrical-approval/
│   ├── electrical-load-upgrade/
│   ├── new-electricity-connection/
│   ├── new-water-connection/
│   ├── building-noc/
│   ├── load-schedule-sld/
│   ├── lv-inspection-meter-connection/
│   ├── temporary-construction-power/
│   ├── meter-cable-shifting/
│   ├── shams-dubai-solar/
│   ├── demolition-noc/
│   └── infrastructure-noc/
├── project-types/
│   ├── commercial-fit-out/
│   ├── restaurant-kitchen/
│   ├── clinic-medical/
│   ├── warehouse-industrial/
│   ├── villa/
│   ├── school-nursery/
│   ├── hotel-hospitality/
│   └── infrastructure-utilities/
├── areas/
│   ├── business-bay/
│   ├── al-quoz/
│   ├── dubai-investment-park/
│   ├── dubai-south/
│   ├── jumeirah-lakes-towers/
│   ├── deira/
│   ├── al-barsha/
│   └── dubai-silicon-oasis/
├── faq/
│   ├── sequencing/
│   ├── documents/
│   ├── technical/
│   ├── water/
│   ├── process/
│   ├── cost/
│   ├── inspection/
│   ├── locations/
│   ├── risk/
│   └── working-with-us/
├── privacy/
├── terms/
├── cookies/
├── accessibility/
├── editorial-policy/
└── ar/…
```

The full URL list, priorities and redirects are in `docs/SITEMAP.md`.

## 8. Functional requirements

### 8.1 Content and CMS

- Editors can create and edit services, project types, areas, FAQ categories, FAQs, pages, people, sources and redirects.
- Every procedural page has `sources[]`, `reviewer`, `lastReviewed`, `status` and `claims[]`.
- A page cannot be published if it is procedural and lacks a source, reviewer or review date.
- A page cannot be published if it cites a claim marked `unverified` in the claims register.
- Revisions are versioned and attributable.
- Preview works before publication.
- Scheduled publication is supported.
- Redirects are managed in the CMS and exported to the deployment config.

### 8.2 Search and filtering

- FAQ search filters by question and answer text.
- Category filters combine with search.
- Empty categories are hidden.
- Results are announced to assistive technology.
- Search works without JavaScript for the full category pages; JavaScript enhances filtering only.

### 8.3 Enquiry form

- Fields: name, company, email, phone/WhatsApp, service, project type, area, premise/customer number, what is changing, consent.
- Optional file upload: PDF, DWG, DXF, DOC/DOCX, XLS/XLSX, JPG/PNG; maximum 15 MB per file; maximum 3 files.
- Server-side validation and normalisation.
- Honeypot plus Cloudflare Turnstile.
- Rate limiting by IP and session.
- Files stored in private object storage, not in the repository or public bucket.
- Malware scanning before the file is available to staff.
- Email notification via Resend with a safe, plain-text summary and a link to the record.
- Autoresponder states the next step and does not promise a quote, approval or timeline.
- Consent text links to the privacy notice.
- Retention and deletion policy documented.

### 8.4 SEO

- One H1 per page.
- Unique title and meta description.
- Canonical URL.
- `en-AE` and Arabic `ar-AE` with reciprocal hreflang.
- Breadcrumb schema on inner pages.
- `Service` schema on service pages.
- `FAQPage` only for visible, unique, reviewed Q&A.
- `Organization` schema for Abbadi Tech Technical Solutions LLC.
- XML sitemap and robots.txt.
- Redirect map for legacy URLs.
- No keyword-stuffed anchors.
- No fake review or aggregate rating schema.

### 8.5 Analytics and consent

- Privacy-first analytics with consent where required.
- Track form start, submit, validation error, upload failure and thank-you view.
- Do not send drawing contents, message bodies or personal data to analytics.
- Document the data processor list.

### 8.6 Accessibility

- WCAG 2.2 AA target.
- Keyboard-complete navigation, menus, accordions, filters and form.
- Visible focus.
- Skip link.
- Reduced-motion support.
- No colour-only status.
- Form errors linked to fields and announced.
- Arabic RTL layout with logical properties.

## 9. Non-functional requirements

### Performance

- Mobile LCP < 2.0 s at p75 on a mid-range Android device.
- INP < 200 ms.
- CLS < 0.05.
- Initial JS < 170 KB gzipped.
- Page weight < 1.2 MB excluding user-uploaded files.
- No base64 images.
- No render-blocking third-party scripts.

### Security

- HTTPS only, HSTS.
- CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection.
- No secrets in the repository.
- Least-privilege CMS roles.
- Signed upload URLs.
- Malware scanning.
- Dependency audit and secret scanning in CI.
- Backups and restore test.

### Reliability

- Uptime target 99.9%.
- Error monitoring with Sentry.
- Form failure alerting.
- Daily database backups with a documented restore.
- Deployment rollback procedure.

## 10. Success metrics

| Metric | Target after 90 days |
|---|---|
| Qualified enquiries per month | Baseline set at launch, then +20% |
| Enquiries with a drawing or document list | ≥ 40% |
| Form completion rate | ≥ 35% of starts |
| Organic impressions for service pages | Month-over-month growth |
| Pages with a review date older than 12 months | 0 |
| Unverified claims published | 0 |
| Lighthouse mobile performance | ≥ 90 on the built site |
| Accessibility automated violations | 0 critical/serious |
| Arabic priority pages complete | 100% of Phase 1 mirror |

No ranking, traffic or revenue figure is guaranteed.

## 11. Acceptance criteria

### Gate A

- Reference trace, PRD, design system, technical rules, todo, claims register, sitemap, keyword map and content briefs are complete.
- Four coded page designs exist and have desktop/mobile screenshots.
- No production build has started.
- Owner has reviewed the brand, domain, contact details and scope.
- Open questions are recorded and answered or explicitly deferred.

### Gate B

- Production app builds and deploys to a preview.
- CMS models and roles work.
- Forms, uploads, spam protection and notifications work.
- All Phase 1 pages have content, sources, reviewer and review date.
- Redirects, sitemap, robots, schema and hreflang validate.
- Accessibility, performance, security and link checks pass.
- Arabic priority mirror is complete.
- Owner signs off the claims register.

### Gate C

- Production launch with monitoring, backups and rollback tested.
- Search Console and analytics verified.
- First 30-day review completed.
- Content correction and review cadence running.

## 12. Dependencies and open questions

- Legal entity, trade licence, registered address and VAT details.
- Verified phone, email, WhatsApp and response-time policy.
- Registration status for any authority, free-zone or RSB claim.
- Permission to use the Abbadi Tech name and marks.
- Canonical domain and DNS access.
- Arabic translator and reviewer.
- Privacy notice, retention period and data processor list.
- Whether the business will publish fees, ranges or “from” pricing.
- Whether the business will publish anonymised project evidence.
- Whether weekend or emergency cover is offered.
- GitHub organisation, repository and branch protection.
