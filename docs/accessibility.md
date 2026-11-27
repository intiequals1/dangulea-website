# Standardskorrekturen und Prüfplan

Stand: 27.11.2026. Zielmaßstab WCAG 2.2 A/AA, HTML und ARIA in HTML. Dies ist keine vollständige Konformitätsbescheinigung.

## Umsetzung

- Helle Metadatenfarbe `#b4a38d`; lesbare Akzenttexte statt der dekorativen Randfarbe. Fokusmarkierungen und reduziertes Bewegungsschema.
- Natives modales `dialog`: Initialfokus auf Schließen, Hintergrund inaktiv, Tab-Grenzen, Escape und Fokusrückgabe. Vertikal scrollbar auch bei geringer Höhe.
- Gemeinsame Seitentitel für Prerendering und SPA; Fokus auf die neue Hauptüberschrift nach Navigation, Sprunganker öffnen ihre Aufklappbereiche.
- Benannte Teilen-/Filtergruppen und individuelle Seitenbereiche; Ergebnisanzahl als höfliche Statusmeldung.
- Deutsches Menü und per Tastatur sichtbarer Sprunglink zum Hauptinhalt.

## Wiederholbare Prüfungen

`pnpm test`, `pnpm build`, `node scripts/check-news-artifact.mjs`, `pnpm validate:html`, `pnpm lint`, `pnpm test:a11y`, `git diff --check`.

Die HTML-Prüfung liest alle gebauten HTML-Dateien lokal, ohne externes Anfragelimit. HTML-/ARIA-Fehler stoppen den Build. Gültige React-Attribute in anderer Großschreibung, boolesche leere Attribute sowie reine Titel-/Whitespace-Stilhinweise werden als Warnungen protokolliert. Unzulässige ARIA-Beschriftungen bleiben Fehler. Der unwirksame Sicherheits-Metaeintrag wird zusätzlich ausdrücklich abgewiesen.

CI führt axe und Bedienungstests in Chromium und WebKit auf neun öffentlichen Seitentypen aus. Berichte werden unter `accessibility-reports` für 14 Tage gespeichert, einschließlich Fehlerspuren. Die bisherigen News-Identitäts-, Faktencheck-, Bild-, Artefakt- und Live-Prüfungen bleiben erhalten.

## Manuelle Abnahme

Zu prüfen und mit tatsächlichem Ergebnis zu ergänzen:

| Prüfung | Status |
| --- | --- |
| Menü, Tastatur, Escape und Fokusrückgabe | offen |
| Titelwechsel, Vor/Zurück und News-Anker | offen |
| Ressourcenfilter, Nulltreffer, Fokus | offen |
| 320 CSS-Pixel und geringe Querformathöhe | offen |
| 200 % Textvergrößerung, Textabstände, Zielgrößen | offen |
| VoiceOver mit Safari: Dialog, Überschriften, Aufklappen, Statusansage | offen |

Die manuelle Browserprüfung ist derzeit unterbrochen: Am 27.11.2026 meldet die Browseranbindung keine verfügbaren Browser; der Zugriff auf Firefox wurde ebenfalls abgebrochen. Die Punkte bleiben ausdrücklich offen.

WebKit im CI ist keine VoiceOver-/Safari-Abnahme. Fehlende manuelle Prüfungen dürfen nicht als bestanden markiert werden. Private Daten werden nicht für diese Prüfung geöffnet.

## HTTP-Header getrennt von HTML-Konformität

Das ungültige `http-equiv="X-Content-Type-Options"` wurde entfernt. `nosniff` wirkt ausschließlich als echter HTTP-Antwortheader. Die bestehende Content-Security-Policy und die Hashprüfung des ausführbaren Inline-Scripts bleiben erhalten.

Der vorhandene Workflow lädt statische Dateien zu GitHub Pages hoch; er bietet hier keine konfigurierbare Response-Header-Schicht. Ein `public/_headers`-File allein würde keine nachgewiesene GitHub-Pages-Konfiguration schaffen. Für selbst gesetzte Header wäre eine gesonderte Hosting-/Proxyentscheidung notwendig. Eine Alternative mit dokumentierter Headerkonfiguration wäre etwa [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/). Diese Änderung führt keinen Hostingwechsel durch. Ein Header darf erst nach Prüfung der ausgelieferten HTTP-Antwort als aktiv gelten.

Berechnete sRGB-Kontraste der korrigierten Palette (Verhältnis):

| Textfarbe | Hintergrund | Alt | Oberfläche | Hover |
| --- | ---: | ---: | ---: | ---: |
| `#b4a38d` Metadaten | 7,28 | 6,75 | 6,08 | 5,48 |
| `#a89880` sekundär | 6,35 | 5,89 | 5,31 | 4,78 |
| `#c8935a` Akzenttext | 6,61 | 6,13 | 5,53 | 4,97 |

Hintergründe: `#1a1714`, `#221e1a`, `#2c2622`, `#332e29`. Dies belegt die Farbpaarungen, ersetzt keine Prüfung von Bildern, Transparenz, Überlagerungen und sämtlichen Zuständen im Browser.

CI-Infrastruktur: Der erste Lauf scheiterte vor den Browsertests an HTTP 403 im Microsoft-APT-Repository des neuen Ubuntu-26.04-Runners. Der Build-Job verwendet deshalb das feste Ubuntu-24.04-LTS-Image; Prüfungen und Signaturkontrollen werden nicht abgeschaltet.

Der erste tatsächlich ausgeführte Browserlauf bestand 21 von 28 Fällen. Er fand zusätzlich nur farblich erkennbare Fließtextlinks und einen vorübergehenden Kontrastfehler durch die Einblendanimation. Fließtextlinks sind nun unterstrichen; die Animation bewegt den Inhalt ohne seine Deckkraft zu reduzieren. Vergrößerte Menütexte dürfen umbrechen; der Regressionstest prüft nun die Scrollbreite des Linkbereichs selbst. Die Prüfregeln bleiben unverändert aktiv.
