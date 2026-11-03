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

### 2026-11-03: README written (German, one page)
- **Decision:** `README.md` in German with the three parts the task asks for: assumptions and why, what stood out in the documents, where the AI was wrong. Plus live link, repo link, start commands and a short "not verified" list.
- **Source:** Task PDF ("Eine kurze README (max. eine Seite)"), Preise-und-Produkte Nr. 5 and header date, Montagebedingungen §2, PROJECT.md findings 1-7 and A1-A7, Fenster Nord's reply of 2026-11-02. Re-read the PDFs before writing: no new contradiction with A1-A7.
- **Alternatives:** English README (rejected by the user: German requested).
- **Why:** Content comes from the "README checklist" below. The six AI mistakes are the ones with a visible symptom. Mentioned that `documents/` is not in the public repo.

### 2026-11-03: README extended: design assumptions, test findings
- **Decision:** New README section "Design-Annahmen" (flow, windows before system, presets, price breakdown, mobile rules, branding, preview-only elements). Added the three test-found AI mistakes and the 1-cent rounding note. Not added: animation feel, contrast (listed under not verified).
- **Source:** Task PDF ("Wie die Anwendung aussieht, welche Fragen sie stellt und in welcher Reihenfolge, entscheidest du"), PROJECT.md "UX direction", log entries "UX flow approved", "Design uses mvn.energy branding", "Typeface: Schibsted Grotesk". No contradiction with A1-A7.
- **Why:** The task asks for assumptions; design choices were decisions without a README home. README now exceeds one page by a little, see reply to the user.

