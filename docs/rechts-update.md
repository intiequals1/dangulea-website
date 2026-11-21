# Monatliches Rechts-Update

Zweites Segment der Seite `/news`. Es fasst einmal im Monat Rechtsänderungen in Österreich und der EU zu Software, Websites, Daten und KI für Kleinst- und Kleinunternehmen zusammen. Ich benötige es für meine eigenen Zwecke: vor allem für mein Studium, außerdem zur eigenen Weiterbildung und um rechtlich auf dem aktuellen Stand zu bleiben.

Das Segment ist **kein Teil des News-PoC**. Der tägliche Überblick wird automatisch erstellt und veröffentlicht; jede Ausgabe des Rechts-Updates prüfe ich dagegen selbst, bevor sie erscheint.

## Dateien

| Datei | Zweck |
| --- | --- |
| `src/content/rechts-update.json` | Quelle: Hinweistexte und alle Ausgaben, auch Entwürfe |
| `scripts/rechts-update-core.mjs` | Prüfregeln und Auswahl der freigegebenen Ausgaben |
| `scripts/prepare-rechts-update.mjs` | erzeugt `src/generated/rechts-update.json` (nicht versioniert) |
| `scripts/check-rechts-update.mjs` | Prüfung des fertigen Builds |
| `scripts/rechts-update.test.mjs` | Tests der Prüfregeln |
| `src/components/RechtsUpdateSegment.tsx`, `src/pages/RechtsUpdateEdition.tsx` | Darstellung unter `/news#rechts-update` und `/news/rechts-update/JJJJ-MM/` |

## Ablauf je Ausgabe

1. Die geplante Aufgabe „Legal News Update KMU“ legt am 1. des Monats einen Entwurf als Markdown im Google-Drive-Ordner `00_Security` ab. Der Entwurf enthält am Ende einen internen Anhang („eigene Betroffenheit“).
2. Ich lese den Entwurf und prüfe die Aussagen anhand der Quellen.
3. Die öffentliche Fassung wird als neue Ausgabe in `src/content/rechts-update.json` übertragen, **ohne den internen Anhang**, mit `"freigabe": { "status": "entwurf", "am": null }`, auf einem eigenen Branch und als Pull Request.
4. Nach meiner inhaltlichen Prüfung setze ich `"freigabe": { "status": "freigegeben", "am": "JJJJ-MM-TT" }` und merge den Pull Request.
5. Der Deploy-Workflow baut die Seite. `check-rechts-update.mjs` bricht ab, wenn ein Hinweis, ein Abschnitt oder eine Quelle fehlt, wenn ein Entwurf ausgeliefert würde oder wenn interne Vermerke in der Quelle stehen.

Entwürfe stehen im öffentlichen Repository, werden aber weder als Seite noch im JavaScript ausgeliefert. Für eine lokale Vorschau mit Entwürfen: `RECHTS_UPDATE_VORSCHAU=1 pnpm build` (in CI gesperrt; das Ergebnis nicht deployen).

## Inhaltliche Regeln

- Nur Aussagen mit Quelle; jede Quelle als https-Link. Primärquellen (EUR-Lex, RIS, Parlament, Kommission, Rat, Behörden) bevorzugen; Sekundärquellen im Titel als „Sekundärquelle“ kennzeichnen.
- Quellen in eigenen Worten wiedergeben, keine längeren Zitate. Gesetzestexte und amtliche Entscheidungen sind nach § 7 UrhG frei, Fachartikel, WKO-Merkblätter und Kanzleiberichte nicht.
- Status je Thema: `in Kraft`, `beschlossen`, `Entwurf` oder `in Verhandlung`. Entwürfe nie als geltendes Recht darstellen.
- Allgemeine Information, keine Beratung im Einzelfall. Individuelle Rechtsfragen werden nicht beantwortet.
- Österreichische Rechtslage zugrunde legen; keine Formulierungen aus deutschen Vorlagen.
- Fehler werden korrigiert und in der nächsten Ausgabe unter „Änderungen gegenüber der letzten Ausgabe“ genannt.

## Rechtlicher Rahmen der Veröffentlichung

- **KI-Verordnung, Art. 50 Abs. 4:** KI-erzeugter Text, der die Öffentlichkeit über Angelegenheiten von öffentlichem Interesse informiert, ist offenzulegen, außer er wurde menschlich geprüft oder redaktionell kontrolliert und eine Person trägt die redaktionelle Verantwortung. Die Leitlinien der Kommission verlangen eine inhaltliche Prüfung, nicht nur eine Durchsicht. Das Segment legt die KI-Unterstützung trotzdem offen und nennt bei jeder Ausgabe das Freigabedatum.
- **Mediengesetz, § 25:** Mit redaktionellen Inhalten ist die volle Offenlegung einschließlich der grundlegenden Richtung nötig. Sie steht im Impressum.
- **Datenschutz:** Die Seiten sind statisch; das Segment verarbeitet keine Daten von Besucherinnen und Besuchern.
