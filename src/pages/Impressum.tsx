import './Impressum.css'

export default function Impressum() {
  return (
    <div className="impressum">
      <section className="page-header">
        <div className="container">
          <p className="section-label">Legal</p>
          <h1 className="page-header__title">Impressum</h1>
        </div>
      </section>

      <div className="container container--text impressum-body">

        <section className="legal-section">
          <h2>Angaben gemäß § 5 ECG, § 25 MedienG</h2>
          <p>
            Claudiu Dangulea<br />
            Karl-Popper-Straße 5/217<br />
            1100 Wien<br />
            Österreich
          </p>
          <p>
            <strong>Telefon:</strong> +43 676 30 133 07<br />
            <strong>E-Mail:</strong>{' '}
            <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>
          </p>
        </section>

        <div className="divider" />

        <section className="legal-section">
          <h2>Verantwortlich für den Inhalt</h2>
          <p>Claudiu Dangulea (Anschrift wie oben)</p>
        </section>

        <div className="divider" />

        <section className="legal-section">
          <h2>Automatisierte Inhalte und KI-Unterstützung</h2>
          <p>
            Auf dieser Website, insbesondere im Bereich „News“, können Inhalte ganz
            oder teilweise automatisiert und unter Einsatz künstlicher Intelligenz
            erstellt, zusammengefasst oder sprachlich bearbeitet werden. Dafür können
            insbesondere Perplexity-Automatisierungen eingesetzt werden.
          </p>
          <p>
            Automatisierte Inhalte werden auf der jeweiligen Seite als solche
            gekennzeichnet. Soweit ein Beitrag nicht einzeln vor Veröffentlichung
            redaktionell geprüft wurde, wird keine individuelle redaktionelle Prüfung
            behauptet. Die inhaltliche Verantwortung für veröffentlichte eigene Inhalte
            liegt bei der oben genannten verantwortlichen Person.
          </p>
          <p>
            Hinweise auf Fehler, unklare Quellen, veraltete Angaben oder notwendige
            Korrekturen können an{' '}
            <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a> gesendet
            werden.
          </p>
        </section>

        <div className="divider" />

        <section className="legal-section">
          <h2>Haftungsausschluss</h2>
          <h3>Haftung für Inhalte</h3>
          <p>
            Die Inhalte dieser Webseiten wurden mit größter Sorgfalt erstellt.
            Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann ich
            jedoch keine Gewähr übernehmen. Als Diensteanbieter bin ich gemäß § 7 Abs. 1
            ECG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
            verantwortlich. Nach §§ 8 bis 10 ECG bin ich als Diensteanbieter jedoch
            nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
          <h3>Haftung für Links</h3>
          <p>
            Diese Webseiten enthalten Links zu externen Webseiten Dritter, auf deren
            Inhalte ich keinen Einfluss habe. Für die Inhalte der verlinkten Seiten ist
            stets der jeweilige Anbieter oder Betreiber verantwortlich. Zum Zeitpunkt
            der Verlinkung waren keine Rechtsverstöße erkennbar. Bei Bekanntwerden von
            Rechtsverletzungen werde ich derartige Links umgehend entfernen.
          </p>
        </section>

        <div className="divider" />

        <section className="legal-section">
          <h2>Urheberrecht</h2>
          <p>
            Die durch mich erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung,
            Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
            Urheberrechtes bedürfen meiner schriftlichen Zustimmung. Soweit die Inhalte
            auf diesen Seiten nicht von mir erstellt wurden, werden die Urheberrechte
            Dritter beachtet.
          </p>
        </section>

        <div className="divider" />

        <section className="legal-section">
          <h2 id="datenschutz">Datenschutzerklärung</h2>

          <h3>Verantwortlicher</h3>
          <p>
            Claudiu Dangulea<br />
            Karl-Popper-Straße 5, 1100 Wien<br />
            E-Mail:{' '}
            <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>
          </p>

          <h3>Hosting</h3>
          <p>
            Diese Webseite wird auf GitHub Pages (GitHub, Inc., 88 Colin P Kelly Jr St,
            San Francisco, CA 94107, USA) gehostet. Beim Besuch werden durch den
            Hosting-Anbieter automatisch Informationen erfasst (Server-Logfiles),
            darunter IP-Adresse, Browsertyp, Betriebssystem, Referrer URL und
            Uhrzeit der Serveranfrage.
          </p>

          <h3>Cookies, Browser-Speicher und Schriftarten</h3>
          <p>
            Die öffentlichen Seiten verwenden keine Analyse- oder Werbetracker und setzen keine eigenen
            Cookies. Die Schriftarten Inter und Playfair Display werden zusammen mit den Seiten von
            dangulea.at ausgeliefert; dafür werden keine Google-Fonts-Server kontaktiert.
            Externe Quellen und Social-Media-Teilenfunktionen sind Links. Erst beim Öffnen eines solchen
            Links gelten zusätzlich die Datenschutzbestimmungen der jeweiligen Zielseite.
          </p>
          <p>
            Im internen Bereich wird nach der ausdrücklich gestarteten Anmeldung technisch erforderlicher
            Browser-Sitzungsspeicher verwendet. Es wird kein dauerhaftes Tracking-Profil auf dieser Website angelegt.
          </p>

          <h3 id="datenschutzhinweis">Datenschutzhinweis</h3>
          <p>
            Beim ersten Besuch erscheint am unteren Rand ein kurzer Hinweis. Er informiert nur und fragt keine
            Einwilligung ab, weil die öffentlichen Seiten nichts einsetzen, das eine Einwilligung erfordert.
            Wenn Sie „Verstanden“ wählen, speichert Ihr Browser im lokalen Speicher (localStorage) unter dem
            Schlüssel <code>dangulea.datenschutzhinweis.v1</code> den Wert „geschlossen“, damit der Hinweis nicht
            bei jedem Seitenaufruf wiederkommt. Der Eintrag enthält keine Kennung, wird nicht übertragen und bleibt,
            bis Sie die Websitedaten in Ihrem Browser löschen. Diese Speicherung ist für die von Ihnen ausgelöste
            Funktion unbedingt erforderlich (§ 165 Abs. 3 TKG 2021, Umsetzung von Art. 5 Abs. 3 der
            ePrivacy-Richtlinie 2002/58/EG).
          </p>

          <h3 id="interner-login">Interner Bereich: Google-Anmeldung und Google Sheets</h3>
          <p>
            Der interne Skill-Radar ist zugangsbeschränkt. Die Anmeldung über Google/Firebase Authentication
            wird erst durch den Klick auf „Mit Google anmelden“ gestartet. Ein bloßer Besuch der abgemeldeten
            Seite startet diesen Dienst nicht. Nach erteilter Zugriffsfreigabe werden die berechtigten Inhalte
            eines privaten Google Sheets direkt über die Google-Sheets-API geladen.
          </p>
          <p>
            Für Anmeldung, Zugriffskontrolle und Anzeige des Kontos werden insbesondere Google-Kontokennung,
            E-Mail-Adresse, gegebenenfalls Name und Profilbild sowie Anmelde- und Zugriffstokens verarbeitet.
            Bei den Dienstaufrufen erhält Google außerdem technische Verbindungsdaten, insbesondere die
            IP-Adresse und Browserinformationen. Anbieter sind Google und die für diese Dienste zuständigen
            verbundenen Unternehmen; Informationen stehen in den{' '}
            <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase-Datenschutzhinweisen</a>{' '}
            und der{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google-Datenschutzerklärung</a>.
            Eine Verarbeitung außerhalb der EU bzw. des EWR kann dabei nicht ausgeschlossen werden.
          </p>
          <p>
            Zweck ist die sichere Bereitstellung des ausdrücklich angeforderten privaten Arbeitsbereichs.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Zugangskontrolle und
            sicherem Betrieb). Die dafür unbedingt erforderliche Sitzungsspeicherung erfolgt nach der
            Ausnahme in § 165 Abs. 3 TKG 2021. Die Freigabe im Google-Anmeldefenster bestimmt den erlaubten
            Zugriff auf das Sheet; sie dient nicht als pauschale Einwilligung in andere Google-Dienste.
          </p>
          <p>
            In sessionStorage werden die Konto-E-Mail, ein Zugriffstoken und dessen Ablaufzeit gespeichert.
            Die Website nutzt dieses Token höchstens 55 Minuten; abgelaufene Einträge werden beim nächsten
            Zugriff entfernt. Auch Firebase ist auf Sitzungspersistenz eingestellt. Beim Abmelden werden die
            lokalen Anmeldedaten entfernt und der Widerruf des Google-Zugriffstokens angefordert.
            Beim Schließen des Tabs oder Fensters endet der Sitzungsspeicher üblicherweise; die Wiederherstellung
            einer Browsersitzung kann ihn erhalten. Bei Google kann eine vorhandene Kontoanmeldung unabhängig
            davon bestehen bleiben. Google kann im Anmeldefenster und auf seinen eigenen Domains Cookies und
            weitere Speichertechniken einsetzen.
          </p>
          <p>
            Ein bei Firebase angelegter Kontodatensatz wird durch das Abmelden nicht automatisch gelöscht.
            Eine Löschung kann über die oben genannte Kontaktadresse angefordert werden. Für eigene technische
            Protokolle nennt Firebase Authentication eine Aufbewahrung von IP-Adressen für einige Wochen;
            Einzelheiten und weitere Speicherfristen beschreibt Google in den verlinkten Datenschutzhinweisen.
          </p>

          <h3>KI- und Automatisierungsdienste</h3>
          <p>
            Für die Recherche, Zusammenfassung, Strukturierung oder sprachliche
            Bearbeitung von News-Inhalten können externe KI- und Automatisierungsdienste,
            insbesondere Perplexity AI, Inc., eingesetzt werden. Dabei sollen keine
            vertraulichen Informationen, Zugangsdaten, Geschäftsgeheimnisse oder
            sensiblen personenbezogenen Daten an solche Dienste übermittelt werden.
          </p>
          <p>
            Soweit im Einzelfall personenbezogene Daten verarbeitet werden, erfolgt dies
            nach Maßgabe der anwendbaren Datenschutzvorschriften. Je nach eingesetztem
            Dienst, Konto und technischer Einbindung können Anbieter eigene Protokoll-,
            Nutzungs- oder Metadaten verarbeiten.
          </p>

          <h3>Ihre Rechte</h3>
          <p>Sie haben das Recht auf:</p>
          <ul className="legal-list">
            <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li>Beschwerde bei der Datenschutzbehörde (Art. 77 DSGVO)</li>
          </ul>
          <p>
            <strong>Österreichische Datenschutzbehörde</strong><br />
            Barichgasse 40–42, 1030 Wien<br />
            Telefon: +43 1 52 152-0<br />
            E-Mail: dsb@dsb.gv.at<br />
            Web:{' '}
            <a
              href="https://www.dsb.gv.at"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.dsb.gv.at
            </a>
          </p>

          <h3>Kontakt bei Datenschutzfragen</h3>
          <p>
            Bei Fragen zum Datenschutz erreichen Sie mich unter:{' '}
            <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>
          </p>
        </section>

        <div className="divider" />

        <section className="legal-section legal-section--last">
          <h2>Geltungsbereich</h2>
          <p>
            Dieses Impressum gilt für folgende Webauftritte:{' '}
            <a href="https://www.dangulea.at" target="_blank" rel="noopener noreferrer">
              www.dangulea.at
            </a>
            ,{' '}
            <a href="https://www.ethics.at" target="_blank" rel="noopener noreferrer">
              www.ethics.at
            </a>
          </p>
          <p className="legal-date">Stand: 16. November 2026</p>
        </section>

      </div>
    </div>
  )
}