### 2026-11-03: Three subagents, README updated
- **Decision:** Added `.claude/agents/test-writer.md`, `code-reviewer.md` (read-only: no Edit/Write) and `ux-ui-designer.md` (skills frontend-design, ui-ux-pro-max, web-design-guidelines; mobile points from Lovable's guide, only those that apply). README got a "Subagents" section and the summary-page decisions ("Rückruftermin", FAQ, nothing is sent). Landing steps reworded: headers stay nouns (Ort, Fenster, System, Richtpreis), the subtitle says the action.
- **Source:** none in `documents/`: tooling and README only. Summary-page copy see "Summary page redesigned for the demo".
- **Honest status in README:** only test-writer has run. code-reviewer and ux-ui-designer are created, not yet used. The earlier review used the `/code-review` skill.
- **Open, for the user:** (1) The summary title says "Anfrage verschickt!" although nothing is sent (the FAQ explains it). (2) The BEG FAQ shows a general funding sentence even when the chosen system has Uw > 0,95. CLAUDE.md says: BEG hint only for Uw ≤ 0,95. The sentence is general and promises nothing, but it is a conflict with the rule, not decided yet.

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

### 2026-11-02: Deployed on Vercel
- **Decision:** Live at https://fenster-nord.vercel.app/ (deployed by the user from `main`, static build, no backend, no environment variables).
- **Verified against the live URL (headless Chrome):** HTTP 200 from Vercel, logo and favicon load, title is correct, Schibsted Grotesk loads, no failed requests, no console errors. The JS bundle name (`index-DqI5Afk_.js`) is identical to a local build of commit `2d713cf`, so the live site is the current code. The full flow gives the same numbers as locally (1.616,20 € net, 1.923,28 € gross), the landing page reveals as designed, and there is no horizontal overflow at 320, 360, 430, 768 and 1280 px.
- **Still true on the live site:** the browser contacts `fonts.googleapis.com` and `fonts.gstatic.com` (see the privacy question in the README checklist).
- **Not verified:** a real phone.

### 2026-11-02: Repo published, `documents/` kept local
- **Decision:** Pushed to https://github.com/TARTARINCMD/fenster_nord (public, branch `main`). `documents/` is in `.gitignore`.
- **Why:** The repo is public. The customer PDFs and the interview notes in PROJECT.md shouldn't be published before submission. `data/produktliste.csv` is in the repo because the app needs it at build time.
- **Note:** `CLAUDE.md` refers to `documents/`, which isn't in the repo. Fine for the work here. Mention it in the README if reviewers need the sources.

### 2026-11-03: Test suite run, 3 production bugs found and fixed
- **Decision:** Ran the full Vitest suite (293 tests, 9 files). Both mandatory fixtures passed. Found 3 failing tests caused by production-code bugs, not bad tests; fixed the production code.
- **Source:** `src/lib/products.ts`, `src/lib/chatbot.ts`, test output.
- **Result:** 293/293 passing. See AI mistakes below for details of each fix.

### 2026-11-03: Code review, 3 further gaps found and fixed
- **Decision:** Ran `/code-review` at high effort (7 finder angles, 1-vote verify). Found 4 candidates; 3 were real and fixed, 1 was informational only (non-ASCII stem fragility — low risk in a UTF-8 repo).
- **Source:** diff of uncommitted working-tree changes; `src/lib/chatbot.ts`, `src/lib/pricing.test.ts`, `src/state.ts`, deleted `src/lib/ui-logic.test.ts`.
- **Fixed:** (1) Added `'rolläd'` stem so "Rolläden" (single-l + umlaut) reaches the shutter answer. (2) Created `src/state.test.ts` (15 tests) covering `reducer` cases `go`, `addWindow`, `updateWindow`, `removeWindow`, and `reset` — these had no coverage after `ui-logic.test.ts` was deleted. (3) Added `windowNet` assertion for stulp × qty=2 to `pricing.test.ts` to restore the coverage that was lost when fixture 2 switched from `windowNet` to `unitNet`.
- **Result:** 308/308 passing (10 test files). See AI mistakes below for details of gaps 1 and 2.

### 2026-11-03: Summary page redesigned for the demo
- **Decision:** (1) Title is now "Terminwunsch geschickt!" / "Anfrage verschickt!" with a mode-aware subtitle. (2) Removed the "Vorschau" warning notice — moved into the FAQ instead. (3) "Termin für das Aufmaß" renamed to **"Rückruftermin"**: the chosen slot is when the worker calls, not when they visit. (4) "Ort" section removed. (5) BEG notice removed from the main flow — it now lives in the FAQ under "Kann ich BEG-Förderung beantragen?" so the legal wording is still present but less prominent. (6) "So geht es weiter" bullet list replaced by a **FAQ accordion** (8 items: demo notice, next steps, delivery, Uw explained, BEG, colors, what's excluded, montage prep). (7) "Angaben ändern" and "Neu starten" buttons removed for the demo. (8) Single "Im Chat fragen" button at the bottom; floating chatbot button removed globally. (9) Logo tappable → dispatches `reset` → home (step 1).
- **Source:** User feedback from screenshots. BEG copy unchanged (see "BEG threshold inclusive"). Uw FAQ content from https://www.deutsche-fensterbau.de/u-wert/.
- **Why "Rückruftermin":** The appointment picker collects a time for an initial phone call, not for the on-site Aufmaß visit. Using "Aufmaß" for it was factually wrong.

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

### 2026-11-03: `parseGermanNumber('')` returned 0 instead of throwing
- **What the AI said:** `Number(''.trim().replace(',','.'))` evaluates to `Number('')` which is `0`, and `Number.isFinite(0)` is `true`, so the guard never fired for empty strings.
- **How noticed:** A test in `products.test.ts` expected a throw on empty input; the test failed.
- **Change:** Added an explicit empty-string guard before the `Number()` call in `src/lib/products.ts`.

### 2026-11-03: Chatbot didn't match "unverbindlich"
- **What the AI said:** The "verbindlich" topic used `w.startsWith('verbindlich')`. The tokenizer produces the single token `unverbindlich` for "Ist der Preis unverbindlich?", and `'unverbindlich'.startsWith('verbindlich')` is `false`, so the question fell through to the fallback.
- **How noticed:** A test in `chatbot.test.ts` asserting that "Ist der Preis unverbindlich?" triggers the binding-price answer failed.
- **Change:** Added `'unverbindlich'` as a keyword for that topic in `src/lib/chatbot.ts`.

### 2026-11-03: Chatbot didn't match "Rollläden" (umlaut mismatch)
- **What the AI said:** Keywords `rollladen`, `rolladen`, `rollo` were all checked via `startsWith`. The tokenizer produces `rollläden` (with ä) for "Was kosten Rollläden?", and `'rollläden'.startsWith('rollladen')` is `false` because `ä ≠ a`.
- **How noticed:** A test in `chatbot.test.ts` asserting that "Was kosten Rollläden?" triggers the shutter answer failed.
- **Change:** Replaced the full singular forms with stems (`'rolllad'`, `'rollläd'`) that cover both singular and plural via `startsWith`.

### 2026-11-03: Roller-shutter stem replacement missed "Rolläden" (single-l + umlaut)
- **What the AI said:** The replacement stems `'rolllad'`, `'rollläd'`, `'rollad'`, `'rollo'` were presented as complete coverage. None of them prefix-matches `'rolläden'` (single-l + umlaut): `'rolläden'[3]` is `ä` but `'rolllad'[3]` is `l`, `'rollläd'[4]` is `ä` but `'rolläden'[4]` is `d`, and `'rollad'[4]` is `a ≠ ä`.
- **How noticed:** Code review angle C traced the tokenizer output for "Rolläden". Confirmed with `node -e`.
- **Change:** Added `'rolläd'` as a fifth stem in `src/lib/chatbot.ts`. `'rolläden'.startsWith('rolläd')` is `true`.

### 2026-11-03: Splitting ui-logic.test.ts left state.ts with no test coverage
- **What the AI said:** When `src/lib/ui-logic.test.ts` was deleted and its contents split into module-specific test files, all seven tested modules were claimed to be covered. `src/state.ts` was not included in any new file.
- **How noticed:** Code review angle B (removed-behavior audit): the `reducer` cases `addWindow` and `go` (direction tracking) from the deleted file had no replacement. Confirmed by grepping all `*.test.ts` for imports of `../state`.
- **Change:** Created `src/state.test.ts` with 15 tests covering all reducer cases and `initialState`.

### 2026-11-03: Test-writer agent computed the VAT in a rounding test wrongly
- **What the AI said:** In the new rounding test (3 windows 1111 × 1111 mm) the `test-writer` subagent wrote VAT 397,57 by hand.
- **How noticed:** The test failed on the first run. Hand check: correct VAT is 397,61 (gross 2.490,28).
- **Change:** Expected values corrected in the test, production code was right.

---

## Open points and README checklist

Status of the code: pushed to https://github.com/TARTARINCMD/fenster_nord (`main`, last commit `2d713cf`), deployed at https://fenster-nord.vercel.app/. README is written (German, still to shorten to one page).

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
- The feel of the animations (only screenshots so far).
- Contrast of every text and color combination (yellow with white text is avoided by rule, nothing measured).

**Open question, privacy:** The font is loaded from Google Fonts (fonts.googleapis.com). For a German site this can be a data-protection problem (German courts have ruled against embedding Google Fonts from Google's servers without consent). Option: self-host the font files (for example the `@fontsource` package) so no request goes to Google. Not decided yet, not verified legally.

**Still to do:** test the live site on a real phone, README (one page, with the live link), mail to dinse@moovin.de and heymann@mvn.energy at the latest one working day before the interview.
