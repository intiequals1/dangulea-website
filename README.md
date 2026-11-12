# dangulea.at

Quellcode meiner persönlichen Website: [dangulea.at](https://dangulea.at)

News-Einzelartikel, individuelle Social-Bilder und die verpflichtende Build-/Deploy-Prüfung sind in [docs/news-sharing.md](docs/news-sharing.md) beschrieben. Nach einer News-Änderung zuerst `pnpm news:sync` ausführen und die News-Datei gemeinsam mit `data/news-archive.json` committen.

Neue und geänderte News müssen vorher den [zweistufigen Faktencheck](docs/news-fact-checking.md) durchlaufen; das Prüfprotokoll wird mitcommitted. Die Website zeigt dauerhaft ihren Entwicklungsstand und den jeweiligen Prüfstatus der News an.

Die Seite stellt meinen beruflichen Hintergrund, meine fachlichen Schwerpunkte und meine laufenden Vorhaben dar. Sie ist als Einzelprojekt gedacht und nicht als Vorlage. Die Inhalte sind auf Deutsch.

## Zur Person

Finance- und ERP-orientierter IT-Consultant in Wien. Erfahrung in Rechnungswesen, SAP FI/CO, Prozessmanagement und Business Intelligence. Fachliches Verständnis aus Buchhaltung, Controlling und Steuerprozessen, verbunden mit Systemlogik, Datenanalyse und strukturierter Dokumentation.

Universitätslehrgang Angewandte Ethik an der Universität Innsbruck und der PTH Brixen, abgeschlossen 2026. Ab September 2026 berufsbegleitender Bachelor Digital Business an der FH der WKW.

## Zum Repository

Statische Single-Page-Anwendung, gebaut mit React, TypeScript und Vite, veröffentlicht über GitHub Pages. Das Repository ist öffentlich, damit Aufbau und Umsetzung nachvollziehbar sind.

```
index.html            Einstiegspunkt, Meta-Angaben, SPA-Weiterleitung
public/               Statische Dateien, Custom Domain, Favicon
src/
  App.tsx             Routen
  components/         Seitenrahmen, Navigation, Footer
  pages/              Start, Person, Projekte, Impressum
  styles/global.css   Designtokens, Typografie, Grundlayout
```

Der Deploy läuft automatisch über GitHub Actions bei jedem Push auf den Standard-Branch. Der Workflow liegt in `.github/workflows/deploy.yml`.

Die Seite wird laufend überarbeitet. Inhalte und Formulierungen ändern sich, insbesondere auf der Projekte-Seite, wo überwiegend Entwürfe und Notizsammlungen aufgeführt sind.

## Privater Bereich

Unter `/intern` liegt ein privater, geschützter Bereich für meinen Skill-Radar; erreichbar über das Schloss-Symbol in der Navigation. Die Inhalte sind nur für mich bestimmt. Die Seite selbst ist öffentlich und enthält keine Daten. Die Anmeldung läuft über Firebase Authentication mit Google (eigenes Firebase-Projekt `dangulea-intern`). Danach liest die Seite ein privates Google Sheet über die Sheets-API, ausschließlich lesend und mit dem Token der angemeldeten Person. Wer keinen Lesezugriff auf das Sheet hat, sieht nichts. Der OAuth-Zustimmungsbildschirm steht auf „Testing“; anmelden können sich nur eingetragene Testnutzer. Token und Sitzung liegen nur im Sitzungsspeicher des Browsers.

Die Firebase-Webkonfiguration und die Sheet-ID stehen in `src/pages/Intern.tsx`. Das sind öffentliche Kennungen, keine Geheimnisse; sie stehen ohnehin im ausgelieferten JavaScript, und ein Client-Secret wird nicht verwendet. Die Repository-Variablen `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID` und `SKILL_SHEET_ID` können sie beim Build ersetzen. Die Content-Security-Policy in `index.html` erlaubt dafür `apis.google.com`, die Firebase-Endpunkte und den Auth-Rahmen von `dangulea-intern.firebaseapp.com`; bei einem anderen Firebase-Projekt muss sie mitgeändert werden.

## Entstehung und KI-Unterstützung

Teile dieser Seite sind mit KI-Assistenz entstanden, umgangssprachlich vibe-gecoded. Ich halte es für angemessen, das offenzulegen, statt es zu verschweigen.

Eingesetzte Systeme:

- **Manus**: frühe Umsetzung von Layout und Komponenten, im April 2026
- **ChatGPT Codex**: Anpassungen an Struktur und Styling
- **Claude**: Überarbeitung, Aufräumen des Repositories, Deployment-Konfiguration

Was das nicht heißt: Die inhaltlichen Angaben stammen von mir und sind belegt. Jede Änderung wurde von mir geprüft, bevor sie veröffentlicht wurde. Fachliche Aussagen zu meinem Werdegang, meinen Kenntnissen und meinen Vorhaben sind keine generierten Formulierungen, sondern von mir verantwortet. Die Verantwortung für Inhalt und Richtigkeit liegt vollständig bei mir, unabhängig davon, welches Werkzeug an welcher Stelle beteiligt war.

Die Historie dieses Repositories wurde beim Aufräumen konsolidiert. Ältere Commits, teils von Agenten-Zugängen erzeugt, sind darin nicht mehr einzeln nachvollziehbar.

## Nutzung

Dies ist kein Open-Source-Projekt und keine Vorlage. Der Code steht hier zur Einsicht, nicht zur Weiterverwendung. Inhalte, Texte, Gestaltung und Bildmaterial sind urheberrechtlich geschützt, alle Rechte vorbehalten. Eine Nutzung, Vervielfältigung oder Veröffentlichung ganz oder in Teilen ist ohne meine ausdrückliche Zustimmung nicht gestattet. Das gilt insbesondere für das Porträtfoto und die persönlichen Angaben.

## Kontakt

Claudiu Dangulea, Wien
[claudiu@dangulea.at](mailto:claudiu@dangulea.at) · [linkedin.com/in/claudang](https://linkedin.com/in/claudang)
