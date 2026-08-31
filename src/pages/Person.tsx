import claudiuPhotoWebp from '../assets/claudiu-dangulea.webp'
import claudiuPhotoPng from '../assets/claudiu-dangulea.png'
import './Person.css'

export default function Person() {
  return (
    <div className="person">
      {/* ── Page header ── */}
      <section className="page-header">
        <div className="container page-header__inner">
          <div className="page-header__text">
            <p className="section-label">Über mich</p>
            <h1 className="page-header__title">Claudiu Dangulea</h1>
            <div className="page-header__meta">
              <span>Wien, Österreich</span>
              <span className="meta-sep" aria-hidden="true">·</span>
              <span>Digital Entrepreneur</span>
              <span className="meta-sep" aria-hidden="true">·</span>
              <span>Angewandte Ethik, Universität Innsbruck</span>
            </div>
          </div>
          <div className="page-header__photo-wrap">
            <picture>
              <source srcSet={claudiuPhotoWebp} type="image/webp" />
              <img
                src={claudiuPhotoPng}
                alt="Claudiu Dangulea"
                className="page-header__photo"
                width="600"
                height="756"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="person-section">
        <div className="container person-layout">
          <aside className="person-sidebar">
            <p className="section-label">Profil</p>
            <ul className="profile-list">
              <li>
                <span className="profile-list__key">Standort</span>
                <span className="profile-list__val">Wien, Österreich</span>
              </li>
              <li>
                <span className="profile-list__key">Aktuelle Tätigkeit</span>
                <span className="profile-list__val">
                  Selbstständig, digitale Projekte und Beratung
                </span>
              </li>
              <li>
                <span className="profile-list__key">Ausbildung</span>
                <span className="profile-list__val">
                  Digital Business, Bachelor berufsbegleitend, FH der WKW, ab Sep. 2026<br />
                  Angewandte Ethik, Universität Innsbruck und PTH Brixen, abgeschlossen 2026<br />
                  Prozessmanagement &amp; Business Intelligence, FH Oberösterreich Steyr - ohne Abschluss<br />,
                  und Wirtschaftsinformatik, JKU Linz - ohne Abschluss
                </span>
              </li>
              <li>
                <span className="profile-list__key">Sprachen</span>
                <span className="profile-list__val">
                  Deutsch und Rumänisch (Muttersprache) · Englisch (fließend)
                </span>
              </li>
              <li>
                <span className="profile-list__key">Interessen</span>
                <span className="profile-list__val">
                  KI und Ethik · Nachhaltige Geschäftsmodelle · ERP-Systeme · Digitale Transformation
                </span>
              </li>
            </ul>

            <div className="person-contact">
              <p className="section-label" style={{ marginTop: 'var(--space-8)' }}>Kontakt</p>
              <a href="mailto:claudiu@dangulea.at" className="contact-link">
                claudiu@dangulea.at
              </a>
              <a
                href="https://linkedin.com/in/claudang"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                linkedin.com/in/claudang
              </a>
            </div>
          </aside>

          <div className="person-body">
            <h2 className="person-section__heading">Zur Person</h2>
            <p>
              Ich bin Finance- und ERP-orientierter IT-Consultant in Wien. Meine
              Erfahrung stammt aus dem Rechnungswesen, aus SAP FI/CO-Projekten und aus
              Prozessmanagement und Business Intelligence. Diese Verbindung ist der Kern
              meiner Arbeit: fachliches Verständnis für Buchhaltung, Controlling und
              Steuerprozesse, gepaart mit Systemlogik, Datenanalyse und strukturierter
              Dokumentation.
            </p>
            <p>
              Was mir an formalen akademischen Abschlüssen zeitweise fehlte, habe ich
              über Praxis und beständiges Weiterlernen aufgeholt. Der Weg vom
              Buchhaltungsassistenten über die Buchhaltung bis zur SAP-Beratung war
              keine gerade Linie, aber jede Station hat etwas beigetragen, das ich heute
              nutze.
            </p>
            <p>
              Ab September 2026 kommt ein berufsbegleitender Bachelor in Digital Business
              an der FH der WKW dazu. Technische Systeme und ethische Fragen gehören für
              mich zusammen: Systeme legen fest, was in einem Unternehmen möglich ist,
              und diese Festlegung hat eine ethische Seite.
            </p>
          </div>
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      {/* ── Experience ── */}
      <section className="person-section">
        <div className="container person-layout">
          <aside className="person-sidebar">
            <p className="section-label">Werdegang</p>
          </aside>
          <div className="person-body">
            <h2 className="person-section__heading">Beruflicher Werdegang</h2>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-item__period">Dez. 2025 – Mai 2026</div>
                <div className="timeline-item__role">Buchhalter</div>
                <div className="timeline-item__company">KUMHO Tire Europe GmbH · Wien</div>
                <p className="timeline-item__desc">
                  Kreditoren- und Debitorenbuchhaltung, Zahlungsabwicklung sowie
                  Gutschriften und Reklamationen in SAP S/4HANA. Steuerverwaltung,
                  Lohn- und Gehaltsreporting, Versicherungsmanagement und interne
                  Schulungen.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-item__period">Sep. 2022 – heute</div>
                <div className="timeline-item__role">Digital Entrepreneur</div>
                <div className="timeline-item__company">Selbstständig · Wien</div>
                <p className="timeline-item__desc">
                  Aufbau und Betrieb digitaler Projekte, darunter dangulea.at und
                  claudiu.at. Beratung zu digitalen Werkzeugen und
                  Workflow-Optimierung, Content-Erstellung und Community-Management zu
                  Produktivität, KI, Ethik und Nachhaltigkeit.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-item__period">Mai 2025 – Nov. 2025</div>
                <div className="timeline-item__role">Specialist IT Consulting</div>
                <div className="timeline-item__company">REWE International AG · Wiener Neudorf</div>
                <p className="timeline-item__desc">
                  Mandanteneinrichtung über Webforms und SQL, iDocs in SAP-Tabellen für
                  FI/CO, MDG und AIF. Fach- und Technikkonzepte, Prozessvisualisierung
                  in Visio, Anforderungsmanagement in SOLMAN. Testmanagement für
                  SAP-AIF-Prozesse und Kafka-Integration samt Fehleranalyse. Power BI
                  Dashboards für Prozesskennzahlen.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-item__period">März 2023 – Apr. 2025</div>
                <div className="timeline-item__role">Junior SAP Consultant</div>
                <div className="timeline-item__company">Eviden Austria GmbH · Linz</div>
                <p className="timeline-item__desc">
                  SAP FI/CO-Customizing und Transportwesen. Closing Cockpit für
                  Perioden- und Jahresabschlüsse, NewGL-Implementierung und Migration.
                  Fiori-Apps für FI/CO, SAP Best Practices, SAP BW/4HANA und Power BI
                  für Reporting und Analyse.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-item__period">Jan. 2021 – Jan. 2022</div>
                <div className="timeline-item__role">Associate Digital Factory</div>
                <div className="timeline-item__company">PwC Österreich · Wien</div>
                <p className="timeline-item__desc">
                  Power BI Dashboards für Echtzeit-Analysen, Prozessautomatisierung mit
                  FireStart und Power Automate, Datenanalyse mit XML und Python. Im
                  Low-Code-Umfeld mit Bryter Konzeption und Dokumentation einschließlich
                  Wissensweitergabe. Agile Projektarbeit.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-item__period">Aug. 2019 – Dez. 2020</div>
                <div className="timeline-item__role">Associate Tax</div>
                <div className="timeline-item__company">PwC Oberösterreich · Linz</div>
                <p className="timeline-item__desc">
                  Buchhaltung in BMD NTCS, Monats-, Quartals- und Jahresabschlüsse,
                  Umsatzsteuervoranmeldung über FinanzOnline. Digitalisierungsinitiativen
                  mit Prozessmodellierung in Signavio und Lucidchart. Vorbereitung von
                  CbC-Reports.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-item__period">Okt. 2014 – Dez. 2018</div>
                <div className="timeline-item__role">Finanzadministrator</div>
                <div className="timeline-item__company">Dr. Peter Jonas · Linz</div>
                <p className="timeline-item__desc">
                  Finanzbuchhaltung mit Mahnwesen, Zahlungsverkehr,
                  Umsatzsteuervoranmeldung und §-109a-Meldungen. Vorbereitung der Lohn-
                  und Gehaltsabrechnung, Abstimmung mit der Steuerberatung, Vorbereitung
                  von GPLA- und Betriebsprüfungen. Saldenlisten, OP-Listen und
                  kurzfristige Erfolgsrechnungen für die Geschäftsführung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      {/* ── Expertise ── */}
      <section className="person-section">
        <div className="container person-layout">
          <aside className="person-sidebar">
            <p className="section-label">Schwerpunkte</p>
          </aside>
          <div className="person-body">
            <h2 className="person-section__heading">Fachliche Schwerpunkte</h2>

            <div className="expertise-list">
              <div className="expertise-item">
                <h3 className="expertise-item__title">SAP und ERP</h3>
                <p>
                  SAP FI/CO-Customizing, S/4HANA, AIF und iDocs, Fiori.
                </p>
              </div>

              <div className="expertise-item">
                <h3 className="expertise-item__title">Rechnungswesen</h3>
                <p>
                  Buchhaltung, Monats- und Jahresabschlüsse, Umsatzsteuervoranmeldung,
                  FinanzOnline, Mahnwesen und Lohnverrechnung. Erfahrung aus
                  Steuerberatung, Industrie und interner Buchhaltung.
                </p>
              </div>

              <div className="expertise-item">
                <h3 className="expertise-item__title">Daten und Business Intelligence</h3>
                <p>
                  Power BI mit DAX und Power Query, SQL und fortgeschrittenes Excel.
                  Aus Daten belastbare Aussagen ableiten.
                </p>
              </div>

              <div className="expertise-item">
                <h3 className="expertise-item__title">Prozess und Projekt</h3>
                <p>
                  Signavio, Visio und Lucidchart für Prozessmodellierung, JIRA und
                  Confluence für die Projektarbeit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      {/* ── Vision ── */}
      <section className="person-section">
        <div className="container person-layout">
          <aside className="person-sidebar">
            <p className="section-label">Ausblick</p>
          </aside>
          <div className="person-body">
            <h2 className="person-section__heading">Wohin ich will</h2>
            <p>
              Ich möchte in einer Rolle arbeiten, die ERP-Systeme, Datenanalyse und
              ethische Fragestellungen zusammenführt. Konkret heißt das: Prozesse
              verstehen, bevor sie automatisiert werden, und die Frage stellen, ob eine
              technisch mögliche Lösung auch eine sinnvolle ist. Dazu der Austausch mit
              Menschen, die sorgfältig über ihre Arbeit nachdenken. Wien ist dafür ein
              guter Ort.
            </p>
          </div>
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      {/* ── Personal ── */}
      <section className="person-section person-section--last">
        <div className="container person-layout">
          <aside className="person-sidebar">
            <p className="section-label">Privates</p>
          </aside>
          <div className="person-body">
            <h2 className="person-section__heading">Außerhalb der Arbeit</h2>
            <p>
              Wenn ich nicht arbeite, reise ich. Jede Reise bestätigt etwas, das ich
              ohnehin glaube: dass die meisten Menschen es gut meinen und dass Vielfalt
              Aufmerksamkeit verdient. Ich schätze Fairness, Geduld und die Offenheit,
              die man in Gemeinschaften findet, die gelernt haben, Fremde aufzunehmen.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
