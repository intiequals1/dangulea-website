import { useMemo, useState } from 'react'
import './Ressourcen.css'

type ResourceType = 'Notiz' | 'Wiki' | 'Lernpfad' | 'Prototyp' | 'Whitepaper'

type Resource = {
  title: string
  topic: string
  type: ResourceType
  description: string
  url: string
  tags: string[]
}

const resources: Resource[] = [
  {
    title: 'Ein eigenes ERP-System installieren',
    topic: 'ERP',
    type: 'Wiki',
    description: 'Dokumentation eines SAP NetWeaver AS ABAP Trial-Setups mit Fehleranalyse, Installationsstrategie und Lessons Learned.',
    url: 'https://www.claudiu.at/35b5da070f38809f8da0f0f68e47e6a5?pvs=21',
    tags: ['SAP', 'NetWeaver', 'VirtualBox', 'openSUSE'],
  },
  {
    title: 'SAP R3 - Customization (vhcalnplci)',
    topic: 'ERP',
    type: 'Wiki',
    description: 'Strukturierte FI/CO-Customizing-Übung im lokalen SAP-NPL-Trial-System.',
    url: 'https://www.claudiu.at/SAP-R3-Customization-vhcalnplci-3645da070f38807a8cd3ee4df57c8b4c?pvs=21',
    tags: ['SAP FI/CO', 'Customizing', 'NPL'],
  },
  {
    title: 'Learning Path: SAP S/4HANA Cloud Public Edition',
    topic: 'ERP',
    type: 'Lernpfad',
    description: 'Lernreise zu SAP S/4HANA Cloud Public Edition, Zertifizierungen, Systemarchitektur und Finance-Schwerpunkten.',
    url: 'https://www.claudiu.at/Learning-Path-SAP-S-4HANA-Cloud-Public-Edition-1c55da070f3880e893ffcd3b33c7f467?pvs=21',
    tags: ['SAP S/4HANA', 'Cloud', 'Zertifizierung'],
  },
  {
    title: 'ERP-Berater für Digitalisierung und Prozessoptimierung',
    topic: 'ERP',
    type: 'Notiz',
    description: 'Rollenprofil mit SAP FI/CO, SAP BTP, Datenanalyse, Reporting und Prozessoptimierung.',
    url: 'https://www.claudiu.at/ERP-Berater-SAP-FI-CO-SAP-BTP-f-r-Digitalisierung-und-Prozessoptimierung-1b05da070f388003a8e8c45e6e707f40?pvs=21',
    tags: ['SAP BTP', 'Power BI', 'Prozesse'],
  },
  {
    title: 'SAP: AI tools and techniques for coding',
    topic: 'KI & Technologie',
    type: 'Notiz',
    description: 'Einordnung moderner JavaScript- und TypeScript-Testframeworks im SAP-Entwicklungskontext.',
    url: 'https://www.claudiu.at/SAP-AI-tools-and-techniques-for-coding-VC-1ee5da070f3880f6a411f6005e495ff7?pvs=21',
    tags: ['SAP', 'AI Coding', 'Testing', 'TypeScript'],
  },
  {
    title: 'Context Engineering: Leitfaden für KI-Systeme (2026)',
    topic: 'KI & Technologie',
    type: 'Notiz',
    description: 'Leitfaden zu Context Engineering als Kompetenz für produktive KI-Anwendungen, RAG, Memory, Tools und Kontextfenster.',
    url: 'https://www.claudiu.at/Context-Engineering-Leitfaden-f-r-KI-Systeme-2026-38d5da070f3881048a1bde4ccf93a1cc?pvs=21',
    tags: ['KI', 'LLM', 'RAG', 'Agenten'],
  },
  {
    title: 'KI x Kreativität',
    topic: 'Ethik',
    type: 'Notiz',
    description: 'Analyse zur Frage, ob und wie generative KI kreativ sein kann und welche Rolle Prompting, Trainingsdaten und Agency spielen.',
    url: 'https://www.claudiu.at/KI-x-Kreativit-t-21a5da070f38814188f8ef26ea6cc776?pvs=21',
    tags: ['Generative KI', 'Kreativität', 'Prompting'],
  },
  {
    title: 'Bio- und Medienethik: Instrumentalisierung & Ressentiment',
    topic: 'Ethik',
    type: 'Notiz',
    description: 'Ressourcen und Gegenüberstellung zu Instrumentalisierung vulnerabler Personen und Ressentiment-Ökonomie.',
    url: 'https://www.claudiu.at/Bio-und-Medienethik-Ressourcen-zu-Instrumentalisierung-Ressentiment-3585da070f38804dba95dd22ebdc7816?pvs=21',
    tags: ['Bioethik', 'Medienethik', 'Plattformen'],
  },
  {
    title: 'Ethical debt and moral infrastructure in ERP systems',
    topic: 'Ethik',
    type: 'Notiz',
    description: 'Strukturierte Literatursynthese zu ethischen Schulden und moralischer Infrastruktur in ERP-Systemen.',
    url: 'https://www.claudiu.at/Ethical-debt-and-moral-infrastructure-in-ERP-systems-a-structured-literature-synthesis-34a5da070f388083acd3f47edfbc8ba1?pvs=21',
    tags: ['ERP', 'Ethical Debt', 'Governance'],
  },
  {
    title: 'Whitepaper: Nachhaltigkeitsberichterstattung mit VSME',
    topic: 'Nachhaltigkeit',
    type: 'Whitepaper',
    description: 'Praktische Umsetzung der Nachhaltigkeitsberichterstattung mit VSME für kleine und mittlere Unternehmen.',
    url: 'https://www.claudiu.at/Whitepaper-Nachhaltigkeitsberichterstattung-mit-VSME-Praktische-Umsetzung-f-r-KMU-1c35da070f388053a49dc89f400b669d?pvs=21',
    tags: ['VSME', 'KMU', 'Reporting'],
  },
  {
    title: 'Sustainability Literacy 2020–2025',
    topic: 'Nachhaltigkeit',
    type: 'Notiz',
    description: 'Sammlung aktueller Forschung zu Konsolidierung, Messung und Implementierung von Sustainability Literacy.',
    url: 'https://www.claudiu.at/Aktuelle-Forschung-zu-Sustainability-Literacy-2020-2025-Konsolidierung-Messung-und-Implementierung-24b5da070f3881038f68d42f949988d7?pvs=21',
    tags: ['Sustainability Literacy', 'Forschung', 'Bildung'],
  },
  {
    title: 'An Empirical Study of Emerging Digital Culture',
    topic: 'Organisation',
    type: 'Notiz',
    description: 'Zusammenfassung einer Studie zu digitaler Kultur, digitaler Kompetenz und Einstellungen in etablierten Unternehmen.',
    url: 'https://www.claudiu.at/An-Empirical-Study-of-Emerging-Digital-Culture-and-Digital-Attitudes-in-an-Established-Company-1bd5da070f388087bd4adb8ec611c54c?pvs=21',
    tags: ['Digitale Kultur', 'Transformation', 'Digital Literacy'],
  },
  {
    title: 'Task Mining vs. Process Mining',
    topic: 'Organisation',
    type: 'Notiz',
    description: 'Vergleich von Task Mining und Process Mining mit Blick auf Datenquellen, Granularität, Nutzen und Grenzen.',
    url: 'https://www.claudiu.at/Task-Mining-vs-Process-Mining-1bc5da070f3880efad59e4a30836073d?pvs=21',
    tags: ['Process Mining', 'Task Mining', 'Automatisierung'],
  },
  {
    title: 'Run n8n remotely',
    topic: 'Tools',
    type: 'Notiz',
    description: 'Praktische Notiz zum Remote-Betrieb von n8n auf einer Cloud-VM mit Docker.',
    url: 'https://www.claudiu.at/Run-n8n-remotely-35a5da070f388097b8d8ef0efef05873?pvs=21',
    tags: ['n8n', 'Docker', 'Oracle Cloud'],
  },
  {
    title: 'Prototyp: Begriffstrainer nach einem Curriculum',
    topic: 'Lernen',
    type: 'Prototyp',
    description: 'Technische Beschreibung eines lokal lauffähigen React-Prototyps für curriculum-basiertes Begriffslernen.',
    url: 'https://www.claudiu.at/Prototyp-eines-Programms-Begriffstrainer-nach-einem-Curriculum-3995da070f3880408723dce27d4211d8?pvs=21',
    tags: ['React', 'Lernen', 'Curriculum'],
  },
]

