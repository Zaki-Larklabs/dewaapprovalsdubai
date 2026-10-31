# Sitemap and redirect plan

Status: Gate A draft. URLs use the assumed canonical host `https://dewaapprovals.abbaditech.ae`. Confirm the host before implementation.

## 1. URL rules

- Lowercase, hyphenated, no trailing slash except the root.
- One topic per URL.
- No dates or version numbers in URLs.
- Service URLs live under `/services/`.
- Project-type URLs live under `/project-types/`.
- Area URLs live under `/areas/`.
- FAQ category URLs live under `/faq/`.
- Arabic URLs mirror the English path under `/ar/`.
- Canonicals point to the English page unless the page is Arabic-only.
- hreflang pairs are reciprocal and only for published equivalents.
- No indexable search, thank-you, preview or API routes.

## 2. Phase 1 pages

### Core

| URL | Page | Priority | Index | Notes |
|---|---|---:|---|---|
| `/` | Home | 1.0 | yes | Primary service and route entry |
| `/about/` | About Abbadi Tech | 0.6 | yes | Entity, independence, method |
| `/how-we-work/` | How we work | 0.7 | yes | Process, documents, review, inspection |
| `/contact/` | Contact and project file | 0.8 | yes | Form, verified contact details |
| `/thank-you/` | Thank you | 0.1 | no | Post-submit |
| `/search/` | Site search | 0.1 | no | If built |
| `/404/` | Not found | 0.1 | no | Custom 404 |
| `/accessibility/` | Accessibility statement | 0.2 | yes | Audit and contact |
| `/privacy/` | Privacy notice | 0.2 | yes | Legal review |
| `/terms/` | Terms | 0.2 | yes | Legal review |
| `/cookies/` | Cookie notice | 0.2 | yes | Consent details |
| `/editorial-policy/` | Editorial and corrections policy | 0.3 | yes | Source and review method |

### Services

| URL | Page | Priority | Index | Primary intent |
|---|---|---:|---|---|
| `/services/` | Services hub | 0.9 | yes | Compare approval scopes |
| `/services/fit-out-electrical-approval/` | Fit-out electrical approval | 0.9 | yes | Commercial fit-out electrical review |
| `/services/electrical-load-upgrade/` | Electrical load upgrade | 0.8 | yes | Increase approved capacity |
| `/services/new-electricity-connection/` | New electricity connection | 0.8 | yes | Permanent new supply |
| `/services/new-water-connection/` | New water connection | 0.8 | yes | Permanent water supply |
| `/services/building-noc/` | Building NOC | 0.8 | yes | Building permit electricity/water NOC |
| `/services/load-schedule-sld/` | Load schedule and SLD | 0.8 | yes | Technical submission documents |
| `/services/lv-inspection-meter-connection/` | LV inspection and meter connection | 0.8 | yes | Inspection and energisation |
| `/services/temporary-construction-power/` | Temporary construction power | 0.7 | yes | Site power before permanent supply |
| `/services/meter-cable-shifting/` | Meter or cable shifting | 0.7 | yes | Asset relocation |
| `/services/shams-dubai-solar/` | Shams Dubai solar approval | 0.7 | yes | Solar connection |
| `/services/demolition-noc/` | Demolition NOC | 0.7 | yes | Services before demolition |
| `/services/infrastructure-noc/` | Infrastructure NOC and utility clearance | 0.7 | yes | Works near DEWA assets |

### Project types

| URL | Page | Priority | Index | Primary intent |
|---|---|---:|---|---|
| `/project-types/` | Project-types hub | 0.8 | yes | Choose a project route |
| `/project-types/commercial-fit-out/` | Commercial fit-out | 0.8 | yes | Office, retail, F&B, clinic fit-out |
| `/project-types/restaurant-kitchen/` | Restaurant and kitchen | 0.7 | yes | Kitchen load, water, grease, extract |
| `/project-types/clinic-medical/` | Clinic and medical | 0.7 | yes | Medical equipment, UPS, HVAC |
| `/project-types/warehouse-industrial/` | Warehouse and industrial | 0.7 | yes | Load, HV/LV, machinery |
| `/project-types/villa/` | Villa construction and renovation | 0.7 | yes | Connection, NOC, water, solar |
| `/project-types/school-nursery/` | School and nursery | 0.6 | yes | Fit-out, safety, load |
| `/project-types/hotel-hospitality/` | Hotel and hospitality | 0.6 | yes | Kitchen, laundry, pools, HVAC |
| `/project-types/infrastructure-utilities/` | Infrastructure and utilities | 0.6 | yes | NOC, asset conflict, corridors |

### Areas — Phase 1

| URL | Page | Priority | Index | Local-content requirement |
|---|---|---:|---|---|
| `/areas/` | Areas hub | 0.7 | yes | Explain coverage without claiming an office everywhere |
| `/areas/business-bay/` | Business Bay | 0.6 | yes | Local building/community context, verified evidence |
| `/areas/al-quoz/` | Al Quoz | 0.6 | yes | Industrial/fit-out context, verified evidence |
| `/areas/dubai-investment-park/` | Dubai Investment Park | 0.5 | yes | Industrial/warehouse context |
| `/areas/dubai-south/` | Dubai South | 0.5 | yes | New development context |
| `/areas/jumeirah-lakes-towers/` | Jumeirah Lakes Towers | 0.5 | yes | Tower/fit-out context |
| `/areas/deira/` | Deira | 0.5 | yes | Older district/retrofit context |
| `/areas/al-barsha/` | Al Barsha | 0.5 | yes | Mixed-use/fit-out context |
| `/areas/dubai-silicon-oasis/` | Dubai Silicon Oasis | 0.5 | yes | Free-zone/technology context |

