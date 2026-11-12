# Sicherheitsrichtlinie

## Unterstützte Versionen

Es gibt keine Versionen.
Unterstützt wird nur der aktuelle Stand von `main`,
der über GitHub Pages unter https://dangulea.at ausgeliefert wird.

## Geltungsbereich

- Die Website dangulea.at aus diesem Repository, einschließlich des privaten Bereichs `/intern`
- Die GitHub-Actions-Workflows dieses Repositorys

Nicht in diesem Repository:

- LearnSpace (learn.dangulea.at) hat ein eigenes Repository.
- Plattformen Dritter (GitHub, Google, Firebase): Probleme dort bitte direkt an den jeweiligen Anbieter melden.

Kein Sicherheitsproblem sind die Firebase-Webkonfiguration (einschließlich `apiKey`) und die Sheet-ID im Code.
Das sind öffentliche Kennungen.
Der Zugriff auf die Daten hängt an der Anmeldung und an der Freigabe des privaten Google Sheets, nicht an diesen Werten.

## Schwachstelle melden

Bitte kein öffentliches Issue anlegen.

Meldungen bitte per E-Mail an claudiu@dangulea.at, Betreff „Sicherheit dangulea.at“, mit:

- betroffener URL oder Datei
- Beschreibung und Schritten zum Nachvollziehen
- möglicher Auswirkung

Ich bestätige den Eingang in der Regel innerhalb von 7 Tagen und melde mich, sobald feststeht, ob und wie das Problem behoben wird. Ein Bug-Bounty-Programm gibt es nicht. Bitte keine Tests, die Daten anderer Personen betreffen oder den Betrieb der Seite stören.