const topics = ['Alle', ...Array.from(new Set(resources.map((resource) => resource.topic)))]
const types = ['Alle', ...Array.from(new Set(resources.map((resource) => resource.type)))]

export default function Ressourcen() {
  const [query, setQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('Alle')
  const [selectedType, setSelectedType] = useState('Alle')

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return resources.filter((resource) => {
      const matchesTopic = selectedTopic === 'Alle' || resource.topic === selectedTopic
      const matchesType = selectedType === 'Alle' || resource.type === selectedType
      const searchableText = [
        resource.title,
        resource.topic,
        resource.type,
        resource.description,
        ...resource.tags,
      ].join(' ').toLowerCase()

      return matchesTopic && matchesType && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })
  }, [query, selectedTopic, selectedType])

  return (
    <div className="ressourcen">
      <section className="ressourcen-header">
        <div className="container">
          <p className="section-label">Sammlung</p>
          <h1 className="ressourcen-header__title">Ressourcen</h1>
          <p className="ressourcen-header__lead">
            Eine kuratierte Übersicht meiner Notion-Seiten, Arbeitsnotizen und Lernressourcen.
            Die Sammlung ist durchsuchbar, filterbar und verweist auf die Originalseiten.
          </p>
        </div>
      </section>

      <section className="ressourcen-section">
        <div className="container ressourcen-feature">
          <div>
            <p className="section-label">Lernen</p>
            <h2>learn.dangulea.at</h2>
            <p>
              Der Lernbereich bündelt Materialien, Übungen und kleine Lernstrecken. Er öffnet
              im gleichen Fenster und verweist von dort wieder zurück auf dangulea.at.
            </p>
          </div>
          <a className="ressourcen-feature__link" href="https://learn.dangulea.at">
            Lernbereich öffnen
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <div className="container"><div className="divider" /></div>

      <section className="ressourcen-section ressourcen-section--last">
        <div className="container ressourcen-layout">
          <aside className="ressourcen-sidebar">
            <p className="section-label">Datenbank</p>
            <p>
              Suche nach Begriffen oder filtere nach Thema und Format. Die Links führen zu den
              jeweiligen Notion-Seiten auf claudiu.at.
            </p>
          </aside>

          <div className="ressourcen-body">
            <div className="ressourcen-controls" aria-label="Ressourcen filtern">
              <label className="ressourcen-search">
                <span>Suche</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="z. B. SAP, Ethik, Context Engineering"
                />
              </label>

              <label>
                <span>Thema</span>
                <select value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)}>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Format</span>
                <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                  {types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
            </div>

            <p className="ressourcen-count">
              {filteredResources.length} von {resources.length} Ressourcen
            </p>

            <div className="ressourcen-grid">
              {filteredResources.map((resource) => (
                <article className="resource-card" key={resource.url}>
                  <div className="resource-card__meta">
                    <span>{resource.topic}</span>
                    <span>{resource.type}</span>
                  </div>
                  <h2>{resource.title}</h2>
                  <p>{resource.description}</p>
                  <div className="resource-card__tags" aria-label="Schlagwörter">
                    {resource.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-card__link">
                    Notion-Seite öffnen
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