### Areas — Phase 2

Only publish when each page has local content and a verified project or local evidence.

- `/areas/downtown-dubai/`
- `/areas/dubai-marina/`
- `/areas/bur-dubai/`
- `/areas/jumeirah/`
- `/areas/motor-city/`
- `/areas/arabian-ranches/`
- `/areas/al-furjan/`
- `/areas/dubailand/`
- `/areas/mirdif/`
- `/areas/al-warqa/`
- `/areas/international-city/`
- `/areas/jebel-ali/`
- `/areas/al-nahda/`
- `/areas/umm-suweim/`
- `/areas/palm-jumeirah/`
- `/areas/dubai-sports-city/`

### FAQ

| URL | Page | Priority | Index | Notes |
|---|---|---:|---|---|
| `/faq/` | FAQ hub | 0.8 | yes | Search, categories, 120+ planned questions |
| `/faq/sequencing/` | Choosing and sequencing | 0.6 | yes | Route order |
| `/faq/documents/` | Documents and landlord requirements | 0.6 | yes | File readiness |
| `/faq/technical/` | Technical design | 0.6 | yes | Load, SLD, protection, metering |
| `/faq/water/` | Water and utilities | 0.6 | yes | Water, drainage, boundaries |
| `/faq/process/` | Process and portal | 0.6 | yes | Status, comments, validity |
| `/faq/cost/` | Fees and commercial | 0.6 | yes | Only with verified fee policy |
| `/faq/inspection/` | Inspection and energisation | 0.6 | yes | Test pack, defects, meter release |
| `/faq/locations/` | Areas and free zones | 0.5 | yes | Local authority differences |
| `/faq/risk/` | Risk and compliance | 0.5 | yes | Rejections, penalties, unapproved work |
| `/faq/working-with-us/` | Working with Abbadi Tech | 0.5 | yes | Scope, roles, independence |

### Arabic mirror — Phase 1

- `/ar/`
- `/ar/services/`
- `/ar/services/fit-out-electrical-approval/`
- `/ar/services/electrical-load-upgrade/`
- `/ar/services/new-electricity-connection/`
- `/ar/services/new-water-connection/`
- `/ar/faq/`
- `/ar/contact/`

Do not publish Arabic URLs until the content is human-reviewed and the English page is live.

## 3. Redirects

### Legacy static site

| From | To | Code | Reason |
|---|---|---|---|
| `/index.html` | `/` | 301 | Legacy home |
| `/services.html` | `/services/` | 301 | Legacy service page |
| `/projects.html` | `/project-types/` | 301 | Legacy project page |
| `/areas-served.html` | `/areas/` | 301 | Legacy area page |
| `/contact.html` | `/contact/` | 301 | Legacy contact |
| `/pricing.html` | `/contact/` | 301 | No verified price list; route to scope |
| `/blog.html` | `/faq/` | 301 | No blog content; FAQ is the knowledge entry |
| `/sitemap.xml` | `/sitemap.xml` | 200 | Generated sitemap |
| `/robots.txt` | `/robots.txt` | 200 | Generated robots |
| `/vercel.json` | n/a | 410 | Deployment config, not content |
| `/server.js` | n/a | 410 | Legacy server file |
| `/package.json` | n/a | 410 | Legacy package file |
| `/css/style.css` | n/a | 410 | Legacy asset |
| `/js/main.js` | n/a | 410 | Legacy asset |
| `/images/*` | n/a | 410 | Legacy images have unknown rights |

### Query and duplicate patterns

- Strip `?utm_*` and other tracking parameters from canonical URLs.
- Redirect uppercase paths to lowercase.
- Redirect trailing-slash variants to the canonical form.
- Redirect `/services/fit-out-electrical-approval.html` to `/services/fit-out-electrical-approval/` if the old path exists.
- Redirect any `/author/...` or WordPress feed URLs to the home page or a 410.

## 4. Sitemap groups

Generate separate sitemaps if the site grows:

- `/sitemap.xml` — index.
- `/sitemap-pages.xml` — core and legal.
- `/sitemap-services.xml` — services.
- `/sitemap-project-types.xml` — project types.
- `/sitemap-areas.xml` — published areas only.
- `/sitemap-faq.xml` — FAQ hub and category pages.
- `/sitemap-ar.xml` — published Arabic pages.

Only include `200` indexable URLs. Do not include drafts, previews, search, thank-you or API routes.

## 5. Canonical and hreflang

For an English page:

```html
<link rel="canonical" href="https://dewaapprovals.abbaditech.ae/services/fit-out-electrical-approval/">
<link rel="alternate" hreflang="en-AE" href="https://dewaapprovals.abbaditech.ae/services/fit-out-electrical-approval/">
<link rel="alternate" hreflang="ar-AE" href="https://dewaapprovals.abbaditech.ae/ar/services/fit-out-electrical-approval/">
<link rel="alternate" hreflang="x-default" href="https://dewaapprovals.abbaditech.ae/services/fit-out-electrical-approval/">
```

Only add the Arabic alternate when the Arabic page is published and equivalent.

## 6. Noindex rules

- Preview deployments.
- CMS admin.
- Search results.
- Thank-you page.
- API routes.
- Any page with an unresolved `[VERIFY]` placeholder.
- Any area page without local content.
- Any service page without a source, reviewer and review date.

## 7. Launch checks

- Every sitemap URL returns `200`.
- Every `200` page has a canonical.
- Every indexable page has a unique title and H1.
- Every hreflang pair is reciprocal.
- Every legacy URL has a redirect or a deliberate `410`.
- No redirect chains longer than one hop.
- No orphan pages.
- No indexable page with `[VERIFY]`.
- Robots.txt does not block CSS, JS or the sitemap.
