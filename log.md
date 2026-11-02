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

### 2026-11-02: Fenster Nord answered the clarification email (Frederik), A1–A7 confirmed
- **Decision:** All seven assumptions are now confirmed by the customer, not just working assumptions:
  1. **Installation:** Montagebedingungen apply (450 € flat + 60 € per old window). The 180 € per window is outdated. The inside sill (38 €/m) is **optional**, offered as an extra.
  2. **Funding:** per-system hint by Uw only, no blanket claim, no amount. Mention application before project start and check at measurement. They **don't offer** barrier-free or burglar-resistant versions, so the 1,1 exception doesn't apply.
  3. **VAT:** 19 %, gross prominent, net additionally.
  4. **Missing surcharges:** don't include, show "wird beim Aufmaß geklärt". Outside the service area: a notice instead of a price.
  5. **Order:** as in A5. Minimum area **also applies to fixed glazing**. "Ab 10 Fenstern" counts **pieces**. Discount applies to the window price including opening type (so the Stulp surcharge), not to shutters and installation.
  6. **Size:** ask for the existing window's size, with a short explanation and a note that it's checked at measurement.
  7. **Display:** single value with breakdown, labelled "unverbindlich". (Their words: "Deine Entscheidung", so this one is ours.)
- **Source:** reply from Fenster Nord (Frederik), received 2026-11-02, pasted by the user. Not in `documents/`.
- **Why it matters:** these were the main conflicts in the documents. For the README: customer confirmed, list the date. Supersedes "working assumptions" above for items 1–7, and confirms the volume-discount and BEG-threshold entries.
- **Still not answered:** shutter on fixed glazing (below), sill length, and whether the sill is per window or per order.

### 2026-11-02: Shutter allowed on fixed glazing (reversed)
- **Decision:** Rollladen is allowed on every opening type, fixed glazing included. Reverses the PROJECT.md pseudocode (user agreed). Listed in the README as "confirm at measurement", along with sill length = window width and sill chosen per window.
- **Original proposal (dropped):** no Rollladen option on fixed-glazing windows.
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

