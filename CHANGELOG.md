# Änderungsprotokoll

## 2026-11-21 – Zweites News-Segment: monatliches Rechts-Update

### Was geändert wurde

- `/news` hat zwei Segmente: den bisherigen täglichen Überblick (News-PoC) und das neue monatliche Rechts-Update. Oben stehen beide Segmente mit kurzer Beschreibung; der PoC-Streifen auf `/news` sagt, dass er für den täglichen Überblick gilt.
- Neue Seiten `/news/rechts-update/JJJJ-MM/` mit Kurzüberblick, Themen (Status, Inhalt, Quellen), Fristen und Änderungen. Sie tragen statt der PoC-Kennzeichnung einen eigenen Hinweis zu Zweck, KI-Unterstützung und Grenzen.
- Quelle `src/content/rechts-update.json`. Nur Ausgaben mit Freigabestatus „freigegeben“ und Freigabedatum werden gebaut; Entwürfe erscheinen weder als Seite noch im JavaScript. `scripts/check-rechts-update.mjs` prüft das im Build, `scripts/rechts-update.test.mjs` prüft die Regeln.
- Erste Ausgabe (November 2026) als Entwurf angelegt.
- `src/pages/Impressum.tsx`: Abschnitt „Grundlegende Richtung von dangulea.at (§ 25 Abs. 4 MedienG)“. Im Abschnitt zu KI-Unterstützung und in der Datenschutzerklärung steht jetzt je Bereich das eingesetzte Werkzeug: Codex (OpenAI) für den täglichen Überblick, Perplexity für die Rubrik „Aktuelle Themen“, Claude (Anthropic) für das Rechts-Update. Vorher war pauschal Perplexity für die News genannt, obwohl der tägliche Überblick mit Codex entsteht.
- Ablauf und Regeln: `docs/rechts-update.md`.

### Warum

- Auf Wunsch des Betreibers: Die monatlichen Rechts-Updates benötige ich für meine eigenen Zwecke, vor allem für mein Studium, außerdem zur Weiterbildung und um rechtlich aktuell zu bleiben.
- Art. 50 Abs. 4 KI-Verordnung: KI-erzeugte Texte zu Angelegenheiten von öffentlichem Interesse sind offenzulegen, außer sie wurden inhaltlich geprüft und jemand trägt die redaktionelle Verantwortung. Das Segment legt beides offen. Die Freigabe ist deshalb technisch erzwungen und nicht nur beschrieben.
- § 25 MedienG: Eine Website mit Inhalten über die Selbstdarstellung hinaus braucht die volle Offenlegung mit grundlegender Richtung. Diese fehlte im Impressum.
- Das Segment ist allgemeine Information und keine Rechtsberatung; das steht bei jeder Ausgabe.

## 2026-11-16 – Impressum an österreichisches Recht angepasst

### Was geändert wurde

- `src/pages/Impressum.tsx`, „Haftung für Inhalte“: Die Sätze mit „§ 7 Abs. 1 ECG“ und „§§ 8 bis 10 ECG“ sind entfernt. Stehen bleibt: Inhalte sorgfältig erstellt, keine Gewähr, Verantwortung für eigene Inhalte nach den allgemeinen Gesetzen.
- „Angaben gemäß § 5 ECG, § 25 MedienG“ ergänzt um Unternehmensgegenstand und Gewerbeberechtigungen (GISA-Zahlen), „nicht im Firmenbuch eingetragen“, Gewerbebehörde, Kammerzugehörigkeit und anwendbare Rechtsvorschriften mit Link zum RIS. Die Angaben entsprechen denen auf erp.contact, ethics.at, coolwebtoday.org, digitalpath.at und pertion.io.

### Warum

- Der Betreiber sitzt in Österreich; maßgeblich sind österreichische Vorschriften. Der Haftungstext war eine deutsche Vorlage (§ 7 Abs. 1 und §§ 8 bis 10 Telemediengesetz), in der nur das Gesetzeskürzel durch „ECG“ ersetzt worden war. Im österreichischen E-Commerce-Gesetz regelt § 7 aber unerwünschte Werbe-E-Mails, und die Haftungsbestimmungen §§ 13 bis 18 ECG sind seit 16.02.2024 weggefallen (seither Digital Services Act). Die Zitate waren damit falsch und irreführend.
- § 5 Abs. 1 ECG verlangt von gewerberechtlich tätigen Diensteanbietern Angaben zu Aufsichtsbehörde, Kammer und anwendbaren gewerberechtlichen Vorschriften; § 25 MedienG verlangt den Unternehmensgegenstand. Auf dangulea.at fehlten diese Angaben, auf den anderen Seiten standen sie bereits.

## 2026-11-16 – Satz zur Verbraucherschlichtung entfernt

### Was geändert wurde

- `src/pages/Impressum.tsx`: Der Abschnitt „Verbraucherstreitbeilegung“ mit dem Satz „Ich bin weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.“ ist entfernt.

### Warum

