# Änderungsprotokoll

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
