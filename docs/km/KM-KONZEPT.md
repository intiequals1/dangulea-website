# Konzept: Wissensmanagement auf dangulea.at (verbindlich)

Stand 12.11.2026 · Owner: Claudiu Dangulea · Status: Konzept freigegeben, Umsetzung nach `docs/km/TASKS.md`.
Arbeitsfassung zum Kommentieren: Claude-Dokument „Konzept: Wissensmanagement auf dangulea.at“. Diese Datei ist die
verbindliche Fassung im Repository. Jede Änderung am Wissensbereich folgt diesem Konzept.

## Ziel und Umfang

Unter `/intern/wissen` entsteht ein privates Wissensmanagement-System über drei Bereiche des Google Drive des Owners:
Digital Products, Study und Knowledge Base, jeweils mit allen Unterordnern. Es liegt im bestehenden privaten Bereich
(ein Schloss-Symbol im Menü). Zugang hat nur das Google-Konto des Owners. Die Dokumente bleiben in Drive.

- **Ziel:** eigenes Wissen finden, pflegen, prüfen und mit Skill-Radar und LearnSpace verbinden.
- **Nicht im Umfang:** andere Drive-Bereiche, Mails, Kalender, Inhalte anderer Personen.

Entscheidungen des Owners (12.11.2026):

1. Zugriff: Drive-Direktzugriff aus dem Browser (kein Katalog, kein Export in ein anderes System).
2. Unterlagen Dritter: nur mit Titel.
3. Ablauf: erst Konzept, Implementierungsdokumente und Aufgabenliste; Umsetzung danach in Einzelschritten.

## Grundlagen

