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
    description: 'Mein persönliches Profil und Beratungsauftritt, diese Seite hier.',
    category: 'Persönlich',
  },
  {
    name: 'erp.contact',
    url: 'https://www.erp.contact',
    description: 'Beratungsprofil mit Schwerpunkt SAP FI/CO und S/4HANA-Einführungen.',
    category: 'Beruflich',
  },
  {
    name: 'pertion.io',
    url: 'https://pertion.io',
    description: 'Digitales Vorhaben zu neuen Modellen für Wissen und Wertaustausch.',
    category: 'Vorhaben',
  },
  {
    name: 'anclaud.io',
    url: 'https://www.anclaud.io',
    description: 'Sammlungen, ein kuratierter Raum für Ideen, Objekte und Referenzen.',
    category: 'Kreativ',
  },
  {
    name: 'aladen.at',
    url: 'https://www.aladen.at',
    description: 'aLaden, ein Konzept für Lifestyle und Gestaltung mit österreichischem Handwerk.',
    category: 'Handel',
  },
  {
    name: 'etsy.com/at/shop/EffectCenter',
    url: 'https://www.etsy.com/at/shop/EffectCenter',
    description: 'Effect Center, digitale und physische Produkte auf Etsy.',
    category: 'Handel',
  },
  {
    name: 'coolweb.today',
    url: 'https://coolweb.today',
    description: 'Medien- und Inhalteplattform zu Technologie und Kultur.',
    category: 'Medien',
  },
  {
    name: 'coolwebtoday.org',
    url: 'https://www.coolwebtoday.org',
    description: 'Organisatorischer Überblick über alle Projekte und Initiativen.',
    category: 'Medien',
  },
  {
    name: 'susy.be',
    url: 'https://www.susy.be',
    description: 'Be Süsy, persönliche Marke und Lifestyle-Projekt.',
    category: 'Kreativ',
  },
  {
    name: 'ai-guru.eu',
    url: 'http://ai-guru.eu',
    description: 'Plattform zu Anwendungen künstlicher Intelligenz in Europa.',
    category: 'Technologie',
  },
]

const categoryColors: Record<string, string> = {
  'Persönlich': 'var(--color-accent)',
  'Beruflich':  '#6b9fd4',
  'Vorhaben':   '#9d7fd4',
  'Kreativ':    '#d47f9d',
  'Handel':     '#7fd4a8',
  'Medien':     '#d4b97f',
  'Technologie':'#7fd4d4',
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
            Laufende Vorhaben, Konzepte und digitale Projekte aus Technologie, Medien
            und Gestaltung. Manches davon läuft bereits, anderes ist noch Idee.
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
            <h2 className="projekte-section__heading">Aktuelle Vorhaben</h2>
            <div className="focus-grid">
              <div className="focus-card">
                <div className="focus-card__number">01</div>
                <h3 className="focus-card__title">Digitale Projekte</h3>
                <p className="focus-card__desc">
                  Ein Portfolio eigener Webseiten und Plattformen, von Medien über
                  Handel bis zu Wissenswerkzeugen. Jedes Projekt hat eine klare Idee und
                  eine lange Perspektive.
                </p>
              </div>
              <div className="focus-card">
                <div className="focus-card__number">02</div>
                <h3 className="focus-card__title">Inhalte und Community</h3>
                <p className="focus-card__desc">
                  CoolWebToday als Medienplattform und Anlaufstelle: Beiträge
                  veröffentlichen, Quellen kuratieren und Menschen zusammenbringen, die
                  sich für Technologie, Kultur und Ideen interessieren.
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
              Neben den laufenden Projekten gibt es Ideen, die ich weiterverfolge,
              manche als Nebenexperiment, andere mit längerem Horizont.
            </p>
            <div className="concept-list">
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>Intelligence Consulting</strong> — Beratung, die Datenanalyse,
                  strategisches Denken und ethische Kriterien für Organisationen mit
                  komplexen Entscheidungen zusammenbringt.
                </div>
              </div>
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>Pertion</strong> — Plattformkonzept für strukturierten
                  Wissensaustausch und Wertschöpfung, derzeit in früher Entwicklung.
                </div>
              </div>
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>aLaden</strong> — kuratiertes Handelskonzept, das
                  österreichische Gestaltung, Handwerk und digitalen Vertrieb verbindet.
                </div>
              </div>
              <div className="concept-item">
                <span className="concept-item__dot" />
                <div>
                  <strong>AI Guru EU</strong> — Plattform für den praktischen Einsatz
                  von KI in europäischen Unternehmen.
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
              Ein wachsendes Netz digitaler Projekte, jedes mit eigenem Schwerpunkt und
              eigenem Publikum.
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
