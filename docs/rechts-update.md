# Rechts-Update im internen Bereich

Monatliche Zusammenfassung von Rechtsänderungen in Österreich und der EU zu Software, Websites, Daten und KI. Ich nutze sie für mein Studium, zur Weiterbildung und um rechtlich auf dem aktuellen Stand zu bleiben. Sie ist nur für mich bestimmt und erscheint ausschließlich im geschützten Bereich `/intern`, Reiter „Rechts-Update“.

Eine öffentliche Fassung auf `/news` war geplant und wurde verworfen (archivierter Pull Request #42).

## Daten

Privates Google Sheet „Rechts-Update Register“ im Drive-Ordner `00_Security`, nur für den Eigentümer freigegeben. Die Seite liest es nach der Anmeldung mit dem Bereich `spreadsheets.readonly`, wie das Skill-Radar-Sheet. Die Sheet-ID steht in `src/pages/Intern.tsx` (Repository-Variable `RECHTS_SHEET_ID` kann sie ersetzen). Inhalte liegen nie im Repository.

| Blatt | Spalten |
| --- | --- |
| Ausgaben | Monat, Titel, Stand, Status (Entwurf oder geprüft), Kurzüberblick, Änderungen gegenüber Vorausgabe, Drive-Datei |
| Themen | Monat, Nr, Thema, Status (in Kraft, beschlossen, Entwurf, in Verhandlung), Was gilt, Ab wann, Wen betrifft es, Was tun, Weitere Hinweise, Neu seit letzter Ausgabe, Quellen |
| Fristen | Datum, Thema, Was passiert, Status (offen, erledigt, entfällt, verschoben), Ausgabe |
| Betroffenheit | Monat, Thema, Betroffen?, Bezug, Nächster Schritt |

- Monat und Datum als Text: `'2026-11` bzw. `'2026-12-09` (mit Apostroph), damit Google Sheets sie nicht in ein Datum umwandelt.
- Quellen: eine Quelle je Zeile im Format `Titel | https://…`. Nur http(s)-Links werden verlinkt.
- Spalten werden über den Anfang ihrer Überschrift gefunden; kleine Umbenennungen brechen nichts.

## Ablauf

1. Die geplante Aufgabe „Legal News Update KMU“ legt am 1. des Monats die Ausgabe als Markdown in `00_Security` ab und hängt dieselben Inhalte im Sheet unten an (Status „Entwurf“).
2. Ich lese die Ausgabe und prüfe sie gegen die Quellen. Danach setze ich den Status im Blatt „Ausgaben“ auf „geprüft“.
3. Fristen, die verstrichen oder erledigt sind, setze ich im Blatt „Fristen“ auf „erledigt“; der Reiter zeigt nur offene Fristen ab heute.

Code: `src/utils/rechtsUpdate.ts` (Lesen und Umwandeln), `src/components/InternRechtsUpdate.tsx` (Darstellung), Tests in `scripts/rechts-update-intern.test.mjs`.
