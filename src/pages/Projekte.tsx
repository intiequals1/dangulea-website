import './Projekte.css'

interface Website {
  name: string
  url: string
  category: string
}

const websites: Website[] = [
  { name: 'dangulea.at',                   url: 'https://www.dangulea.at',                    category: 'Persönlich' },
  { name: 'erp.contact',                   url: 'https://www.erp.contact',                    category: 'Entwurf' },
  { name: 'pertion.io',                    url: 'https://www.pertion.io',                     category: 'Notizen' },
  { name: 'anclaud.io',                    url: 'https://www.anclaud.io',                     category: 'Entwurf' },
  { name: 'aladen.at',                     url: 'https://www.aladen.at',                      category: 'Entwurf' },
  { name: 'etsy.com/at/shop/EffectCenter', url: 'https://www.etsy.com/at/shop/EffectCenter',  category: 'Shop' },
  { name: 'coolweb.today',                 url: 'https://www.coolweb.today',                  category: 'Konzept' },
  { name: 'coolwebtoday.org',              url: 'https://www.coolwebtoday.org',               category: 'Entwurf' },
  { name: 'susy.be',                       url: 'https://www.susy.be',                        category: 'Entwurf' },
  { name: 'ai-guru.eu',                    url: 'http://www.ai-guru.eu',                          category: 'Entwurf' },
]

const categoryColors: Record<string, string> = {
  'Persönlich': 'var(--color-accent)',
  'Notizen':    '#6b9fd4',
  'Konzept':    '#9d7fd4',
  'Shop':       '#7fd4a8',
  'Entwurf':    '#b0a08c',
}

export default function Projekte() {
  return (
    <div className="projekte">

      {/* ── Page header ── */}
      <section className="projekte-header">
        <div className="container">
          <p className="section-label">In Arbeit</p>
          <h1 className="projekte-header__title">Projekte &amp; Vorhaben</h1>
          <p className="projekte-header__lead">
            Was hier steht, sind Entwürfe. Angefangene Seiten, Notizsammlungen und
            Ideen, die ich nach und nach ausbaue. Kein fertiges Produkt, kein
            Geschäftsmodell, das schon trägt.
          </p>
        </div>
      </section>

      {/* ── Current focus ── */}
      <section className="projekte-section">
        <div className="container projekte-layout">
          <aside className="projekte-sidebar">
            <p className="section-label">Derzeit</p>
          </aside>
          <div className="projekte-body">
            <h2 className="projekte-section__heading">Woran ich arbeite</h2>
            <div className="focus-grid">
              <div className="focus-card">
                <div className="focus-card__number">01</div>
                <h3 className="focus-card__title">Eigene Seiten</h3>
                <p className="focus-card__desc">
                  Mehrere Domains mit unterschiedlichen Themen. Manche sind Notizen,
                  manche nur eine Startseite. Was sich bewährt, baue ich weiter aus.
                </p>
              </div>
              <div className="focus-card">
                <div className="focus-card__number">02</div>
                <h3 className="focus-card__title">Schreiben und Sammeln</h3>
                <p className="focus-card__desc">
                  Texte und Materialsammlungen zu Technologie, Ethik und
                  Nachhaltigkeit. Unregelmäßig, ohne Redaktionsplan.
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
            <p className="section-label">Konzepte</p>
          </aside>
          <div className="projekte-body">
            <h2 className="projekte-section__heading">Ideen &amp; Konzepte</h2>
            <p>
              Gedanken, die ich festgehalten habe, um sie nicht zu verlieren. Ob daraus
              etwas wird, ist offen.
            </p>
            <div className="concept-list">
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>Intelligence Consulting</strong> — Beratung, die Datenanalyse
                  und ethische Kriterien zusammendenkt.
                </div>
              </div>
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>Pertion</strong> — aus losen Notizen eine Sammlung machen, die
                  auch für andere lesbar ist.
                </div>
              </div>
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>aLaden</strong> — ein Handelskonzept rund um österreichische
                  Gestaltung und Handwerk.
                </div>
              </div>
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>AI Guru EU</strong> — Material zum praktischen Einsatz von KI,
                  bisher nur als Idee festgehalten.
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
            <p className="section-label">Webpräsenz</p>
          </aside>
          <div className="projekte-body">
            <h2 className="projekte-section__heading">Alle Webseiten</h2>
            <p>
              Die Domains, unter denen ich etwas abgelegt habe. Der Stand ist sehr
              unterschiedlich, von gepflegt bis kaum begonnen.
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
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
