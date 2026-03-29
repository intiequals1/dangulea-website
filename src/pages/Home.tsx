import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__content container">
          <p className="section-label">ERP Consultant · Vienna</p>
          <h1 className="hero__title">
            Claudiu<br />
            <em>Dangulea</em>
          </h1>
          <p className="hero__subtitle">
            Business informatics. Applied ethics. A decade of experience
            in complex systems — and the curiosity to keep going.
          </p>
          <div className="hero__actions">
            <Link to="/person" className="btn btn--primary">
              About me
            </Link>
            <a
              href="mailto:claudiu.dangulea@gmail.com"
              className="btn btn--ghost"
            >
              Get in touch
            </a>
          </div>
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ── Intro strip ── */}
      <section className="intro">
        <div className="container container--text">
          <div className="divider" />
          <p className="intro__text">
            My name is Claudiu. I am an ERP Consultant based in Vienna with a background
            in business informatics. I work at the intersection of technology, strategy,
            and ethics — and I am ready to bring that combination to the right project,
            from day one.
          </p>
          <div className="divider" />
        </div>
      </section>

      {/* ── Expertise cards ── */}
      <section className="expertise">
        <div className="container">
          <p className="section-label">What I bring</p>
          <h2 className="expertise__heading">Areas of expertise</h2>

          <div className="cards">
            <article className="card">
              <div className="card__number" aria-hidden="true">01</div>
              <h3 className="card__title">ERP Systems</h3>
              <p className="card__text">
                Over a decade of hands-on experience in ERP consulting and global
                system implementation. Proficient in SAP Closing Cockpit and
                end-to-end process optimisation.
              </p>
            </article>

            <article className="card">
              <div className="card__number" aria-hidden="true">02</div>
              <h3 className="card__title">Strategic Consulting</h3>
              <p className="card__text">
                Focused on intelligence consulting with an emphasis on strategic
                insight, ethical decision-making, and frameworks that hold up
                under real-world pressure.
              </p>
            </article>

            <article className="card">
              <div className="card__number" aria-hidden="true">03</div>
              <h3 className="card__title">Applied Ethics</h3>
              <p className="card__text">
                Currently studying at PTH Brixen in the Applied Ethics programme —
                deepening the philosophical basis for technology, business,
                and human interaction.
              </p>
            </article>

            <article className="card">
              <div className="card__number" aria-hidden="true">04</div>
              <h3 className="card__title">Circular Economy</h3>
              <p className="card__text">
                Committed to building sustainable solutions that create genuine
                reciprocal value — particularly in emerging and transitional markets.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Vision strip ── */}
      <section className="vision">
        <div className="container container--text">
          <p className="section-label">Direction</p>
          <blockquote className="vision__quote">
            "My goal is to move into a role that combines ethics, strategy, and
            intelligence consulting — working on topics that matter, with people
            who think carefully."
          </blockquote>
          <p className="vision__author">— Claudiu Dangulea</p>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="cta">
        <div className="container container--text">
          <div className="divider" />
          <p className="section-label">Contact</p>
          <h2 className="cta__heading">Let's talk.</h2>
          <p className="cta__text">
            If you have a project that fits, I am available and ready to start.
          </p>
          <div className="cta__links">
            <a href="mailto:claudiu.dangulea@gmail.com" className="btn btn--primary">
              claudiu.dangulea@gmail.com
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
