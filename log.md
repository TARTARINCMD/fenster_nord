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
- **Decision:** The app uses mvn.energy's look: logo and check-mark favicon, yellow `#F5C745` / green `#469878` / dark teal `#0F292E`. The typeface was first Plus Jakarta Sans (mvn's own) and was replaced, see "Typeface: Schibsted Grotesk". The copy still names Fenster Nord as the provider.
- **Source:** https://www.mvn.energy (HTML/CSS and logo SVG inspected 2026-11-02). Not in `documents/`: the task PDF leaves the look to us ("Wie die Anwendung aussieht … entscheidest du").
- **Alternatives:** Neutral Fenster Nord look with mvn colors as inspiration only, no logo.
- **Why:** Chosen by the user. Shows the company's brand was researched. Risk: the app looks like an mvn product while the customer is Fenster Nord, so be ready to explain this in the interview.
- **Assets:** logo SVG is `public/mvn-logo.svg` (from `92265b_8cc963ea6f514e72874053c4c7b3e8fa.svg`), favicon is `public/favicon.png`. `og.png` was downloaded but is not used. A second logo SVG on the site returned 403.

### 2026-11-02: Typeface: Schibsted Grotesk
- **Decision:** Headings and body use Schibsted Grotesk (weights 400, 600, 700, 800, Google Fonts), set once as `--font-sans` in `src/index.css`. Replaces Plus Jakarta Sans.
- **Source:** None in `documents/`. User request: the old font "looks too AI-ish, every default Claude project uses this one". Plus Jakarta Sans is the font on mvn.energy's own site, so this departs from their typography. Colors and logo still follow mvn.
- **Alternatives offered:** Fraunces + DM Sans (warm serif), Archivo (industrial), Bricolage Grotesque + Hanken Grotesk (playful).
- **Why:** A sturdy grotesque with a Northern European, practical character fits a Hamburg craft business and stays easy to read on a phone. Less common than the usual geometric sans.
- **Not used:** Tabular numerals. In this font they also widen the punctuation ("1 . 923 , 28 €"), see AI mistakes.
- **Verified:** The font loads in headless Chrome (`document.fonts.check`), price and breakdown screens checked on a screenshot, 52 tests, clean build and lint.

---

## Steps

### 2026-11-02: Project kickoff
- **Decision:** Read all documents in `documents/`, created `CLAUDE.md` (mandatory doc check before big decisions) and this `log.md`. Plan: setup → pricing core + tests → mobile UI → deploy + README.
- **Source:** all files in `documents/`.

### 2026-11-02: Step 1, project setup done
- **Decision:** Scaffolded Vite + React 19 + TS in the repo root, added Tailwind 4 (`@tailwindcss/vite`) and Vitest. `git init` done (first commit and push: see "Repo published"). Brand tokens live in `src/index.css`. Logo and favicon are in `public/`.
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
- **Decision:** Five screens plus summary as approved, state in one `useReducer` (`src/state.ts`), no backend. Sizes typed in cm, stored in mm. Step 3 prices every system for the entered windows (`src/lib/systems.ts`) and greys out systems that don't fit, with the reason. Price screen shows net lines, then VAT, then gross, with the formula per window (area × €/m², minimum area, −15 %, +120 €). The footer button is fixed at the bottom. (The chat button first sat above it, it was later moved to the summary only.)
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

### 2026-11-02: Responsive check at five widths, sideways-scroll bug fixed
- **Decision:** After reading Lovable's guide on responsive design (https://lovable.dev/guides/responsive-web-design-techniques-that-work) I took over only what applies: (1) test at several widths, not only 390 px, (2) font sizes in rem so they follow the user's text-size setting, (3) width and height on images. Skipped as not relevant here: container queries, `srcset`/`<picture>`, lazy loading, AVIF (the only images are an SVG logo and one PNG). The guide's statistics (Renault, Sentry, traffic shares) are marketing numbers and are not used.
- **Found:** At 320, 360 and 430 px (mobile emulation) the landing page, system, price and summary screens could be dragged sideways by 28 px. At 768 and 1280 px there was no problem. Cause: the screen slide-in starts at `translateX(28px)`, the content briefly sticks out on the right, and mobile Chrome widens the page and does not shrink it back.
- **Fix:** `overflow-x: clip` on `html, body` in `src/index.css`. After it: no horizontal overflow at 320, 360, 430, 768 and 1280 px on any screen (landing to summary).
- **Also:** all `text-[Npx]` sizes became rem (`text-[0.9375rem]` etc.), the landing heading uses `clamp(2.25rem, 10vw, 2.75rem)` so "Fenster Nord" fits a 320 px screen, and the logo has `width`/`height`.
- **Verified:** 52 tests, build and lint clean, no JS errors, flow and landing page rechecked in headless Chrome. Smallest text on the page is 15 px.
- **Not done:** two-column layout on wide screens (the task is about phones, the narrow column on a desktop is acceptable).

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

