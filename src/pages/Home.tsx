import { Link } from 'react-router-dom'
import claudiuPhotoWebp from '../assets/claudiu-dangulea.webp'
import claudiuPhotoPng from '../assets/claudiu-dangulea.png'
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
              <p className="section-label">Consultant · Vienna</p>
              <h1 className="hero__title">
                Claudiu<br />
                <em>Dangulea</em>
              </h1>
              <p className="hero__subtitle">
                Business informatics. Applied ethics. Experience across finance,
                ERP systems, and strategy — ready to bring that to the right project.
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
            <div className="hero__photo-wrap">
              <picture>
                <source srcSet={claudiuPhotoWebp} type="image/webp" />
                <img
                  src={claudiuPhotoPng}
                  alt="Claudiu Dangulea"
                  className="hero__photo"
                  width="600"
                  height="756"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intro strip ── */}
      <section className="intro">
        <div className="container container--text">
          <div className="divider" />
          <p className="intro__text">
            My name is Claudiu. I am based in Vienna and work at the intersection of
            finance, technology, and ethics. I bring hands-on experience from accounting,
            SAP consulting, and digital transformation — and I am ready to apply that
            combination to the right project, from day one.
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
              <h3 className="card__title">SAP &amp; ERP Systems</h3>
              <p className="card__text">
                Hands-on experience in SAP FI/CO consulting, system implementation,
                and process optimisation. Familiar with Closing Cockpit, Fiori apps,
                and end-to-end financial workflows.
              </p>
            </article>

            <article className="card">
              <div className="card__number" aria-hidden="true">02</div>
              <h3 className="card__title">Finance &amp; Accounting</h3>
              <p className="card__text">
                Broad background in financial accounting, tax administration, and
                controlling — across industries from consulting to manufacturing.
              </p>
            </article>

            <article className="card">
              <div className="card__number" aria-hidden="true">03</div>
              <h3 className="card__title">Applied Ethics</h3>
              <p className="card__text">
                Currently studying applied ethics at the University of Innsbruck in
                Brixen — exploring the philosophical foundations of technology,
                business, and human interaction.
              </p>
            </article>

            <article className="card">
              <div className="card__number" aria-hidden="true">04</div>
              <h3 className="card__title">Data &amp; Process Intelligence</h3>
              <p className="card__text">
                Experience with Power BI, process mining, and business intelligence
                tools. Comfortable turning complex data into clear, actionable insight.
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