- Die Formulierung stammt aus dem deutschen Verbraucherstreitbeilegungsgesetz (§ 36 VSBG). Für ein österreichisches Einzelunternehmen gilt das Alternative-Streitbeilegung-Gesetz (AStG). Nach § 19 AStG muss nur informieren, wer sich zur Teilnahme an Schlichtungsverfahren verpflichtet hat oder gesetzlich dazu verpflichtet ist. Wer das nicht ist, braucht vorab keinen Hinweis auf der Website (WKO, „Alternative Streitbeilegung in Verbraucherangelegenheiten“).
- Ob im Einzelfall eine Schlichtung in Frage kommt, bleibt damit offen. Der Satz legte das vorab unnötig und schroff ablehnend fest. Kommt es zu einem konkreten Streitfall, der sich nicht direkt lösen lässt, ist dann zu sagen, ob man an einem Verfahren teilnimmt (§ 19 Abs. 3 AStG).
- Auf Rückfrage des Betreibers, der den Satz für unsicher und unpassend formuliert hielt.

## 2026-11-16 – Datenschutzhinweis

### Was geändert wurde

- `src/components/PrivacyNotice.tsx`, `src/components/PrivacyNotice.css`, eingebunden in `src/components/Layout.tsx`: Auf allen Seiten erscheint am unteren Rand ein Datenschutzhinweis. Er informiert nur: keine Cookies, kein Tracking, keine externen Dienste, Sitzungsspeicher nur nach ausdrücklich gestarteter Google-Anmeldung im internen Bereich. Es gibt keine Einwilligungsabfrage. „Verstanden“ speichert im localStorage `dangulea.datenschutzhinweis.v1` = `geschlossen`. Beim Vorrendern gilt der Hinweis als geschlossen (`useSyncExternalStore` mit Server-Snapshot), deshalb enthält das statische HTML keinen Hinweis und es entsteht kein Hydrationskonflikt.
- `src/pages/Impressum.tsx`: Überschrift „Datenschutzerklärung“ hat die Sprungmarke `#datenschutz` (Ziel des Links im Hinweis). Neuer Abschnitt „Datenschutzhinweis“ mit Zweck, Schlüssel, Speicherdauer und Rechtsgrundlage (§ 165 Abs. 3 TKG 2021, Umsetzung von Art. 5 Abs. 3 der ePrivacy-Richtlinie 2002/58/EG).

### Warum

- Nach der Umstellung auf lokale Schriften (PR #34, siehe unten) wurde die Website am 16.11.2026 live geprüft. Ergebnis: nur Anfragen an dangulea.at, keine Cookies, kein Browser-Speicher, kein Google-Iframe und kein Google-Skript vor der Anmeldung. Alle sechs Schriftdateien werden mit `font/woff2` und den Bytegrößen aus dem Repository ausgeliefert.
- Der Hinweis wurde auf Wunsch des Betreibers für alle eigenen Seiten einheitlich eingeführt (auch erp.contact, ethics.at, digitalpath.at, coolwebtoday.org).
- Eine Einwilligung wird bewusst nicht abgefragt, weil die öffentlichen Seiten nichts einsetzen, das eine erfordert. Der Sitzungsspeicher des internen Bereichs entsteht erst durch die ausdrücklich gestartete Anmeldung und ist als unbedingt erforderlich bereits beschrieben. Das Merken des Schließens ist in der Datenschutzerklärung offengelegt.

## 2026-11-16 – Lokale Schriften und datensparsame Google-Anmeldung (PR #34)

### Was geändert wurde

- Inter und Playfair Display liegen unter `public/fonts/` (sechs WOFF2-Dateien, Latin und Latin Extended, mit OFL-Lizenzen) und werden über `src/styles/fonts.css` von dangulea.at geladen. Die Einbindung von `fonts.googleapis.com` in `index.html` ist entfernt. Die Content-Security-Policy erlaubt Schriften nur noch von `'self'`.
- `src/pages/Intern.tsx`: Google/Firebase startet erst beim Klick auf „Mit Google anmelden“, mit expliziter Sitzungspersistenz. Der Popup-Resolver wird erst für den Anmeldevorgang geladen, abgelaufene lokale Tokens werden entfernt.
- `src/pages/Impressum.tsx`: Die Datenschutzerklärung beschreibt Schriftarten, Sitzungsspeicher, Google-Anmeldung, Sheet-Zugriff, Speicherfristen und mögliche Drittlandverarbeitung. Der Verweis auf die eingestellte EU-ODR-Plattform ist entfernt.

### Warum

- Die Schriften wurden bei jedem Seitenaufruf von Google-Servern geladen. Dabei erhält Google die IP-Adresse der Besucherinnen und Besucher. Gerichte (u. a. LG München I, 2022) haben das ohne Einwilligung als unzulässig bewertet. Lokal ausgelieferte Schriften vermeiden diese Übermittlung vollständig.
- Der interne Bereich initialisierte Firebase schon beim bloßen Aufruf der abgemeldeten Seite und stellte damit Verbindungen zu Google her, bevor jemand eine Anmeldung wollte. Jetzt geschieht das erst auf ausdrücklichen Klick.
- Die EU-Plattform zur Online-Streitbeilegung wurde am 20.07.2025 eingestellt; ein Verweis darauf wäre irreführend.
