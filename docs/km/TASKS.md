# Aufgabenliste: Wissensmanagement (`/intern/wissen`)

Grundlage: `docs/km/KM-KONZEPT.md` (verbindlich). Stand 12.11.2026. Reihenfolge: KM-T0 bis KM-T10; jede Aufgabe ist ein
eigener Branch und Pull Request gegen `main`, mit grünem `pnpm test`, `pnpm lint` und `pnpm build`.

## Regeln für jeden Lauf

1. **Keine Geheimnisse und keine privaten Kennungen im Repo.** Keine Ordner-IDs, keine Register-ID, keine Datei- oder
   Ordnernamen aus Drive (außer den drei Bereichsnamen Digital Products, Study, Knowledge Base), keine Tokens, keine
   Inhalte aus Drive. Das Repo ist öffentlich.
2. **Nur lesen.** Phase 1 nutzt `drive.readonly` und `spreadsheets.readonly`; kein Schreib-Scope.
3. **Anzeigeregeln nur über `displayPolicy`** (KM-T5). Keine Komponente entscheidet selbst, ob Inhalt gezeigt wird.
4. **Kein Inhaltsabruf für B, D, E und „ohne Klasse“.** Weder `files.export` noch `alt=media` noch Vorschaubilder.
5. **Inhalte nie als HTML rendern** (`dangerouslySetInnerHTML` ist im Wissensbereich verboten).
6. **Nichts dauerhaft speichern.** Token, Ordnermenge und Register nur im `sessionStorage`; kein `localStorage`,
   kein Service Worker, keine Firestore-Daten.
7. **Tests zuerst für reine Funktionen** in `src/utils/knowledge.ts` mit `scripts/knowledge.test.mjs`
   (Muster: `scripts/skill-radar.test.mjs`).

## KM-T0 · KM-Register anlegen

- **Durch:** Owner; Claude liefert auf Wunsch die leere Vorlage.
- **Schritte:** Google Sheet „KM-Register“ im eigenen Drive anlegen, nicht freigeben. Tabs und Spalten wie im Konzept
  (Konfiguration, Regeln, Register, Risiken, Prüfprotokoll). In Konfiguration die Startordner-IDs der drei Bereiche
  (Schlüssel `start.digital-products`, `start.study`, `start.knowledge-base`) und `klimabezug.geprueft` eintragen.
  In Regeln die ersten Ordnerregeln (Standardklasse je Unterordner).
- **Abnahme:** Sheet gehört dem Owner, Freigabe „Eingeschränkt“, keine weiteren Personen.

## KM-T1 · Anmeldung ohne fremde Firebase-Konten

- **Durch:** Code; Owner für die Konsole.
- **Owner:** In der Google Cloud Console des Projekts `dangulea-intern` die Client-ID des Web-Clients
  („Web client (auto created by Google Service)“) nachsehen und als autorisierte JavaScript-Quelle
  `https://dangulea.at` eintragen. Die Client-ID ist eine öffentliche Kennung.
- **Code:** In `src/pages/Intern.tsx` `signInWithPopup` ersetzen durch die Vorprüfung wie im LearnSpace:
  Google Identity Services Token-Client (`https://accounts.google.com/gsi/client`) fordert ein Zugriffstoken mit
  `openid email` und dem Sheets-Scope an; die App liest `https://www.googleapis.com/oauth2/v3/userinfo`, vergleicht
  die E-Mail mit der Owner-Adresse, widerruft das Token bei Abweichung und meldet sich erst danach mit
  `signInWithCredential(auth, GoogleAuthProvider.credential(null, accessToken))` bei Firebase an.
- **CSP:** `script-src` um `https://accounts.google.com/gsi/client`; `connect-src` um `https://www.googleapis.com`;
  gleiche Änderung in `vite.config.ts`; `scripts/csp.test.mjs` anpassen.
- **Abnahme:** Anmeldung mit einem zweiten Google-Konto zeigt den neutralen Hinweis und legt in Firebase
  Authentication keinen Nutzer an (Owner prüft die Nutzerliste). Owner-Anmeldung funktioniert wie bisher.

## KM-T2 · Drive-Zugriff einrichten

- **Durch:** Owner (Konsole), Code.
- **Owner:** Im Projekt `dangulea-intern` die Google Drive API aktivieren und im OAuth-Zustimmungsbildschirm den Scope
  `.../auth/drive.readonly` ergänzen. Status bleibt „Testing“, einziger Testnutzer ist der Owner.
- **Code:** Neue Route `/intern/wissen` (`src/App.tsx`, `scripts/prerender.mjs` mit `noindex: true`; `robots.txt`
  sperrt `/intern` bereits). Beim ersten Öffnen fordert der Token-Client `drive.readonly` zusätzlich an
  (`include_granted_scopes`). Abmelden widerruft das Token und leert den `sessionStorage`. Link von `/intern` nach
  `/intern/wissen`; kein neuer Menüeintrag.
- **Abnahme:** Ohne Drive-Zustimmung zeigt die Seite nur den Hinweis zum Verbinden. Nach Abmelden ist kein Token mehr
  im `sessionStorage`, und ein erneuter API-Aufruf mit dem alten Token schlägt fehl.

## KM-T3 · Sicherheitsprüfungen im Test

