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
            Karl-Popper-Straße 5<br />
            1100 Wien<br />
            Österreich
          </p>
          <p>
            <strong>Telefon:</strong> +43 676 30 133 07<br />
            <strong>E-Mail:</strong>{' '}
            <a href="mailto:claudiu.dangulea@gmail.com">claudiu.dangulea@gmail.com</a>
          </p>
        </section>

        <div className="divider" />

        <section className="legal-section">
          <h2>Verantwortlich für den Inhalt</h2>
          <p>Claudiu Dangulea (Anschrift wie oben)</p>
        </section>

        <div className="divider" />

        <section className="legal-section">
          <h2>EU-Streitschlichtung</h2>
          <p>
            Gemäß Verordnung über Online-Streitbeilegung in Verbraucherangelegenheiten
            (ODR-Verordnung) stellt die Europäische Kommission eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>
            Ich bin weder bereit noch verpflichtet, an Streitbeilegungsverfahren
            vor einer Verbraucherschlichtungsstelle teilzunehmen.
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
          <h2>Datenschutzerklärung</h2>

          <h3>Verantwortlicher</h3>
          <p>
            Claudiu Dangulea<br />
            Karl-Popper-Straße 5, 1100 Wien<br />
            E-Mail:{' '}
            <a href="mailto:claudiu.dangulea@gmail.com">claudiu.dangulea@gmail.com</a>
          </p>

          <h3>Hosting</h3>
          <p>
            Diese Webseite wird auf GitHub Pages (GitHub, Inc., 88 Colin P Kelly Jr St,
            San Francisco, CA 94107, USA) gehostet. Beim Besuch werden durch den
            Hosting-Anbieter automatisch Informationen erfasst (Server-Logfiles),
            darunter IP-Adresse, Browsertyp, Betriebssystem, Referrer URL und
            Uhrzeit der Serveranfrage.
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
            <a href="mailto:claudiu.dangulea@gmail.com">claudiu.dangulea@gmail.com</a>
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
          <p className="legal-date">Stand: Jänner 2025</p>
        </section>

      </div>
    </div>
  )
}
