# Dauerhafte News-Artikel und Bilder

Jede nummerierte Meldung aus `public/news-updates.json` wird ein eigener, ohne JavaScript lesbarer Artikel unter `https://dangulea.at/news/YYYY-MM-DD/NUMMER/`. Datum und Nummer sind eine dauerhafte Identität. Bestehende Tagesanker und RSS-GUIDs bleiben erhalten.

## Daten und Schutz vor verlorenen Links

`data/news-archive.json` ist das versionierte, dauerhafte Archiv aller Einzelmeldungen. `pnpm news:sync` übernimmt neue Ausgaben und Textkorrekturen, behält ältere Artikel auch dann, wenn eine Ausgabe später aus der Eingabedatei herausfällt, und erzeugt das interne Frontend-Manifest. Das Archiv muss mit der News-Datei gemeinsam committed werden. Ein unsynchrones Archiv stoppt den Build.

Veröffentlichte Nummern und Überschriften niemals neu zuordnen oder durch andere Meldungen ersetzen. Auch ein zweiter Lauf am selben Tag muss die veröffentlichte Ausgabe erhalten. Faktenkorrekturen im Text sind möglich; danach erneut synchronisieren. Eine notwendige Überschriftenkorrektur erfordert eine bewusste, gesonderte Änderung des Identitätsvertrags und des historischen Prüfschritts. Der automatische Lauf darf diese Sperre nicht umgehen.

Vor jedem Actions-Build vergleicht `check-news-history.mjs` das Archiv mit dem vorherigen Commit bzw. der PR-Basis. Eine entfernte oder neu zugeordnete bereits veröffentlichte Identität stoppt die Veröffentlichung.

## Lokale Voraussetzungen

- Node.js 22.12 oder neuer, pnpm 10
- Python 3.12; Pillow gemäß `scripts/requirements-news.txt`
- Mitgelieferte DejaVu-Schriften samt Lizenz in `scripts/fonts/`

```sh
pnpm install --frozen-lockfile
python3 -m pip install -r scripts/requirements-news.txt
pnpm news:sync
pnpm test
pnpm build
node scripts/check-news-artifact.mjs
pnpm lint
git diff --check
```

Bei verwalteten Python-Installationen eine virtuelle Umgebung verwenden und sie vor den Befehlen aktivieren. Der Build benötigt keine externen Bilder, API-Schlüssel oder nachgeladenen Schriften. Die Bilder werden deterministisch aus dem jeweiligen Titel, Datum und Nachrichtenauszug gesetzt.

## Verpflichtender Veröffentlichungsablauf

Für neue oder inhaltlich geänderte Meldungen gilt vor der Archiv-Synchronisierung der gemeinsame zweistufige [Faktencheck](news-fact-checking.md). `pnpm news:factcheck` muss erfolgreich sein. News-Datei, Archiv und `data/news-fact-checks.json` werden gemeinsam committed. Unveränderte, noch ungeprüfte Bestandsmeldungen sind ausdrücklich als solche gekennzeichnet.

1. Aktuellen `main` holen und neue Tagesausgabe ergänzen.
2. `pnpm news:sync`: Archiv übernehmen, Artikelstruktur und Identitäten prüfen.
3. Tests und vollständigen Build ausführen. Dieser erzeugt alle statischen Seiten, Metadaten, JSON-LD, die Sitemap und je Artikel ein individuelles PNG mit 1200×630 sowie 1080×1920 Pixeln.
4. Der Build prüft alle Artikel und beide Bilder vollständig: Dateiexistenz, PNG-Decodierung, Maße, Größenlimit, unterschiedliche Bildinhalte, Artikeltext und Quellen, Canonical, Open Graph, Twitter Card, JSON-LD, Share-Buttons, LinkedIn/Facebook-Zieladressen sowie die Bild-/Artikel-Zuordnung des Story-Teilen-Buttons.
5. Negative Tests beschädigen echte Build-Dateien gezielt und müssen von der Freigabeprüfung zurückgewiesen werden. Sie stellen alle Dateien anschließend wieder her.
6. Beide Datendateien gemeinsam committen. Keine generierten Dateien aus `dist/` oder `src/generated/` committen.
7. GitHub Actions führt alle Prüfungen erneut aus. Nur ein erfolgreicher Build lädt das Pages-Artefakt hoch. `deploy` hängt mit `needs: build` daran; kein Fehler wird ignoriert. PRs werden geprüft und veröffentlichen nichts.
8. Nach Veröffentlichung prüft der Actions-Job `verify-live` alle archivierten Artikel und Bilder per HTTP. Lokal kann derselbe Abgleich mit `pnpm verify:live` wiederholt werden. Eine fehlgeschlagene Live-Prüfung ist ein fehlgeschlagener Lauf und muss untersucht werden; sie kann bereits erfolgte Hosting-Auslieferung nicht rückwirkend verhindern.

