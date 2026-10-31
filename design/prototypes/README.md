# Gate A page designs

These coded prototypes test the design system, not the final content. Open `index.html` in a local server, then review:

- `index.html` — home: title block, hero SLD, pathfinder, service register, project matrix, process, proof slot, coverage, FAQ preview, quote form.
- `services/fit-out-electrical-approval.html` — service template with answer box, document checklist, timing policy, comment table, inspection notes, FAQs and source block.
- `project-types/commercial-fit-out.html` — ranked approval sequence, document checklist, load drivers, pitfalls and inspection hand-off.
- `faq.html` — ten categories, search, category filters, deep-linkable questions, source and review placeholders.

## What is deliberately a placeholder

- Photographs and project facts: no stock, AI-generated or unverified project imagery is used. The proof section is a labelled layout proof.
- Registration, licence, address, email and phone: marked `[verify]` in the prototype.
- Timing ranges: withheld until the owner supplies anonymised job data.
- FAQ answers: draft copy for design review; every published answer needs an official source, a named reviewer and a review date.
- Arabic mirror: the language switch is present; the `/ar/` mirror is not built in this prototype.

## Run

From the repository root:

```powershell
npx serve .
```

Open `http://localhost:3000/design/prototypes/`.

## Screenshots

The `screenshots/` folder is generated locally with Chrome headless for owner review. It is not a substitute for testing on a device.
