import './Person.css'

export default function Person() {
  return (
    <div className="person">
      {/* ── Page header ── */}
      <section className="page-header">
        <div className="container">
          <p className="section-label">About</p>
          <h1 className="page-header__title">Claudiu Dangulea</h1>
          <div className="page-header__meta">
            <span>Vienna, Austria</span>
            <span className="meta-sep" aria-hidden="true">·</span>
            <span>ERP Consultant</span>
            <span className="meta-sep" aria-hidden="true">·</span>
            <span>Applied Ethics, PTH Brixen</span>
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
                <span className="profile-list__key">Role</span>
                <span className="profile-list__val">ERP Consultant</span>
              </li>
              <li>
                <span className="profile-list__key">Education</span>
                <span className="profile-list__val">
                  PTH Brixen — Applied Ethics
                </span>
              </li>
              <li>
                <span className="profile-list__key">Interests</span>
                <span className="profile-list__val">
                  Innovation · Ethics · Intelligence Consulting ·
                  Circular Economy · Technology · Process Management
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
              I am an ERP Consultant with a genuine interest in complex systems and how
              they connect. With over a decade of experience, I bring technical depth
              and strategic thinking together — and I try to do that without losing sight
              of the human side of things.
            </p>
            <p>
              My background is in business informatics. My current focus is applied ethics —
              I am studying at the Philosophisch-Theologische Hochschule in Brixen, exploring
              where philosophy, technology, and business meet. That combination is not accidental.
              It reflects how I actually think.
            </p>
          </div>
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      {/* ── Key Projects ── */}
      <section className="person-section">
        <div className="container person-layout">
          <aside className="person-sidebar">
            <p className="section-label">Daily practice</p>
          </aside>
          <div className="person-body">
            <h2 className="person-section__heading">Key projects &amp; initiatives</h2>
            <p>
              Every day I engage with AI tools — duck.ai, claude.ai, ChatGPT — not just
              to find answers, but to think through ideas, refine arguments, and explore
              new territory. These conversations have become a real part of how I work.
              They keep me sharp and consistently open to new perspectives.
            </p>
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
                <h3 className="expertise-item__title">ERP Systems &amp; Business Informatics</h3>
                <p>
                  Extensive experience in ERP consulting and global system implementation.
                  Skilled in SAP Closing Cockpit and process optimisation across complex
                  organisational environments.
                </p>
              </div>

              <div className="expertise-item">
                <h3 className="expertise-item__title">Strategic &amp; Intelligence Consulting</h3>
                <p>
                  Focused on roles that combine strategic insight with ethical frameworks
                  and innovative thinking. Interested in intelligence consulting as a
                  discipline that demands both rigour and nuance.
                </p>
              </div>

              <div className="expertise-item">
                <h3 className="expertise-item__title">Applied Ethics &amp; Philosophy</h3>
                <p>
                  Currently deepening my understanding of applied ethics at PTH Brixen —
                  exploring the philosophical foundations that underpin technology,
                  business decisions, and human interaction.
                </p>
              </div>

              <div className="expertise-item">
                <h3 className="expertise-item__title">Circular Economy &amp; Sustainable Innovation</h3>
                <p>
                  Committed to developing solutions that create real, reciprocal value —
                  particularly in emerging markets where sustainable models are still
                  being built.
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
            <h2 className="person-section__heading">Professional vision</h2>
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