### 2026-11-02: Tabular numerals made the prices look broken
- **What the AI said:** When picking the new font I suggested switching prices to tabular numerals "so the digits line up", and added `tabular-nums` to the total, the system prices and the breakdown.
- **How noticed:** On the screenshot of the price screen: the total read "1 . 923 , 28 €" and the breakdown "663 , 60 €". In Schibsted Grotesk the tabular feature also widens the punctuation. Tests can't catch this.
- **Change:** Removed `tabular-nums` everywhere. Right-aligned amounts are still readable. Lesson: check typographic features on the real font before recommending them.


### 2026-11-02: Blamed the wrong element for the sideways scroll
- **What the AI said:** First diagnosis: the faint rotated check-mark image on the landing page makes the page wider. Its bisect "proved" it, because hiding the image made the overflow disappear. I changed the image twice (paint containment, then a background image) and wrote a code comment that blamed it.
- **How noticed:** The overflow stayed, with the image gone. The numbers gave it away: the page was always exactly 28 px too wide, which is the `translateX(28px)` of the slide animation. Any style change in the test had made the browser re-fit its viewport, so hiding anything "fixed" it.
- **Change:** Reverted both image changes (including the wrong comment), clipped horizontal overflow on `html, body`, and checked all screens at five widths.

---

## Open points and README checklist

Status of the code: everything up to the Schibsted Grotesk font and this checklist is pushed to https://github.com/TARTARINCMD/fenster_nord (`main`, last commit `a79c820`, pushed by the user). Changes made after that commit are not on GitHub yet. Deploy on Vercel is **not done**. README is **not written**.

**Assumptions to name in the README** (the customer confirmed items 1 to 7 of A1–A7 by email on 2026-11-02, the rest are ours):
- One system for the whole order (simplification, per-window systems are a small change).
- Sill length = window width, sill chosen per window. Confirm at measurement.
- Rollladen allowed on fixed glazing (Preise-und-Produkte Nr. 4 has no restriction, PROJECT.md pseudocode had one).
- Window size is the outer frame size, taken from the old window (customer confirmed).
- Single price value, not a range (customer left it to us).
- Typical-size chips, appointment slots and the chatbot answers are our own UX additions. Chatbot is scripted, no AI model.
- Rounding: only totals are rounded, so a breakdown can differ by 1 cent in rare cases.
- Two-person installation, scaffold and the surcharge outside 20000–25999 are never priced, only announced.

**What stood out in the documents** (findings for the README):
1. Installation price conflict: 180 € per window (Preise-und-Produkte) against 450 € + 60 € per window + sills (Montagebedingungen). For 8 windows 1.440 € against 930 €. Break-even at 3,75 windows. The customer says the 180 € is outdated, although that sheet has the **later date** (01.09.2026) than the Montagebedingungen (03/2026).
2. The BEG claim "all 3-fach windows qualify" is wrong. BEG EM of 17.07.2026 (Anlage TMA Nr. 1.1) needs Uw ≤ 0,95. Slim 75 (1,0) and Classic 70 (1,1, only 2-fach) don't qualify, Nordic 68 (0,95) sits exactly on the limit. Application before project start with a conditional contract (Nr. 9.2.1), energy efficiency expert (Nr. 9.3).
3. All prices are net, but the customers are private people: gross is shown prominently, net additionally (19 %).
4. Missing prices: two-person installation above 3,0 m², scaffold from the 2nd floor, surcharge outside the service area.
5. The order of the price rules is not stated (minimum area, fixed discount, Stulp, volume discount). Customer confirmed ours.
6. Dimensions: outer frame size in mm in the CSV, cm in the PDF example, customers only know the old window. The CSV also mixes number formats ("1,0" and "0,90"), uses semicolons and decimal commas.
7. The price sheet is marked "interne Arbeitsunterlage", so the BEG sales argument isn't meant for customers.

**AI mistakes for the README:** see the section above. Keep it honest and specific: 2 from before the build (BEG source, "vor Vertragsabschluss"), then the window copy id, chatbot keyword matching, "0,9" instead of "0,90", tabular numerals, the wrongly blamed image behind the sideways scroll.

**Not verified yet:**
- A real phone (so far only headless Chrome with touch emulation, at 320, 360, 390, 430, 768 and 1280 px).
- The deployed site.
- The feel of the animations (only screenshots so far).
- Contrast of every text and color combination (yellow with white text is avoided by rule, nothing measured).

**Open question, privacy:** The font is loaded from Google Fonts (fonts.googleapis.com). For a German site this can be a data-protection problem (German courts have ruled against embedding Google Fonts from Google's servers without consent). Option: self-host the font files (for example the `@fontsource` package) so no request goes to Google. Not decided yet, not verified legally.

**Still to do:** commit and push, deploy on Vercel, test on a phone, README (one page), mail to dinse@moovin.de and heymann@mvn.energy at the latest one working day before the interview.
