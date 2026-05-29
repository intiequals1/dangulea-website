import './Projekte.css'

interface Website {
  name: string
  url: string
  description: string
  category: string
}

const websites: Website[] = [
  {
    name: 'dangulea.at',
    url: 'https://www.dangulea.at',
    description: 'Personal portfolio and consulting profile — the site you are currently visiting.',
    category: 'Personal',
  },
  {
    name: 'erp.contact',
    url: 'https://www.erp.contact',
    description: 'Professional ERP consulting profile, focused on SAP FI/CO and S/4HANA implementations.',
    category: 'Professional',
  },
  {
    name: 'pertion.io',
    url: 'https://pertion.io',
    description: 'A digital venture exploring new models for knowledge and value exchange.',
    category: 'Venture',
  },
  {
    name: 'anclaud.io',
    url: 'https://www.anclaud.io',
    description: 'Sammlungen — a curated collection space for ideas, objects, and references.',
    category: 'Creative',
  },
  {
    name: 'aladen.at',
    url: 'https://www.aladen.at',
    description: 'aLaden — a lifestyle and design shop concept rooted in Austrian craftsmanship.',
    category: 'Commerce',
  },
  {
    name: 'etsy.com/at/shop/EffectCenter',
    url: 'https://www.etsy.com/at/shop/EffectCenter',
    description: 'Effect Center — digital and physical products on Etsy.',
    category: 'Commerce',
  },
  {
    name: 'coolweb.today',
    url: 'https://coolweb.today',
    description: 'CoolWeb Today — a media and content platform covering technology and culture.',
    category: 'Media',
  },
  {
    name: 'coolwebtoday.org',
    url: 'https://www.coolwebtoday.org',
    description: 'CoolWebToday organisation hub — overview of all projects and initiatives.',
    category: 'Media',
  },
  {
    name: 'susy.be',
    url: 'https://www.susy.be',
    description: 'Be Süsy — a personal brand and lifestyle project.',
    category: 'Creative',
  },
  {
    name: 'ai-guru.eu',
    url: 'http://ai-guru.eu',
    description: 'AI Guru EU — a platform exploring artificial intelligence applications in Europe.',
    category: 'Technology',
  },
]

const categoryColors: Record<string, string> = {
  Personal:     'var(--color-accent)',
  Professional: '#6b9fd4',
  Venture:      '#9d7fd4',
  Creative:     '#d47f9d',
  Commerce:     '#7fd4a8',
  Media:        '#d4b97f',
  Technology:   '#7fd4d4',
}

export default function Projekte() {
  return (
    <div className="projekte">

      {/* ── Page header ── */}
      <section className="projekte-header">
        <div className="container">
          <p className="section-label">Work in progress</p>
          <h1 className="projekte-header__title">Projekte &amp; Vorhaben</h1>
          <p className="projekte-header__lead">
            A collection of ongoing ventures, concepts, and digital properties — spanning
            consulting, technology, media, and creative work. Some are active businesses,
            others are ideas in motion.
          </p>
        </div>
      </section>

      {/* ── Current focus ── */}
      <section className="projekte-section">
        <div className="container projekte-layout">
          <aside className="projekte-sidebar">
            <p className="section-label">Current focus</p>
          </aside>
          <div className="projekte-body">
            <h2 className="projekte-section__heading">Aktuelle Vorhaben</h2>
            <div className="focus-grid">
              <div className="focus-card">
                <div className="focus-card__number">01</div>
                <h3 className="focus-card__title">ERP &amp; AI Consulting</h3>
                <p className="focus-card__desc">
                  Building a focused consulting practice at the intersection of SAP systems,
                  process intelligence, and applied AI — helping organisations navigate
                  digital transformation with clarity and precision.
                </p>
              </div>
              <div className="focus-card">
                <div className="focus-card__number">02</div>
                <h3 className="focus-card__title">Applied Ethics Research</h3>
                <p className="focus-card__desc">
                  Exploring the philosophical foundations of technology, business decisions,
                  and the ethics of artificial intelligence.
                </p>
              </div>
              <div className="focus-card">
                <div className="focus-card__number">03</div>
                <h3 className="focus-card__title">Digital Ventures</h3>
                <p className="focus-card__desc">
                  Developing a portfolio of digital properties and platforms — from media
                  and e-commerce to knowledge tools — each built around a clear idea and
                  a long-term perspective.
                </p>
              </div>
              <div className="focus-card">
                <div className="focus-card__number">04</div>
                <h3 className="focus-card__title">Content &amp; Community</h3>
                <p className="focus-card__desc">
                  Growing CoolWebToday as a media platform and community hub — publishing
                  articles, curating resources, and connecting people interested in
                  technology, culture, and ideas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      {/* ── Concepts ── */}
      <section className="projekte-section">
        <div className="container projekte-layout">
          <aside className="projekte-sidebar">
            <p className="section-label">Concepts</p>
          </aside>
          <div className="projekte-body">
            <h2 className="projekte-section__heading">Ideen &amp; Konzepte</h2>
            <p>
              Beyond active projects, there is a continuous stream of ideas being explored —
              some as side experiments, others as longer-term bets. The common thread is a
              belief that good ideas, executed carefully, compound over time.
            </p>
            <div className="concept-list">
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>Intelligence Consulting</strong> — advisory work that combines
                  data analysis, strategic thinking, and ethical frameworks for
                  organisations navigating complex decisions.
                </div>
              </div>
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>Pertion</strong> — a platform concept for structured knowledge
                  exchange and value creation, currently in early development.
                </div>
              </div>
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>aLaden</strong> — a curated commerce concept bringing together
                  Austrian design, craftsmanship, and digital distribution.
                </div>
              </div>
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>AI Guru EU</strong> — a resource and community platform focused
                  on practical AI adoption for European businesses and professionals.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      {/* ── Websites ── */}
      <section className="projekte-section projekte-section--last">
        <div className="container projekte-layout">
          <aside className="projekte-sidebar">
            <p className="section-label">Web presence</p>
          </aside>
          <div className="projekte-body">
            <h2 className="projekte-section__heading">Alle Webseiten</h2>
            <p>
              A growing network of digital properties — each with its own focus, audience,
              and purpose. Together they form a portfolio of ideas made visible.
            </p>
            <div className="websites-grid">
              {websites.map((site) => (
                <a
                  key={site.url}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-card"
                >
                  <div className="website-card__top">
                    <span
                      className="website-card__category"
                      style={{ color: categoryColors[site.category] ?? 'var(--color-accent)' }}
                    >
                      {site.category}
                    </span>
                    <span className="website-card__arrow">↗</span>
                  </div>
                  <h3 className="website-card__name">{site.name}</h3>
                  <p className="website-card__desc">{site.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