- **ISO 30401:2018** „Knowledge management systems – Requirements“ mit Änderung 2:2024 (Klimabezug)
  ([BSI](https://knowledge.bsigroup.com/products/bs-iso-30401-knowledge-management-systems-requirements),
  [DIN Media, Amd 2](https://www.dinmedia.de/en/standard/din-iso-30401-a2/392206686)). Eine Neufassung ist in Arbeit
  ([ISO/TC 260](https://committee.iso.org/sites/tc260/home/projects/ongoing/ongoing-5.html)). Die Norm richtet sich an
  Organisationen; übernommen werden ihre Kernelemente, eine Zertifizierung ist nicht Ziel.
- **Durst, S. & Khadir, Y.: Knowledge Management at the Crossroads: Navigating Risks and Benefits**, Springer 2025
  ([Verlag](https://link.springer.com/978-3-031-79002-7)). Geprüft ist bisher nur das Inhaltsverzeichnis.
- **Durst, S. & Zieba, M. (2019): Mapping knowledge risks**, Knowledge Management Research & Practice 17(1)
  ([RePEc](https://ideas.repec.org/a/taf/tkmrxx/v17y2019i1p1-13.html)): Risikogruppen menschlich, technisch, betrieblich.

## Architektur

Das System läuft vollständig im Browser. Es gibt keinen Server, keine Datenbank und keinen Suchindex außerhalb von Google.

| Baustein | Umsetzung |
| --- | --- |
| Seite | Route `/intern/wissen` in dieser React-App, erreichbar über den Schloss-Eintrag |
| Anmeldung | Firebase-Projekt `dangulea-intern` mit Google. Vor der Firebase-Anmeldung prüft die App die E-Mail-Adresse (wie im LearnSpace, ADR-11 dort), damit kein fremdes Konto in Firebase gespeichert wird |
| Drive-Zugriff | Drive API v3 direkt aus dem Browser, Scope `https://www.googleapis.com/auth/drive.readonly`, erst beim Öffnen von „Wissen“ zusätzlich angefragt. OAuth-Zustimmungsbildschirm bleibt im Testmodus mit dem Owner als einzigem Testnutzer |
| Eingrenzung | Beim Start ermittelt die App alle Unterordner der drei Startordner (Breitensuche über `mimeType = 'application/vnd.google-apps.folder'`). Angezeigt werden nur Dateien, deren Elternordner in dieser Menge liegt; alles andere wird verworfen |
| Register | Privates Google Sheet „KM-Register“ im Drive des Owners. Die App findet es zur Laufzeit über Name, Dateityp und Eigentümer (`'me' in owners`). Tabs siehe unten |
| Schreiben | Phase 1 liest nur. Klassen, Prüfungen und Notizen pflegt der Owner direkt im Register; die Seite verlinkt dorthin |
| Token | Nur im `sessionStorage`, Lebensdauer etwa eine Stunde, kein Refresh-Token. Abmelden widerruft das Token (`oauth2.googleapis.com/revoke`) und leert den Speicher |
| Sicherheit | CSP: `connect-src` um `https://www.googleapis.com`, `script-src` nur um Google Identity Services (`https://accounts.google.com/gsi/client`) für die E-Mail-Vorprüfung. Keine weiteren Fremdskripte, keine Vorschau-iframes, Inhalte werden als Text gerendert, nie als HTML |

**Nie im Repository:** Ordner-IDs, Datei- oder Ordnernamen aus Drive (außer den drei Bereichsnamen), die Register-ID,
Register-Inhalte, Tokens. Ordner-IDs stehen nur im Tab Konfiguration des Registers.

### Tabs des KM-Registers

| Tab | Spalten |
| --- | --- |
| Konfiguration | Schlüssel, Wert (Startordner-IDs der drei Bereiche, Ziele, Datum der letzten Selbstprüfung, Klimabezug geprüft) |
| Regeln | Ordner-ID, Ordnerpfad, Standardklasse, Wissensgebiet |
| Register | Datei-ID, Titel, Klasse, Wissensgebiet, Skill-Radar-Skill, KI-erstellt (ja/nein), geprüft am, Intervall (Monate), Modulkandidat (ja/nein), Notiz |
| Risiken | Datum, Datei-ID oder Gebiet, Risikoart, Maßnahme, erledigt am |
| Prüfprotokoll | Datum, Datei-ID oder Gebiet, Ergebnis, Notiz |

## Wissensklassen und Anzeigeregeln

Die Klassen sind dieselben wie im LearnSpace-Modulkonzept (`docs/content/MODULE-CONCEPT.md` im Repo
learn.dangulea.at), damit eine Datei überall gleich behandelt wird.

| Klasse | Beispiele | Anzeige im Wissenssystem | Weg ins LearnSpace |
| --- | --- | --- | --- |
| A · Eigene Unterlagen | eigene Mitschriften, Konzepte, Fragenkataloge | Titel, Ausschnitt, Textvorschau, Link nach Drive | nur Fakten mit öffentlicher Quelle |
| C · Öffentliche Quellen | Herstellerdoku, Gesetze, Open-Access-Texte | Titel, Ausschnitt, Textvorschau, Link nach Drive | ja, mit Quelle und Abrufdatum |
| B · Kursunterlagen Dritter | Skripten, Folien, Lernhilfen | nur Titel, Ordner, Änderungsdatum, Link nach Drive | nein |
| D · Lizenzierte Inhalte | Bücher, Videos, Kurse | nur Titel, Ordner, Änderungsdatum, Link nach Drive | nein |
| E · Persönliches | Bewerbungen, Verträge, Mails, Daten anderer | nicht angezeigt, nicht gesucht | nein |
| ohne Klasse | neu oder noch nicht eingestuft | wie B, mit Hinweis „Klasse fehlt“ | nein |

Regeln, die der Code erzwingt (eine reine Funktion mit Tests, siehe KM-T5):

1. **Volltexttreffer nur für A und C.** B und D erscheinen nur, wenn der Suchbegriff im Titel steht.
2. **Kein Inhalt aus B, D, E.** Für diese Dateien ruft die App nie Inhalte, Exporte oder Vorschaubilder ab, nur Metadaten.
3. **Unklar heißt eingeschränkt.** Registereintrag vor Ordnerregel; ohne beides gilt „ohne Klasse“.
4. **Die Klasse vergibt der Owner.** Die App schlägt keine Klasse aus Inhalten vor; Vorschläge kommen nur aus Ordnerregeln.

## Funktionen

- **Suche:** ein Feld über alle drei Bereiche; Filter Bereich, Klasse, Wissensgebiet, Prüfstatus, Dateityp. Treffer
  zeigen Titel, Pfad, Änderungsdatum, Klasse; bei A und C einen kurzen Ausschnitt. „In Drive öffnen“ führt zum Original.
- **Wissenslandkarte:** Bereich → Wissensgebiet → Dokument mit Zählern je Klasse. Lücken: Gebiete ohne geprüftes A-
  oder C-Dokument, Gebiete nur mit Unterlagen Dritter, Skill-Radar-Skills ohne passendes Dokument.
- **Prüfungen:** Prüfdatum und Intervall je Datei im Register; die Seite listet fällige und überfällige Prüfungen.
- **Wissensrisiken:**

  | Risiko | Gruppe (Durst & Zieba) | Erkennung |
  | --- | --- | --- |
  | Veraltet | betrieblich | Prüfung überfällig oder lange keine Änderung |
  | Ohne Einstufung | betrieblich | keine Klasse im Register und keine Ordnerregel |
  | Rechte Dritter | betrieblich | B oder D in einem Wissensgebiet, das ein LearnSpace-Modul speist |
  | Ungeprüfte KI-Inhalte | betrieblich | im Register als KI-erstellt markiert, nicht geprüft |
  | Freigabe | technisch | Datei ist für andere freigegeben (Drive-Feld `shared`) |
  | Einzelquelle | menschlich | Wissensgebiet hängt an genau einem Dokument |

- **Skill-Radar und LearnSpace:** Wissensgebiete werden mit Skill-Radar-Skills verknüpft. A- und C-Dokumente können
  als Modulkandidat markiert werden. Das Modul entsteht weiterhin nur über den verbindlichen Ablauf im LearnSpace-Repo,
  nach Bedarf und ohne Automatik.

## KI-Assistent (LLM)

Ein Fragefeld im Wissensbereich: Das LLM antwortet nur aus freigegebenen Unterlagen und nennt die Quellen. Dazu
Zusammenfassungen und Lernfragen zu einem Dokument. Entscheidung des Owners (12.11.2026): LLM nur für Unterlagen, die
damit verwendet werden dürfen.

### Freigaberegel `llmPolicy`

| Klasse | ans LLM | Grund |
| --- | --- | --- |
| A · Eigene Unterlagen | nur mit Register-Feld „KI erlaubt = ja“ (je Datei oder per Ordnerregel) | eigene Unterlagen können Vertrauliches enthalten |
| C · Öffentliche Quellen | ja, außer bei „KI erlaubt = nein“ | öffentlich zugänglich |
| B · Kursunterlagen Dritter | nie | Rechte Dritter; Entscheidung „nur mit Titel“ |
| D · Lizenzierte Inhalte | nie | Rechte Dritter |
| E · Persönliches | nie | Daten Dritter, nicht öffentlich |
| ohne Klasse | nie | unklar heißt eingeschränkt |

`llmPolicy` ist eine reine, getestete Funktion. Nur ihr Ergebnis entscheidet, welcher Text das Gerät verlässt.

### Ablauf einer Frage

1. Drive-Suche wie im Abschnitt Funktionen; behalten werden nur Dateien mit `llmPolicy = erlaubt`.
2. Text der besten Treffer holen (höchstens fünf, gekürzt auf die Abschnitte um den Treffer, feste Zeichengrenze).
3. Frage und Auszüge (mit Datei-ID und Titel) gehen an die Server-Funktion `askKnowledge` im Firebase-Projekt
   `dangulea-intern`, Region `europe-west3`.
4. Die Funktion prüft das Firebase-ID-Token und die Owner-Adresse, begrenzt Größe und Anfragen je Tag und ruft die
   Claude API auf. Der API-Schlüssel liegt im Secret Manager (`defineSecret`), nie im Browser oder Repo.
5. Antwort mit nummerierten Quellen (Titel, Link nach Drive) und dem Hinweis „KI-Antwort, ungeprüft“.

Kein eigener Suchindex, keine Vektordatenbank.

### Schutzregeln

- **Keine Speicherung:** Fragen und Antworten nur in der geöffneten Seite; die Funktion protokolliert Größen und Zeiten,
  keine Inhalte.
- **Keine Werkzeuge:** kein Webzugriff, keine Schreibrechte, keine Aktionen. Der Systemprompt behandelt Dokumenttext als
  Daten; eingeschleuste Anweisungen können höchstens die Antwort verfälschen.
- **Ausgabe als Text:** nie als HTML; Links setzt nur die App (Quellen), nicht das LLM.
- **Kein Automatismus:** KI-Antworten fließen nie automatisch ins Register oder ins LearnSpace. Für Module gilt das
  Modulkonzept im Repo learn.dangulea.at (nur öffentlich belegbare Fakten, Policy-Prüfung).
- **Not-Aus und Kostenbremse:** Schalter `llm.enabled` im Tab Konfiguration und in der Funktion; monatliches
  Ausgabenlimit in der Claude Console.

### Datenschutz beim Anbieter

Claude API (Anthropic): Ein- und Ausgaben werden standardmäßig innerhalb von 30 Tagen gelöscht; von den
Sicherheitssystemen markierte Anfragen bis zu zwei Jahre
([Privacy Center](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-commercial-api-data)).
Gespeicherte Daten werden ohne ausdrückliche Zustimmung nicht fürs Training verwendet
([API-Doku](https://platform.claude.com/docs/en/build-with-claude/api-and-data-retention)).

### Anbindung (Entscheidung offen, Empfehlung Option 1)

| Option | Vorteil | Nachteil |
| --- | --- | --- |
| 1 · Claude API über Server-Funktion | Schlüssel nie im Browser; Owner-Prüfung und Limits auf dem Server | Blaze-Tarif für `dangulea-intern` nötig ([Firebase FAQ](https://firebase.google.com/docs/functions/faq-and-troubleshooting)); API-Kosten je Nutzung |
| 2 · Claude API direkt aus dem Browser, Schlüssel je Sitzung | kein Server | Schlüssel bei einer Skript-Lücke angreifbar; nur mit engem Ausgabenlimit vertretbar |
| 3 · Gemini über Vertex AI mit Google-Anmeldung | kein eigener Schlüssel | braucht den sehr breiten Scope `cloud-platform` |

## Abgleich mit ISO 30401

Zuordnung nach der Gliederung der Norm
([Inhaltsverzeichnis, ISO-Vorschau](https://webstore.ansi.org/preview-pages/ISO/preview_ISO+30401-2018.pdf)).
Geprüft sind die Abschnittstitel, nicht der Normtext.

| Abschnitt | Umsetzung |
| --- | --- |
| 4.1–4.3 Kontext und Anwendungsbereich | drei Drive-Bereiche, nur Owner; Klimabezug (Amd 2:2024) im Tab Konfiguration als geprüft vermerkt |
| 4.4.2 Wissensentwicklung | neue Dokumente in den Ordnern, Prüfungen, Kennzeichnung veralteten Wissens |
| 4.4.3 Weitergabe und Umwandlung | Suche, Wissenslandkarte, Modulkandidaten für das LearnSpace |
| 4.4.4 Befähiger | Technik (Drive, App), Prozesse (Register, Prüfungen), Steuerung (Klassen, Regeln) |
| 4.5 Wissenskultur | für eine Person eingeschränkt anwendbar: feste Lernroutine über Skill-Radar |
| 5 Führung | dieses Konzept als Leitlinie; einzige Rolle ist der Owner |
| 6.1 Risiken und Chancen | Funktion Wissensrisiken, Tab Risiken; Freigaberegel und Schutzregeln des KI-Assistenten |
| 6.2 Ziele | Ziele im Tab Konfiguration |
| 7.5 Dokumentierte Information | Register, Prüfprotokoll, diese Doku |
| 9.1 Überwachung | Kennzahlen auf der Startseite: eingestuft, geprüft, überfällig |
| 9.2–9.3 Audit und Bewertung | halbjährliche Selbstprüfung, Ergebnis im Prüfprotokoll |
| 10 Verbesserung | Maßnahmen aus dem Tab Risiken, erledigt mit Datum |

Buch Durst & Khadir: übernommen sind aus dem Inhaltsverzeichnis Wissensrisiken als Schwerpunkt, Nutzen und Risiken
gemeinsam (jede Funktion, die Wissen nutzbar macht, hat eine Schranke) und verantwortungsvolles Wissensmanagement
(Rechte Dritter und Datenschutz im Code erzwungen). Der kapitelgenaue Abgleich folgt, sobald die Kapitel vorliegen.

## Risiken der Umsetzung

| Risiko | Gegenmaßnahme |
| --- | --- |
| `drive.readonly` erlaubt Lesen des ganzen Drive | Eingrenzung im Code, Token nur in der Sitzung, Widerruf beim Abmelden, Testmodus mit einem Testnutzer |
| Gestohlenes Token eine Stunde nutzbar | CSP ohne Inline-Skripte, nur Google als Skriptquelle, Inhalte nie als HTML, Abhängigkeiten aktuell |
| Fremde Konten in Firebase | E-Mail-Vorprüfung vor der Firebase-Anmeldung; Nutzerliste von `dangulea-intern` prüfen |
| Geheimnisse im öffentlichen Repo | Ordner und Register werden zur Laufzeit gefunden; Prüfung im Test auf Drive-IDs |
| Große Ordnerbäume | Ordnermenge einmal je Sitzung ermitteln, im `sessionStorage` halten |
| Hinweis „nicht verifizierte App“ | bewusst akzeptiert; Veröffentlichung mit eingeschränktem Scope verlangt eine Google-Sicherheitsprüfung |
| KI-Antworten falsch oder durch Dokumenttext manipuliert | Quellenpflicht, Hinweis „ungeprüft“, keine Werkzeuge, kein Automatismus |
| Text Dritter verlässt das Gerät | `llmPolicy` mit Tests; Abnahme prüft das Netzwerkprotokoll |
| Kosten laufen aus dem Ruder | Ausgabenlimit in der Claude Console, Anfragelimit in der Funktion, Not-Aus |

## Offene Punkte

- Buchkapitel für den genauen Abgleich mit Durst und Khadir.
- Ordnerregeln für die Erststufung (welche Unterordner in Study sind Kursunterlagen, Klasse B).
- Phase 2: Prüfungen direkt auf der Seite eintragen (bräuchte Schreibrechte für das Register).
- Anbindung des KI-Assistenten (Option 1, 2 oder 3) und Modell (Claude Haiku oder Sonnet, je nach Kosten).