### 2026-11-02: UX flow approved (5 screens + summary)
- **Decision:** 1) Postcode + floor → 2) Windows → 3) System → 4) Price → 5) Request or appointment → summary. Windows come **before** the system, so step 3 can grey out systems that don't fit the sizes and show the total per system. **One system for the whole order**, to be named as a simplification in the README (per-window systems would need the product on `WindowItem` instead of `QuoteInput`).
- **Source:** Task PDF ("Menschen, die keine Fachleute sind und das am Handy machen"), PROJECT.md "UX direction", Fenster Nord reply Nr. 6 (ask for the existing window's size, short explanation, checked at measurement) and Nr. 1 (sill optional).
- **Added by the user:** contact form (name, phone/email, optional time), a fake **appointment picker** and a **scripted chatbot**. All three are labelled "Vorschau" or "Demo" and send nothing. The chatbot has fixed answers from the documents, no AI model, no backend, and never promises prices or funding.
- **Own additions, not from documents:** typical-size chips (60×60, 100×120, 120×140, 180×140) only prefill the form. Appointment slots are made up for the preview.
- **Alternatives:** system first (can't show price per system, size errors come later); per-window systems.

### 2026-11-02: Step 2, pricing core done
- **Decision:** `pricing.ts` (rules in one `RULES` object, each with its source), `validation.ts` (size limits, postcode, notices), `funding.ts` (Uw ≤ 0,95 hint). Order per window: minimum area → price per m² → fixed −15 % or Stulp +120 → sum → −5 % if ≥ 10 pieces → + shutters + installation (450 + 60 × pieces + optional sills) → 19 % VAT.
- **Source:** Preise-und-Produkte Nr. 1–6, Montagebedingungen §2–§5, Fenster Nord's reply (see above).
- **Result:** 39 tests pass, including both fixtures from PROJECT.md (663,60 € and 2.988,92 € gross), the 9 vs 10 boundary, size limits per system and all notices. Build and lint are clean.
- **Rounding:** only totals are rounded (net, VAT, gross). The shown components (windows, discount, shutters, installation) are rounded separately for display, so a breakdown can differ from the total by 1 cent in rare cases. Revisit if this shows up in the UI.
- **Not priced, by design:** two-person installation, scaffold, surcharge outside 20000–25999. The last one returns "no price" and a notice instead.

### 2026-11-02: Step 3, mobile UI done
- **Decision:** Five screens plus summary as approved, state in one `useReducer` (`src/state.ts`), no backend. Sizes typed in cm, stored in mm. Step 3 prices every system for the entered windows (`src/lib/systems.ts`) and greys out systems that don't fit, with the reason. Price screen shows net lines, then VAT, then gross, with the formula per window (area × €/m², minimum area, −15 %, +120 €). The footer button is fixed at the bottom, the chat button sits above it.
- **Source:** CLAUDE.md conventions, approved flow (see "UX flow approved").
- **Verified:** 51 unit tests, clean build and lint. Drove the whole flow in headless Chrome at 390×844 (postcode outside area blocks, empty-window errors, 2 windows with shutter and fixed glazing, Therm 82, appointment, summary, chatbot): no JS errors, the totals match the hand calculation (1.616,20 € net, 1.923,28 € gross). **Not yet checked:** a real phone, the deployed site.
- **Display choices:** extras (Stulp, Rollladen, Fensterbank) are shown gross on the window screen so the customer sees one tax basis. The breakdown stays net with VAT added at the end, so it adds up to the total.
- **Known limitation:** a single system for the whole order (see above), and the quote's rounding note from step 2.

### 2026-11-02: UX changes after the first review on the phone
- **Decision:** (1) New **landing page** as step 0, with hero, the 4 steps and 4 facts. (2) **Transitions**: direction-aware slide between screens, fade-up for cards and notices, slide-up chat, all off under `prefers-reduced-motion`. (3) The **chat button only appears on the summary screen**, "questions come last". (4) **Colored buttons**: primary yellow, secondary solid teal, link-style buttons soft green, chips yellow (filled when selected), quantity stepper teal. (5) **Removed "Wie Fenster 1 noch einmal hinzufügen"**, because the quantity stepper already covers identical windows. The remaining add button says "+ Weiteres Fenster mit anderen Maßen".
- **Source:** User feedback from looking at the app on a phone-size screen. Landing copy only uses facts from Preise-und-Produkte ("Wichtig für Kunden": unverbindlich, kostenloses Aufmaß, 6 bis 8 Wochen; Sortiment: Kunststoff, Holz, Holz-Alu, Alu) and Montagebedingungen §1 (Ausbau, Entsorgung, Einbau). The task brief says "in wenigen Minuten". No BEG claim and no invented numbers (no "3 Minuten", no customer counts). The page ends with a note that Fenster Nord is fictional, like the documents' footer.
- **Alternatives:** Keep the copy button (rejected: redundant with quantity, one more concept to explain). Chat on every screen (rejected by the user).
- **Technical note:** The slide animation moves only `<main>`. A transform on a parent would make the `position: fixed` footer jump during the animation.
- **Verified:** 52 tests, clean build and lint, browser run through the new flow without JS errors, chat button absent before the summary and present on it.

### 2026-11-02: Landing page made minimal
- **Decision:** The first screen shows only "Fenster Nord" and the slogan "Neue Fenster. Klarer Preis." (teal full screen, faint check-mark, "Mehr erfahren ↓"). Scrolling reveals "Der Ablauf" (4 steps, the connecting line draws itself, steps fade in one after another), "Das sollten Sie wissen" (4 facts) and then the button "Richtpreis berechnen", which is no longer a fixed footer. The sentence "Danach können Sie ein kostenloses Aufmaß anfragen" was removed.
- **Source:** User request. Facts unchanged, still from Preise-und-Produkte and Montagebedingungen (see "UX changes after the first review"). The slogan is marketing copy, not a claim from the documents.
- **Note:** Hidden state is a class that is swapped out when an element scrolls into view, so people with reduced motion don't end up with invisible content.
- **Verified:** In headless Chrome at 390 px: before scrolling all steps and facts are invisible, after "Mehr erfahren" they fade in, the button leads to step 1, no JS errors. 52 tests, build and lint clean. Not yet checked on a real phone.

### 2026-11-02: Choice cards look clickable, bigger scroll cue
- **Decision:** All option cards (floor, opening type, system) and the "Rückmeldung abwarten / Termin wählen" toggle get a radio circle (`RadioDot` in `ui.tsx`): empty ring when not selected, filled green with a white check when selected. "Mehr erfahren" and the arrow on the landing page are bigger (text-xl bold, arrow 48 px) and fully white.
- **Source:** User feedback from a screenshot of step 3: the cards looked like plain boxes, with only a green border to show the selection.
- **Why:** A visible control is the usual signal for "tap to choose" and works for people who don't notice a border color. The disabled systems get a faded ring.
- **Verified:** Screenshots of step 3 with and without a selection, 52 tests, clean build and lint, no JS errors.

### 2026-11-02: Repo published, `documents/` kept local
- **Decision:** Pushed to https://github.com/TARTARINCMD/fenster_nord (public, branch `main`). `documents/` is in `.gitignore`.
- **Why:** The repo is public. The customer PDFs and the interview notes in PROJECT.md shouldn't be published before submission. `data/produktliste.csv` is in the repo because the app needs it at build time.
- **Note:** `CLAUDE.md` refers to `documents/`, which isn't in the repo. Fine for the work here. Mention it in the README if reviewers need the sources.

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

### 2026-11-02: Copying a window gave the copy no id
- **What the AI said:** `createDraft({ ...last, id: undefined })` to copy a window. In the first version the spread came after the default `id`, so the copy got `id: undefined`.
- **How noticed:** Found while reviewing my own code before running it. Would have broken keys and edits of copied windows.
- **Change:** `id` is assigned after the spread (`partial.id ?? newId()`). The copy-window feature was removed later (see "UX changes after the first review"), the fix stays in `createDraft`.

### 2026-11-02: Chatbot keywords matched parts of words
- **What the AI said:** First matching used `includes()`. The keyword "beg" would match "Baubeginn" and send a funding answer, "ust" would match "Austausch" and send the VAT answer.
- **How noticed:** Reviewing the keyword list before the first run. Test "Beginn does not trigger the BEG answer" added.
- **Change:** Short keywords (≤ 4 letters) must match a whole word, longer ones match the start of a word. "ust" was replaced by "umsatzsteuer".

### 2026-11-02: Uw shown as "0,9" instead of "0,90"
- **What the AI said:** The funding hint printed `String(0.9)` as "0,9 W/(m²K)", while the product list and the system cards show "0,90".
- **How noticed:** On the screenshot of the price screen, not in the tests. Unit tests passed because no test looked at the number format.
- **Change:** `toFixed(2)` and a test for "Uw-Wert von 0,90 W/(m²K)".
