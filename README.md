# Fenster Nord Richtpreis-Rechner

Mobile-first Web-App: Hauseigentümer geben ihre Fenster an, sehen einen unverbindlichen Richtpreis mit Aufschlüsselung und können ein kostenloses Aufmaß anfragen (nur Zusammenfassung auf dem Bildschirm, es wird nichts verschickt).

**Live:** https://fenster-nord.vercel.app/

Vite + React + TypeScript + Tailwind, Vitest, kein Backend. Start: `npm run dev`, Tests: `npm test`. Alle Preisregeln stehen als reine Funktionen in `src/lib/`, die Produktdaten kommen nur aus `data/produktliste.csv`. Die Kundenunterlagen (`documents/`) liegen bewusst nicht im öffentlichen Repo.

## Annahmen und warum

Die sieben größten Lücken habe ich Fenster Nord per Mail gefragt. Die Antwort (2.11.) bestätigt meine Annahmen:

- **Montage:** Montagebedingungen gelten (450 € pauschal + 60 € je Altfenster), die 180 € je Fenster sind veraltet. Fensterbank (38 €/m) ist optional.
- **Rechenreihenfolge:** Mindestfläche (auch bei Festverglasung) → Preis/m² → −15 % fest bzw. +120 € Stulp → ab 10 Fenstern (Stück) −5 % auf Fensterpreise inkl. Aufpreisen, nicht auf Rollladen und Montage → 19 % USt. Gerundet wird nur bei den Summen, Einzelpositionen können deshalb selten um 1 ct abweichen.
- **Anzeige:** Brutto groß, netto zusätzlich, ein Wert statt Spanne, überall „unverbindlich“.
- **Maße:** Der Kunde gibt das Maß des alten Fensters ein (in cm, intern mm), wird beim Aufmaß geprüft.
- **Nicht bepreist, nur Hinweis:** Zwei-Mann-Montage (> 3,0 m²), Gerüst ab 2. OG, Anfahrt außerhalb PLZ 20000–25999 (dort kein Preis, nur Hinweis).

Meine eigenen, noch **nicht bestätigten** Annahmen: ein System für den ganzen Auftrag (vereinfacht), Fensterbanklänge = Fensterbreite, Rollladen auch bei Festverglasung erlaubt (die Unterlagen schließen es nicht aus). Typische Maße, Terminvorschläge und der Chatbot (feste Antworten, kein KI-Modell) sind eigene Zusätze und als Vorschau gekennzeichnet.

## Design-Annahmen

Die Aufgabe lässt Aussehen, Fragen und Reihenfolge offen und nennt Laien am Handy als Zielgruppe. Meine Entscheidungen:

- **Eine Frage pro Bildschirm, Fenster vor System:** PLZ und Etage → Fenster → System → Preis → Anfrage. Erst die Maße, damit nicht passende Systeme ausgegraut sind und jedes System seinen Preis zeigt.
- **Wenig tippen:** typische Maße als Schnellauswahl, Menge per Plus/Minus, Fachbegriffe (Dreh-Kipp, Festverglasung, Stulp, Uw) in einem Satz erklärt, Maße in cm mit Hinweis „altes Fenster von außen messen“.
- **Preis nachvollziehbar:** Brutto zuerst, darunter der Rechenweg je Fenster (Fläche × €/m², Mindestfläche, −15 %, +120 €), dann die Hinweise.
- **Handy zuerst:** 375 px, 16 px Rand, Tippflächen ≥ 44 px, Auswahlkarten mit Radiopunkt, getestet von 320 bis 1280 px. Animationen entfallen bei „reduzierte Bewegung“.
- **Optik:** mvn.energy-Farben und Logo, Schibsted Grotesk statt der mvn-Schrift (weniger Standard-Look). Risiko: Die App wirkt wie ein mvn-Produkt, Anbieter bleibt Fenster Nord.
- **Nichts wird gesendet:** Der Button „Anfrage absenden" und „Termin verbindlich buchen" lösen keinen Versand aus — die App hat kein Backend. Am Ende erscheint nur eine Zusammenfassung auf dem Bildschirm, ein Eintrag in den Fragen am Ende sagt das offen („Wurde meine Anfrage wirklich verschickt?“ – nein, Demo). Gleiches gilt für den Chatbot (feste Antworten, kein KI-Modell).
- **„Rückruftermin“ statt „Aufmaß-Termin“:** Der gewählte Zeitraum ist der Anruf, bei dem das Aufmaß vereinbart wird, nicht der Besuch. Alles Weitere (Lieferzeit, Uw, BEG, Farben, Vorbereitung) steht als aufklappbare Fragen am Ende statt als Textwand.

## Was mir an den Unterlagen aufgefallen ist

