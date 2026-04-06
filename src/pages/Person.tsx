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
            <p className="section-label">About</p>
            <h1 className="page-header__title">Claudiu Dangulea</h1>
            <div className="page-header__meta">
              <span>Vienna, Austria</span>
              <span className="meta-sep" aria-hidden="true">·</span>
              <span>Consultant</span>
              <span className="meta-sep" aria-hidden="true">·</span>
              <span>Applied Ethics, University of Innsbruck</span>
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
            <p className="section-label">Profile</p>
            <ul className="profile-list">
              <li>
                <span className="profile-list__key">Location</span>
                <span className="profile-list__val">Vienna, Austria</span>
              </li>
              <li>
                <span className="profile-list__key">Current role</span>
                <span className="profile-list__val">Accountant, KUMHO Tires Austria</span>
              </li>
              <li>
                <span className="profile-list__key">Education</span>
                <span className="profile-list__val">
                  MSc ERP Consulting, Technikum Wien Academy<br />
                  Applied Ethics, University of Innsbruck (Brixen)<br />
                  Business Informatics, University Linz
                </span>
              </li>
              <li>
                <span className="profile-list__key">Languages</span>
                <span className="profile-list__val">
                  German (native) · Romanian (native) · English (fluent)
                </span>
              </li>
              <li>
                <span className="profile-list__key">Interests</span>
                <span className="profile-list__val">
                  Data · Ethics · AI · Sustainability · Process Management
                </span>
              </li>
            </ul>

            <div className="person-contact">
              <p className="section-label" style={{ marginTop: 'var(--space-8)' }}>Contact</p>
              <a href="mailto:dangulea@mailbox.org" className="contact-link">
                dangulea@mailbox.org
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
            <h2 className="person-section__heading">About me</h2>
            <p>
              I am a consultant based in Vienna with a background in business informatics,
              financial accounting, and SAP systems. Over the years I have worked across
              finance, digital transformation, and ERP consulting — at companies like PwC,
              Eviden, and REWE International.
            </p>
            <p>
              My current focus is applied ethics. I am studying at the University of
              Innsbruck in Brixen, exploring where philosophy, technology, and business
              meet. That combination is not accidental — it reflects how I actually think.
            </p>
            <p>
              I work carefully, I ask good questions, and I am ready to start on the right
              project from day one.
            </p>
          </div>
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      {/* ── Experience ── */}
      <section className="person-section">
        <div className="container person-layout">
          <aside className="person-sidebar">
            <p className="section-label">Experience</p>
          </aside>
          <div className="person-body">
            <h2 className="person-section__heading">Professional background</h2>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-item__period">Dec 2025 – present</div>
                <div className="timeline-item__role">Accountant</div>
                <div className="timeline-item__company">KUMHO Tires Austria · Vienna</div>
                <p className="timeline-item__desc">
                  Full-cycle bookkeeping in SAP S/4HANA — accounts payable and receivable,
                  tax administration, payroll notifications, and insurance management.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-item__period">May – Nov 2025</div>
                <div className="timeline-item__role">Specialist IT Consulting</div>
                <div className="timeline-item__company">REWE International AG · Wiener Neudorf</div>
                <p className="timeline-item__desc">
                  SAP AIF and IDoc processing, web form integration, Kafka interface monitoring,
                  Power BI dashboards, and test management in agile project teams.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-item__period">Mar 2023 – Apr 2025</div>
                <div className="timeline-item__role">Junior SAP Consultant</div>
                <div className="timeline-item__company">Eviden Austria · Linz</div>
                <p className="timeline-item__desc">
                  SAP FI/CO customising, Closing Cockpit configuration, transport management,
                  NewGL implementation, and Fiori app integration.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-item__period">Jan 2021 – Jan 2022</div>
                <div className="timeline-item__role">Associate Digital Factory</div>
                <div className="timeline-item__company">PwC Austria · Vienna</div>
                <p className="timeline-item__desc">
                  Process automation with Power Automate and FireStart, Power BI dashboards,
                  process mining with Celonis, and agile project work.
                </p>
              </div>

              <div className="timeline-item">
                <div className="timeline-item__period">Aug 2019 – Dec 2020</div>
                <div className="timeline-item__role">Associate Tax</div>
                <div className="timeline-item__company">PwC Upper Austria · Vienna</div>
                <p className="timeline-item__desc">
                  Financial accounting and tax consulting for multiple clients using BMD NTCS.
                  Digitalization projects and process documentation.
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
            <p className="section-label">Expertise</p>
          </aside>
          <div className="person-body">
            <h2 className="person-section__heading">Areas of expertise</h2>

            <div className="expertise-list">
              <div className="expertise-item">
                <h3 className="expertise-item__title">SAP &amp; ERP Systems</h3>
                <p>
                  Practical experience in SAP FI/CO consulting and implementation — including
                  Closing Cockpit, transport management, Fiori apps, and S/4HANA. Currently
                  completing an MSc in ERP Consulting at Technikum Wien Academy.
                </p>
              </div>

              <div className="expertise-item">
                <h3 className="expertise-item__title">Finance &amp; Accounting</h3>
                <p>
                  Solid background in financial accounting, tax administration, and controlling
                  across multiple industries. Experienced with BMD, Oracle NetSuite, and SAP.
                </p>
              </div>

              <div className="expertise-item">
                <h3 className="expertise-item__title">Data &amp; Process Intelligence</h3>
                <p>
                  Confident with Power BI, SQL, process mining (Celonis), and business
                  intelligence tools. I turn complex data into clear, actionable insight.
                </p>
              </div>

              <div className="expertise-item">
                <h3 className="expertise-item__title">Applied Ethics &amp; Philosophy</h3>
                <p>
                  Studying applied ethics at the University of Innsbruck in Brixen — exploring
                  the philosophical foundations that underpin technology, business decisions,
                  and human interaction.
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
            <p className="section-label">Vision</p>
          </aside>
          <div className="person-body">
            <h2 className="person-section__heading">Where I want to go</h2>
            <p>
              My goal is to move into a role that brings together ethics, strategy, and
              intelligence consulting. I want to work on topics that are genuinely
              interesting, run workshops, write articles, and connect with people who
              think carefully about what they do. Vienna is a good place for that.
            </p>
          </div>
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      {/* ── Personal ── */}
      <section className="person-section person-section--last">
        <div className="container person-layout">
          <aside className="person-sidebar">
            <p className="section-label">Outside of work</p>
          </aside>
          <div className="person-body">
            <h2 className="person-section__heading">Personal interests</h2>
            <p>
              When I am not working, I travel. Finland, Poland, South Tyrol — each trip
              reinforces something I already believe: that people are mostly good, and
              that diversity is worth paying attention to. I value fairness, patience,
              and the kind of openness you find in communities that have learned to
              welcome strangers.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
