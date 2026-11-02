# Log

Decision journal for the Fenster Nord Richtpreis-Rechner. Newest entries at the bottom of each section.

Entry format:
```
### YYYY-MM-DD: Title
- **Decision:** what was decided / done
- **Source:** document + section (or "none: assumption")
- **Alternatives:** what else was considered
- **Why:** reasoning
```

---

## Decisions

### 2026-11-02: Stack
- **Decision:** Vite + React + TypeScript + Tailwind, Vitest for tests, deployed on Vercel. No backend.
- **Source:** Task PDF ("Link … z. B. Vercel, Netlify, GitHub Pages"; "Zusammenfassung auf dem Bildschirm reicht"); PROJECT.md "Suggested stack".
- **Alternatives:** Next.js.
- **Why:** Static SPA is enough without a backend, fastest setup, simple to extend live in the interview.

### 2026-11-02: Working assumptions A1–A7 adopted
- **Decision:** Use A1–A7 and the calculation order from PROJECT.md until Fenster Nord answers the clarification email (already sent).
- **Source:** PROJECT.md "Working assumptions".
- **Alternatives:** Wait for answers before building.
- **Why:** The time frame doesn't allow waiting. Each assumption is replaceable in `src/lib/`.

### 2026-11-02: Shutter not offered for fixed glazing
- **Decision:** For now, no Rollladen option on fixed-glazing windows. **Open, confirm with user.**
- **Source:** none: our own assumption (Preise-und-Produkte rule 4 has no such restriction).
- **Alternatives:** Allow shutters on every opening type.
- **Why:** PROJECT.md pseudocode has it, but the documents don't. Fixed windows can have shutters in practice, so this is a weak assumption.

### 2026-11-02: Volume discount applies to the final window price
- **Decision:** The 5 % (≥ 10 windows) applies to the sum of window prices after the fixed-glazing discount and the Stulp surcharge. Not to shutters or installation.
- **Source:** Preise-und-Produkte rule 6 ("5 % auf die Fensterpreise (nicht auf Montage)"); order unclear → PROJECT.md A5.
- **Alternatives:** Exclude the Stulp surcharge from the discount base.
- **Why:** "Fensterpreis" read as the full price of the window element.

### 2026-11-02: Sill length = window width
- **Decision:** If the customer chooses an inside sill, its length is the window width (in m) × quantity.
- **Source:** Montagebedingungen §2 (38 €/lfm) gives no length rule. Assumption.
- **Alternatives:** Ask the customer for the sill length separately.
- **Why:** Fewer questions for people who aren't experts. Checked at the measurement visit.

### 2026-11-02: BEG threshold inclusive (Uw ≤ 0,95)
- **Decision:** Nordic 68 (Uw 0,95) gets the BEG hint.
- **Source:** PROJECT.md finding 2 (BEG EM 17.07.2026, Anlage TMA Nr. 1.1: Uw ≤ 0,95).
- **Alternatives:** none.
- **Why:** The limit is "≤".

### 2026-11-02: Rounding at the end
- **Decision:** Calculate at full precision, round to cents only for display and the final total (VAT rounded once).
- **Source:** PROJECT.md fixture 2 ("rounded to cents at the end").
- **Alternatives:** Round per line.
- **Why:** Matches the fixture and avoids rounding drift.

### 2026-11-02: Design uses mvn.energy branding
- **Decision:** The app uses mvn.energy's look: logo and check-mark favicon, yellow `#F5C745` / green `#469878` / dark teal `#0F292E`, Plus Jakarta Sans (ExtraBold headings, Regular body, from Google Fonts). The copy still names Fenster Nord as the provider.
- **Source:** https://www.mvn.energy (HTML/CSS and logo SVG inspected 2026-11-02). Not in `documents/`: the task PDF leaves the look to us ("Wie die Anwendung aussieht … entscheidest du").
- **Alternatives:** Neutral Fenster Nord look with mvn colors as inspiration only, no logo.
- **Why:** Chosen by the user. Shows the company's brand was researched. Risk: the app looks like an mvn product while the customer is Fenster Nord, so be ready to explain this in the interview.
- **Assets** (saved in the session scratchpad, to be copied to `public/` at setup): logo SVG `92265b_8cc963ea6f514e72874053c4c7b3e8fa.svg`, `favicon.png`, `og.png`. The other logo SVG on the site returned 403.

---

## Steps

### 2026-11-02: Project kickoff
- **Decision:** Read all documents in `documents/`, created `CLAUDE.md` (mandatory doc check before big decisions) and this `log.md`. Plan: setup → pricing core + tests → mobile UI → deploy + README.
- **Source:** all files in `documents/`.

### 2026-11-02: Step 1, project setup done
- **Decision:** Scaffolded Vite + React 19 + TS in the repo root, added Tailwind 4 (`@tailwindcss/vite`) and Vitest. `git init` done, nothing committed yet. Brand tokens live in `src/index.css`. Logo and favicon are in `public/`.
- **Source:** CLAUDE.md "Conventions". `data/produktliste.csv` is a copy of `documents/Fenster-Nord_Produktliste.csv` (the original stays untouched).
- **Result:** `src/lib/products.ts` parses `;` and decimal commas into a typed `Product[]`. 6 tests pass (`npm test`), `npm run build` is clean.
- **Note:** `data/produktliste.csv` must be re-copied if Fenster Nord sends a corrected list.

---

## AI mistakes

### 2026-11-02: BEG limit cited from an outdated source
- **What the AI said:** Stated the Uw limit from model memory; the first citation was a 2023 version of the guideline.
- **How noticed:** Verified by search. The guideline of 17.07.2026 (in force 21.07.2026) replaced it. The KfW overview page doesn't contain the window rule (windows go through BAFA).
- **Change:** Use BEG EM 17.07.2026, Anlage TMA Nr. 1.1.

### 2026-11-02: "Antrag vor Vertragsabschluss"
- **What the AI said:** A first draft said the funding application must come before signing the contract.
- **How noticed:** Checked against the guideline text.
- **Change:** Correct wording: application before project start, with a conditional contract attached (Nr. 9.2.1).
