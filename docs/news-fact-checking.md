# Gemeinsamer Faktencheck für News

Die bisherige Quellenrecherche und die ergänzte Gegenprüfung laufen im selben täglichen News-Auftrag. Es gibt keinen zweiten parallelen Veröffentlichungsauftrag. Beide Stufen müssen dieselbe endgültige Artikelversion freigeben, bevor Archiv, Build oder Deployment fortfahren.

## Unterschiedliche Prüfstrategien

| Stufe | Vorgehen | Typische Fehler, die auffallen sollen |
| --- | --- | --- |
| Quellenabgleich (`source-evidence-v1`) | Überschrift und vollständigen Faktenabschnitt in Aussagen aufteilen; Originalquellen tatsächlich lesen; jede Aussage mit konkreten Quellen und einer Begründung abgleichen. | Erfundenes Ereignis, falsche Zahl, unbelegte Behauptung, falsche Zuschreibung. |
| Gegenprüfung (`counter-check-v1`) | In einem getrennten Durchgang aktiv nach Gegenbelegen und Einschränkungen suchen; mindestens zwei verschiedene gezielte Suchanfragen; Datum/Zahlen, Geltungsbereich, Quellenabhängigkeiten und Widersprüche gesondert bewerten. | Planung als Einführung dargestellt, Anbieterbehauptung als unabhängiger Nachweis ausgegeben, falscher Bezugszeitraum, doppelte Wiedergabe derselben Pressemitteilung. |

Die zweite Stufe übernimmt nicht einfach das Urteil der ersten. Sie darf und soll eine Veröffentlichung stoppen. Ein eigener API-gestützter zweiter Modellanbieter ist nicht konfiguriert. Beide Durchgänge können vom bestehenden Codex-Rechercheagenten ausgeführt werden; unterschiedliche Strategien machen daraus keine garantierte Modellunabhängigkeit und keine Wahrheitsgarantie.

## Was Software prüft und was recherchiert werden muss

Der Rechercheagent führt die inhaltliche Prüfung mit Browser-/Suchwerkzeugen aus. Das Programm `scripts/news-factcheck.mjs` ersetzt diese Recherche nicht. Es prüft die Vollständigkeit und Textzuordnung der dokumentierten Ergebnisse: vollständige Aussagenabdeckung, zwei unterschiedliche Methoden, nachvollziehbare Belege und Begründungen, Gegenrecherche, Zeitstempel und sichtbare Einschränkungen.

HTTP 200, eine Quellen-URL oder Wortübereinstimmungen allein belegen keine Wahrheit. Eine Quelle darf nur als gelesen verwendet werden, wenn ihr relevanter Inhalt tatsächlich zugänglich war. Ein Suchtreffer oder eine Paywall gilt nicht als vollständige Prüfung. Fehlende Belege, Widersprüche und offene Aussagen blockieren die Freigabe. Wiedergebende Medienberichte über dieselbe Pressemitteilung zählen nicht als unabhängige Bestätigungen.

## Pflichtablauf für neue oder geänderte Meldungen

1. Die News-Quelle aktualisieren; noch nicht `news:sync` ausführen.
2. `pnpm news:factcheck:draft` erstellt offene Vorlagen in der ignorierten Datei `data/news-fact-checks.pending.json`. Für die Nachprüfung bestehender Ausgaben: `node scripts/news-factcheck.mjs --draft --date YYYY-MM-DD`.
3. Stufe 1 durchführen. Jede vorgegebene Überschrift/Aussage exakt erhalten; Quellen öffnen und Begründungen protokollieren. Neue Zusatzbehauptungen im Artikel ändern die Vorlage und erfordern neue Prüfungen.
4. Stufe 2 in einem getrennten kritischen Durchgang durchführen. Mindestens zwei passende Gegenrecherchen mit konkreten Suchanfragen, geöffneten Quellen und Befunden dokumentieren. Die vier Felder `datesAndNumbers`, `scopeAndQualifications`, `sourceIndependence` und `contradictions` mit konkreten Ergebnissen füllen.
5. Jeder Aussage ein belastbares Ergebnis zuordnen: `supported` oder `qualified`. `qualified` erfordert im Beitrag sichtbare Einschränkungen in `limitations`. `unresolved`, `contradicted`, fehlende Angaben oder `pending` erlauben keine Veröffentlichung. Bei Problemen Text verbessern oder Meldung vor Veröffentlichung ersetzen und beide Stufen erneut ausführen.
6. Die tatsächlich abgeschlossenen Prüfungen in `data/news-fact-checks.json` unter `reviews` ablegen, mit Prüferrolle und tatsächlichem ISO-Zeitpunkt. Vorlagen dürfen niemals pauschal auf Erfolg gesetzt werden. Es gibt keinen automatischen Befehl, der eine Freigabe erzeugt.
7. `pnpm news:factcheck`, danach `pnpm news:sync`, Tests, Build und Freigabeprüfungen ausführen.
8. News-Datei, Archiv und Prüfprotokoll gemeinsam auf dem Tagesbranch committen und den [Pull-Request-Ablauf](news-sharing.md#verpflichtender-veröffentlichungsablauf) bis zur erfolgreichen Live-Prüfung abschließen.

## Bestandsmeldungen und Darstellung

Die vor Einführung vorhandenen 170 Artikel sind mit ihrem exakten Inhaltshash als ungeprüfter Bestand erfasst. Das ist keine bestandene Prüfung. Der Build erlaubt ausschließlich diese unveränderten Versionen und zeigt ihren fehlenden zweistufigen Prüfstatus ausdrücklich an. Die Ausnahme darf nach Einführung weder erweitert noch auf andere Texte übertragen werden; CI vergleicht sie mit dem Vorgängercommit.

Der Artikel vom 04.11.2026 zu Cohere North wurde bei Einführung tatsächlich in beiden Durchgängen nachgeprüft, mit den Einschränkungen der Anbieterquellen und dem für 2027 geplanten Sovereign-Cloud-Angebot. Die übrigen Bestandsmeldungen werden nicht rückwirkend als geprüft ausgegeben.

In der Oberfläche und im RSS-Feed steht „Quellenaussagen“ anstelle der pauschalen Abschnittsüberschrift „Fakten“. Das interne historische Textformat verwendet weiterhin `Fakten:`, damit bestehende URLs und Eingaben kompatibel bleiben. Jeder Artikel zeigt seinen Prüfstatus und gegebenenfalls Quellenvorbehalte. Automatisierte Prüfung ersetzt keine unabhängige redaktionelle Prüfung; Fehler bleiben möglich.