Das bestehende tägliche Codex-Update muss denselben Ablauf verwenden: News-Datei und Archiv gemeinsam schreiben, alle Prüfungen vor Push bestehen und die Live-Prüfung nach erfolgreichem Pages-Deploy abwarten. Der Ablauf ist keine zweite News-Automatisierung.

## Veröffentlichung dieser Änderung

Die Änderungen gehören vollständig einschließlich `.github/workflows/deploy.yml`, Archiv, Prüfscripten und Schriftdateien ins Repository. Der Build kann unvollständige Übernahmen absichtlich nicht veröffentlichen.

Bei Übernahme als Patch zuerst dessen Basis prüfen und anschließend im Repository anwenden:

```sh
git switch -c news-sharing
git apply --check dangulea-news-sharing.patch
git apply dangulea-news-sharing.patch
```

Danach die obigen Installations- und Prüfschritte ausführen, alle Änderungen committen und als PR nach `main` übertragen. Erst nach erfolgreicher Prüfung mergen. GitHub Pages muss wie bisher als Quelle **GitHub Actions** verwenden. Der Push auf `main` startet den vorhandenen erweiterten Deploy-Workflow. Anschließend `pnpm verify:live` ausführen und den Workflow bis einschließlich `verify-live` auf Erfolg prüfen.

## Teilen

LinkedIn und Facebook lesen die individuellen Open-Graph-Angaben aus dem ersten HTML-Abruf. Inhaltlich geänderte Artikel erhalten neue Bilddateinamen, damit Caches die neue Fassung erkennen. Die Plattformen bestimmen die tatsächlich angezeigte Vorschau; falls nötig deren Vorschau-Cache neu einlesen lassen. Ein Login bzw. tatsächlicher Social-Media-Post ist kein Teil des automatischen Tests.

Die Story-Bilder liegen bereits unter versionierten Adressen auf dangulea.at. Sobald ein Story-Button in Sichtweite kommt, bereitet der Browser auf unterstützten Geräten das Bild im Hintergrund vor und nutzt seinen HTTP-Cache. Der Arbeitsspeicher-Cache ist begrenzt. „Story teilen“ übergibt das vorbereitete PNG und die kanonische Artikel-URL gemeinsam an das Geräte-Teilenmenü, ohne einen vorherigen Speichern-Schritt. Der Link wird zusätzlich nach Möglichkeit kopiert. Netzwerkabruf und Zwischenablage werden vor `navigator.share()` nicht abgewartet, damit die erforderliche Klick-Aktivierung erhalten bleibt. Ist das Bild bei einem sehr frühen Klick noch nicht bereit, fordert die Seite nach Vorbereitung einen erneuten Klick an.

Instagram kann den übergebenen Link ignorieren; ein automatisch anklickbarer Link-Sticker lässt sich von der Website aus nicht erzwingen. Den Link-Sticker gegebenenfalls in Instagram mit dem kopierten Artikel-Link ergänzen. Eine erfolgreich erfüllte Web-Share-Anfrage bedeutet ausschließlich Übergabe an das Betriebssystem, nicht Veröffentlichung einer Instagram-Story.

Unterstützt ein Gerät das gemeinsame Teilen von Bild und URL nicht oder tritt ein Fehler auf, erscheinen die Online-Bildvorschau und der Artikel-Link. Abbrechen öffnet keine Ersatzaktion. Es wird kein automatischer Download ausgelöst. Der allgemeine „Teilen“-Button bleibt für das Teilen der Artikeladresse verfügbar. Wenn die Zwischenablage gesperrt ist, erscheint der Link zur manuellen Auswahl.
