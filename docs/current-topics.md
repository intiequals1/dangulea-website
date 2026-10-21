# Aktuelle Themen

Route: `/aktuelle-themen`; Datenquelle: `public/current-topics.json`.

Die Datei enthält ein Array mit einem Objekt pro Perplexity-Projekt:

- `id`, `title`, `url`: stabile Projektkennung, Anzeigename und Projektlink.
- `lastCheckedAt`: ISO-Zeitstempel des letzten tatsächlichen Prüfversuchs oder `null`.
- `status`: `pending`, `ok` oder `access_required`. `ok` bedeutet, dass die Projektinhalte tatsächlich gelesen wurden.
- `updates`: Array veröffentlichter Updates mit `id` (stabil), `date` (YYYY-MM-DD), `title`, `summary`, `relevance`, `sources` (nichtleeres Array aus `title` und HTTP(S)-`url`).

Die Tagesprüfung liest ausschließlich die beiden angegebenen Projekte und deren neue/geänderte Ergebnisse. Sie fasst relevante neue Entwicklungen auf Deutsch zusammen und verlinkt die konkrete Ergebnis-Seite sowie nachvollziehbare Originalquellen. Ein allgemeiner Projektlink allein ersetzt keinen Ergebnislink. Keine erfundenen Inhalte oder ersatzweise allgemeinen ERP-News. Ohne erfolgreiche Lektüre niemals „keine Neuigkeiten“ melden. Vorhandene Updates bleiben bei Zugriffsfehlern erhalten; nur Prüfstatus und Zeitstempel werden geändert.

Beide Projekte sind ohne Anmeldung nicht lesbar. Am 21.10.2026 wurden sie über die freigegebene Browser-Sitzung erfolgreich geprüft. ERP-Brief enthielt nur eine ergebnislose Status-Sitzung; ERP-Postimplementierung enthält Forschungsbriefings, von denen das neueste als erste Zusammenfassung erfasst wurde. Für die Prüfung die `/spaces/`-Links in der Datendatei oder die sichtbaren Einträge in der Perplexity-Projektübersicht verwenden. Direkte `/projects/`-Aufrufe zeigten teilweise einen veralteten Zugriffsdialog; bei einer solchen Meldung zuerst die Projektübersicht aktualisieren und den dort sichtbaren freigegebenen Eintrag öffnen. Zugangsdaten und Session-Cookies gehören nicht ins Repository. Keine vertraulichen Projektunterlagen, personenbezogenen Daten oder langen kopierten Texte veröffentlichen.

Vor jedem Lauf main aktualisieren und Branch/Arbeitsbaum prüfen. Nach Änderungen JSON, eindeutige IDs, Daten und Quellen prüfen sowie `pnpm build`, `pnpm lint`, `git diff --check` ausführen. Nur `public/current-topics.json` committen, nach main pushen, Pages-Deploy und die live ausgelieferte Datei mit Cache-Bust prüfen. Der Website-Code wird einmalig über einen separaten PR übernommen; solange die Datei nicht in main existiert, darf die Tagesprüfung keinen unvollständigen Daten-Commit erzeugen.
