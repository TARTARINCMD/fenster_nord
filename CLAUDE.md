# CLAUDE.md: Fenster Nord Richtpreis-Rechner

Interview task for mvn.energy. A mobile-first web app: a homeowner enters their windows and gets a non-binding rough price (Richtpreis) they can follow, then requests a free measurement visit (Aufmaß). The summary is only shown on screen. Budget: 4–5 h.

## Source of truth: `documents/`

| File | Covers |
|---|---|
| `documents/0-Aufgabe_Angebotsrechner-Fenster-Nord.pdf` | The task: what to build, deliverables, README requirements, time frame |
| `documents/Fenster-Nord_Preise-und-Produkte.pdf` | Pricing rules 1–6, BEG claim, net prices, notes for customers (internal working document) |
| `documents/Fenster-Nord_Montagebedingungen.pdf` | Installation scope and prices, two-person installation > 3,0 m², service area by postcode, customer prerequisites |
| `documents/Fenster-Nord_Produktliste.csv` | The 6 systems: Uw, €/m² net, min/max width and height (mm, outer frame size) |
| `documents/PROJECT.md` | Our brief: findings, working assumptions A1–A7, calculation order, test fixtures, UX direction |

**Do not change files in `documents/`.** They are treated as the customer's real documents.

## MANDATORY: check the documents before big decisions

A **big decision** is any of the following:
- a pricing rule, the calculation order, rounding, discounts or surcharges
- product data or size limits
- funding wording (BEG/BAFA)
- customer copy with legal weight (non-binding, VAT, net/gross, delivery time)
- the UX flow: which questions are asked, in what order, and what is optional
- the stack, a new dependency, deploy or hosting
- anything that changes what the README says

**Before acting on a big decision you MUST:**
1. Re-read the relevant section of the documents. Don't rely on memory.
2. Cite it in your reply (file + section/rule number, short quote).
3. Check it against assumptions A1–A7 and the calculation order in `documents/PROJECT.md`.
4. If the documents contradict each other, say nothing about it, or contradict an assumption: **stop and ask the user.** Never resolve it silently.
5. Add an entry to `log.md`.

Small things (styling, refactors, variable names, copy tweaks without legal weight) don't need this.

## Hard rules
- All pricing logic lives in `src/lib/` as pure functions with Vitest tests. No prices or rules in UI components.
- Product data comes from the CSV only. Don't hard-code it.
- Test fixtures from PROJECT.md must always pass: 663,60 € (fixture 1) and 2.988,92 € gross (fixture 2).
- BEG: show a hint only for Uw ≤ 0,95. Never give a funding amount, never promise funding.
- Price is always labelled **"unverbindlich"**. Gross is shown prominently and net as well (19 % VAT, assumption A3).
- Missing prices (two-person installation, scaffold, outside service area) are never invented. Show a notice instead.

## AI-mistake rule
Whenever an AI output turns out to be wrong (code, math, facts, legal or funding claims), add it immediately to the **AI mistakes** section of `log.md`: what it said, how it was noticed, what was changed. The README depends on this.

## Logging
`log.md` is the decision journal. Log decisions, major steps (setup, deploy, milestones) and AI mistakes. Use the format given in that file.

## Conventions
- Stack: Vite + React + TypeScript + Tailwind, Vitest, deployed on Vercel. No backend.
- Commands: `npm run dev`, `npm test`, `npm run build`.
- Layout: `data/produktliste.csv`, `src/lib/{products,pricing,validation,funding}.ts`, `src/lib/*.test.ts`, `src/components/`, `README.md` (at most one page).
- UI copy in German with the formal "Sie". Code, comments and docs in English.
- Mobile first: 375px width, 16px gutter, touch targets ≥ 44px, one question per screen.
- Design: mvn.energy branding (see log.md, "Design uses mvn.energy branding"). Yellow `#F5C745`, green `#469878`, dark teal `#0F292E`, typeface Schibsted Grotesk (see log.md, "Typeface: Schibsted Grotesk"). No tabular numerals (they break the punctuation in this font). Define them once as Tailwind theme tokens, never as scattered hex values. Check text contrast (yellow with white text fails, use dark teal on yellow).
- Sizes are entered in cm in the UI and stored in mm internally.
