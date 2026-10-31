# Abbadi Tech — Utility Approvals

Independent Dubai consultancy for DEWA electricity and water approvals, NOCs, connections, load upgrades and Shams Dubai.

> Abbadi Tech is an independent consultancy and is not affiliated with DEWA.

## Status

**Gate A — foundation and page designs complete, awaiting owner sign-off.** No production build is approved yet. The previous static site is archived under `_legacy/` and must not be deployed. Start with `docs/README.md` and record decisions in `docs/GATE_A_SIGNOFF.md`.

## What is in this repository

- `docs/` — reference trace, product brief, design system, technical rules, sitemap, claim register and delivery plan.
- `design/prototypes/` — coded page designs for owner review, built from the design tokens.
- `_legacy/` — the superseded static site, kept only for asset recovery and redirect planning.
- `.github/workflows/` — CI definition to be activated with the application scaffold after Gate A.

## View the page designs

The prototypes are static and self-contained. Serve the repository root with any static server:

```powershell
npx serve .
```

Then open `http://localhost:3000/design/prototypes/`.

## Brand assumption

The working brand is **Abbadi Tech**, legal entity **Abbadi Tech Technical Solutions LLC**. The canonical host is assumed to be `https://dewaapprovals.abbaditech.ae` because it is the existing subdomain. The brand is not named "DEWA …" and the site will carry the independence notice on every page.

## Before publication

Read `docs/claims-to-verify.md`. Registration numbers, licence details, address, email, project facts, photographs, review consent and any timing ranges must be verified before they appear in public copy.