1. **Montage widersprüchlich:** 180 € je Fenster (Preise und Produkte, Nr. 5) gegen 450 € + 60 € je Fenster (Montagebedingungen §2). Bei 8 Fenstern 1.440 € gegen 930 €. Seltsam: Das Preisblatt ist das neuere (ab 01.09.2026 gegen Stand 03/2026), gilt laut Kunde aber als veraltet.
2. **BEG-Aussage falsch:** „Alle 3-fach-Fenster erfüllen die BEG-Anforderungen“ stimmt nicht. Die BEG EM vom 17.07.2026 verlangt Uw ≤ 0,95 (Anlage TMA Nr. 1.1). Slim 75 (1,0) fällt raus, Nordic 68 (0,95) liegt genau auf der Grenze. Die App zeigt nur bei Uw ≤ 0,95 einen vorsichtigen Hinweis (Antrag vor Vorhabenbeginn, Prüfung beim Aufmaß), nie einen Betrag.
3. **Nettopreise für Privatkunden:** Brutto muss im Vordergrund stehen.
4. **Fehlende Preise:** Zwei-Mann-Montage, Gerüst, Anfahrtszuschlag.
5. **Reihenfolge der Preisregeln** ist nicht festgelegt (Mindestfläche, Festverglasung, Stulp, Mengenrabatt).
6. **Maße:** Außenmaß Blendrahmen in mm in der CSV, Beispiel in cm, Laien kennen nur ihr altes Fenster. Die CSV mischt Formate („1,0“ und „0,90“), Semikolon, Dezimalkomma.
7. **„Interne Arbeitsunterlage“:** Das BEG-Verkaufsargument ist nicht für Kunden gedacht.

## Wo die KI falsch lag

- **BEG-Grenze** zuerst aus dem Gedächtnis genannt, die erste Quelle war eine veraltete Fassung von 2023. Per Suche geprüft, gilt die Richtlinie vom 17.07.2026.
- **„Antrag vor Vertragsabschluss“** stand in einem Entwurf. Die Richtlinie sagt: vor Vorhabenbeginn, mit auflösend bedingtem Vertrag (Nr. 9.2.1). Beim Gegenlesen des Richtlinientexts gemerkt.
- **Uw „0,9“ statt „0,90“:** Tests grün, aber im Screenshot sichtbar. Jetzt `toFixed(2)` mit Test.
- **Tabellenziffern** (`tabular-nums`) empfohlen: In Schibsted Grotesk wird der Preis zu „1 . 923 , 28 €“. Nur im Screenshot aufgefallen, wieder entfernt.
- **Chatbot-Schlagwörter** per `includes()`: „beg“ träfe „Baubeginn“. Beim Durchlesen vor dem ersten Lauf gefunden, jetzt Wortanfang bzw. ganzes Wort. Der Wortanfang-Ansatz verfehlte dann „unverbindlich“ und „Rollläden“/„Rolläden“. Das haben erst die Tests und ein Code-Review gezeigt.
- **Leerer CSV-Wert wurde zu 0:** `Number('')` ist 0, eine leere Zelle wäre Preis 0 oder Uw 0 (besteht den BEG-Check) geworden. Ein Test schlug fehl, jetzt wirft der Parser.
- **Tests weggefallen:** Beim Aufteilen der alten Testdatei blieb `state.ts` ohne Test, obwohl „alles abgedeckt“ gemeldet war. Das Review fand es, jetzt 308 Tests.
- **Falsche Ursache beim Seitwärts-Scrollen:** Die KI beschuldigte ein Hintergrundbild, ihr Test „bewies“ es scheinbar. Die Seite war aber immer genau 28 px zu breit, wie das `translateX(28px)` der Animation. Ursache war die Animation, behoben mit `overflow-x: clip`, geprüft bei fünf Breiten.

## Subagents

Drei Subagents liegen in `.claude/agents/` (je eine Markdown-Datei mit Rolle, erlaubten Werkzeugen und Regeln aus `CLAUDE.md`):

- **test-writer** schreibt Vitest-Tests für `src/lib/`. Er ändert nur Testdateien, erwartete Werte rechnet er aus den Unterlagen von Hand und kopiert sie nicht aus dem Code. Fehler im Code meldet er, er repariert sie nicht. Er schrieb die 293 Tests neu (mit beiden Fixtures) und fand drei Fehler im Code, die ich danach behoben habe. Eigener Fehler: Eine USt in einem Rundungstest hatte er falsch gerechnet, der Testlauf zeigte es.
- **code-reviewer** liest nur und kann nichts ändern. Er prüft Änderungen gegen die Regeln in `CLAUDE.md` (Preislogik nur in `src/lib/`, BEG-Wortlaut, „unverbindlich“, keine erfundenen Preise), startet Tests, Lint und Build und gibt Befunde nach Schwere aus.
- **ux-ui-designer** prüft Mobile-Bedienung und Optik und darf die Oberfläche ändern. Nicht ohne Rückfrage: Preislogik, Fragenablauf, rechtlich relevante Texte, Markenfarben und Schrift.

Die Grenzen stehen im Text der Agents, technisch erzwungen werden nur die Werkzeuge (der Reviewer hat kein Edit/Write). Eingesetzt wurde bisher nur der test-writer. Das Code-Review davor lief über den Skill `/code-review`, der Reviewer-Agent und der UX-Agent sind angelegt, aber noch nicht gelaufen.

## Nicht geprüft

Echtes Handy (bisher nur Headless-Chrome mit Touch-Emulation), Kontrast aller Farbkombinationen. Die Schrift wird von Google Fonts geladen, aus Datenschutzsicht (DSGVO) besser selbst hosten.