- **Durch:** Code.
- **Schritte:** `scripts/knowledge-secrets.test.mjs`: durchsucht `src/`, `public/`, `docs/` und `index.html` nach
  Drive-Ordner-Links (`drive.google.com/drive/folders/`), Ausdrücken der Form `'<ID>' in parents` mit fester ID,
  Spreadsheet-Links außer der bestehenden Skill-Radar-ID und nach Token-Mustern (`ya29.`). Prüft außerdem, dass im
  Wissensbereich kein `dangerouslySetInnerHTML`, kein `localStorage` und kein `<iframe` vorkommt.
- **Abnahme:** Test schlägt bei einem eingeschleusten Ordner-Link fehl und ist im normalen Stand grün.

## KM-T4 · Ordnermenge und Register laden

- **Durch:** Code.
- **Schritte:** In `src/utils/knowledge.ts`:
  - `findRegisterQuery()` → Drive-Abfrage `name = 'KM-Register' and mimeType = 'application/vnd.google-apps.spreadsheet' and 'me' in owners and trashed = false`.
  - `parseConfig(rows)` liest die Startordner aus dem Tab Konfiguration.
  - `collectFolders(startIds, listChildren)` Breitensuche mit Begrenzung (z. B. 2000 Ordner), Ergebnis als `Set`.
  - `inScope(file, folderSet)` prüft die Elternordner.
  - Ergebnis je Sitzung im `sessionStorage` halten.
- **Abnahme:** Tests mit Beispielbäumen (Zyklus, doppelte Elternordner, Grenze erreicht). Im Browser erscheinen nur
  Dateien aus den drei Bereichen.

## KM-T5 · Anzeigeregeln

- **Durch:** Code.
- **Schritte:** `classify(file, register, rules)` liefert `A | B | C | D | E | null` (Register vor Ordnerregel vor
  `null`). `displayPolicy(klasse)` liefert `{ visible, showSnippet, fetchContent, fullTextMatch, hint }`:

  | Klasse | visible | showSnippet | fetchContent | fullTextMatch | hint |
  | --- | --- | --- | --- | --- | --- |
  | A, C | ja | ja | ja | ja | – |
  | B, D | ja | nein | nein | nein | – |
  | null | ja | nein | nein | nein | „Klasse fehlt“ |
  | E | nein | nein | nein | nein | – |

- **Abnahme:** Tests decken jede Zeile ab, dazu: unbekannter Klassenwert verhält sich wie `null`; ein Volltexttreffer
  einer B-Datei ohne Titeltreffer wird verworfen.

## KM-T6 · Suche

- **Durch:** Code.
- **Schritte:** Zwei Drive-Abfragen je Suche: `name contains '<q>'` und `fullText contains '<q>'` (Anführungszeichen
  und Backslashes escapen), beide mit `trashed = false` und Feldern
  `files(id,name,mimeType,parents,modifiedTime,webViewLink,shared)`. Ergebnisse zusammenführen, auf die Ordnermenge
  begrenzen, mit `displayPolicy` filtern. Ausschnitte nur für A und C über `files.export` als `text/plain`
  (Google-Dokumente) und nur die ersten Zeichen um den Treffer. Filter Bereich, Klasse, Wissensgebiet, Prüfstatus, Typ.
- **Abnahme:** Suche nach einem Wort, das nur im Text einer B-Datei steht, liefert diese Datei nicht. Suche nach ihrem
  Titel liefert sie ohne Ausschnitt.

## KM-T7 · Wissenslandkarte

- **Durch:** Code.
- **Schritte:** `buildMap(files, register, rules, skills)` → Bereich → Wissensgebiet → Dokumente, Zähler je Klasse,
  Lücken (kein geprüftes A/C, nur B/D, Skill ohne Dokument). Skills aus dem bestehenden Skill-Radar-Sheet.
- **Abnahme:** Tests für Zählung und Lücken; E-Dateien zählen nirgends mit.

## KM-T8 · Prüfungen und Wissensrisiken

- **Durch:** Code.
- **Schritte:** `dueReviews(register, today)` (fällig, überfällig); `detectRisks(...)` für die sechs Risikoarten des
  Konzepts mit Gruppe (menschlich, technisch, betrieblich). Kennzahlen oben auf der Seite: eingestuft, geprüft,
  überfällig. Links ins Register zum Eintragen.
- **Abnahme:** Tests je Risikoart mit festem Datum.

## KM-T9 · Verknüpfung mit Skill-Radar und LearnSpace

- **Durch:** Code.
- **Schritte:** Liste „Modulkandidaten“ aus Registerzeilen mit Modulkandidat = ja und Klasse A oder C. Hinweis, dass
  Module nur über `docs/content/MODULE-CONCEPT.md` im Repo learn.dangulea.at entstehen. Keine automatische Übergabe.
- **Abnahme:** Eine B-Zeile mit Modulkandidat = ja erscheint nicht und erzeugt das Risiko „Rechte Dritter“.

## KM-T10 · Abnahme und Dokumentation

- **Durch:** Code, Owner.
- **Schritte:** README-Abschnitt „Privater Bereich“ ergänzen; `SECURITY.md` prüfen; Nachweis in
  `docs/km/ABNAHME.md` (Datum, Prüfschritte, Ergebnis, ohne private Kennungen). Owner-Test: Anmeldung, Suche,
  Karte, Prüfungen, Abmelden, Fremdkonto.
- **Abnahme:** Deploy-Workflow inklusive `verify-live` grün; alle Prüfschritte bestanden.
