import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__content container">
          <div className="hero__inner">
            <div className="hero__text">
              <p className="section-label">Consultant · Wien</p>
              <h1 className="hero__title">
                Claudiu<br />
                <em>Dangulea</em>
              </h1>
              <p className="hero__subtitle">
                Rechnungswesen, SAP FI/CO und Business Intelligence. Ich verbinde
                fachliches Verständnis aus Buchhaltung und Controlling mit Systemlogik
                und Datenanalyse.
              </p>
              <div className="hero__actions">
                <Link to="/person" className="btn btn--primary">
                  Zur Person
                </Link>
                <a
                  href="mailto:claudiu@dangulea.at"
                  className="btn btn--ghost"
                >
                  Kontakt aufnehmen
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intro strip ── */}
      <section className="intro">
        <div className="container container--text">
          <div className="divider" />
          <p className="intro__text">
            Ich bin Claudiu Dangulea, Finance- und ERP-orientierter IT-Consultant in
            Wien. Meine Arbeit liegt dort, wo Buchhaltung, Steuerprozesse und
            ERP-Systeme aufeinandertreffen: in der Analyse von Finanz-Prozessen und in
            der Vermittlung zwischen Fachbereich, IT und Management.
          </p>
          <div className="divider" />
        </div>
      </section>

      {/* ── Expertise cards ── */}
      <section className="expertise">
        <div className="container">
          <p className="section-label">Schwerpunkte</p>
          <h2 className="expertise__heading">Fachliche Schwerpunkte</h2>

          <div className="cards">
            <article className="card">
              <div className="card__number" aria-hidden="true">01</div>
              <h3 className="card__title">SAP und ERP</h3>
              <p className="card__text">
                Praktische Erfahrung in SAP FI/CO-Customizing, Transportwesen und
                Closing Cockpit für Perioden- und Jahresabschlüsse.
                NewGL-Implementierung, Fiori-Apps und S/4HANA.
              </p>
            </article>

            <article className="card">
              <div className="card__number" aria-hidden="true">02</div>
              <h3 className="card__title">Rechnungswesen</h3>
              <p className="card__text">
                Buchhaltung, Monats- und Jahresabschlüsse, Umsatzsteuervoranmeldung und
                Lohnverrechnung über mehrere Branchen hinweg. Systemseitig BMD NTCS
                und SAP.
              </p>
            </article>

            <article className="card">
              <div className="card__number" aria-hidden="true">03</div>
              <h3 className="card__title">Daten und Prozesse</h3>
              <p className="card__text">
                Power BI mit DAX und Power Query, SQL und fortgeschrittenes Excel.
                Prozessmodellierung in Signavio, Visio und Lucidchart.
              </p>
            </article>

            <article className="card">
              <div className="card__number" aria-hidden="true">04</div>
              <h3 className="card__title">Angewandte Ethik</h3>
              <p className="card__text">
                Universitätslehrgang Angewandte Ethik an der Universität Innsbruck und
                der PTH Brixen, abgeschlossen 2026. Schwerpunkt auf den ethischen
                Fragen von Nachhaltigkeit und Bioethik.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Vision strip ── */}
      <section className="vision">
        <div className="container container--text">
          <p className="section-label">Richtung</p>
          <blockquote className="vision__quote">
            „Ich möchte in einer Rolle arbeiten, die ERP-Systeme, Datenanalyse und
            ethische Fragestellungen zusammenführt. An Themen, die mich interessieren,
            mit Menschen, die sorgfältig arbeiten."
          </blockquote>
          <p className="vision__author">— Claudiu Dangulea</p>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="cta">
        <div className="container container--text">
          <div className="divider" />
          <p className="section-label">Kontakt</p>
          <h2 className="cta__heading">Sprechen wir.</h2>
          <p className="cta__text">
            Wenn ein Projekt dazu passt, freue ich mich über eine Nachricht.
          </p>
          <div className="cta__links">
            <a href="mailto:claudiu@dangulea.at" className="btn btn--primary">
              claudiu@dangulea.at
            </a>
            <a
              href="https://linkedin.com/in/claudang"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
