import { useMemo, useState } from 'react'
import './Ressourcen.css'

type ResourceItem = {
  title: string
  url?: string
}

type ResourceGroup = {
  title: string
  description: string
  items: ResourceItem[]
}

const resourceGroups: ResourceGroup[] = [
  {
    title: 'New: Installing SAP',
    description: 'Aktuelle SAP-Installations- und Customizing-Notizen.',
    items: [
      { title: 'Ein eigenes ERP-System installieren', url: 'https://www.claudiu.at/35b5da070f38809f8da0f0f68e47e6a5?pvs=21' },
      { title: 'SAP R3 - Customization (vhcalnplci)', url: 'https://www.claudiu.at/SAP-R3-Customization-vhcalnplci-3645da070f38807a8cd3ee4df57c8b4c?pvs=21' },
    ],
  },
  {
    title: 'Current',
    description: 'Laufende Denk- und Arbeitsnotizen.',
    items: [
      { title: 'Bio- und Medienethik: Ressourcen zu Instrumentalisierung & Ressentiment', url: 'https://www.claudiu.at/Bio-und-Medienethik-Ressourcen-zu-Instrumentalisierung-Ressentiment-3585da070f38804dba95dd22ebdc7816?pvs=21' },
      { title: 'Die Wartekultur', url: 'https://www.claudiu.at/Die-Wartekultur-35a5da070f38807da932ef3ec1d66aa6?pvs=21' },
      { title: 'Run n8n remotely', url: 'https://www.claudiu.at/Run-n8n-remotely-35a5da070f388097b8d8ef0efef05873?pvs=21' },
    ],
  },
  {
    title: 'ERP',
    description: 'SAP, FI/CO, Prozessarchitektur, ERP-Governance und Transformationsnotizen.',
    items: [
      { title: 'ERP-Berater (SAP FI/CO & SAP BTP) für Digitalisierung und Prozessoptimierung', url: 'https://www.claudiu.at/ERP-Berater-SAP-FI-CO-SAP-BTP-f-r-Digitalisierung-und-Prozessoptimierung-1b05da070f388003a8e8c45e6e707f40?pvs=21' },
      { title: 'Learning Path: SAP S/4HANA Cloud Public Edition', url: 'https://www.claudiu.at/Learning-Path-SAP-S-4HANA-Cloud-Public-Edition-1c55da070f3880e893ffcd3b33c7f467?pvs=21' },
      { title: 'SAP: AI tools and techniques for coding (VC)', url: 'https://www.claudiu.at/SAP-AI-tools-and-techniques-for-coding-VC-1ee5da070f3880f6a411f6005e495ff7?pvs=21' },
    ],
  },
  {
    title: 'Science',
    description: 'Forschung, Begriffsarbeit, digitale Kultur und sozio-technische Systeme.',
    items: [
      { title: 'Ein Rahmenkonzept zum Verständnis von Reaktanz', url: 'https://www.claudiu.at/Ein-Rahmenkonzept-zum-Verst-ndnis-von-Reaktanz-1e25da070f388063bdb5eb8b34523029?pvs=21' },
      { title: 'Ein Rahmenkonzept zum Verständnis von Identität', url: 'https://www.claudiu.at/Ein-Rahmenkonzept-zum-Verst-ndnis-von-Identit-t-1e25da070f38802e931aebc0c7e7ab14?pvs=21' },
      { title: 'Change?', url: 'https://www.claudiu.at/Change-1e25da070f388006a777c2369c4112c0?pvs=21' },
      { title: 'Ein Rahmenkonzept zur Erkennung von Intrinsikalität', url: 'https://www.claudiu.at/Ein-Rahmenkonzept-zur-Erkennung-von-Intrinsikalit-t-1e25da070f3880008e31c056eb76bee0?pvs=21' },
      { title: 'An Empirical Study of Emerging Digital Culture and Digital Attitudes in an Established Company', url: 'https://www.claudiu.at/An-Empirical-Study-of-Emerging-Digital-Culture-and-Digital-Attitudes-in-an-Established-Company-1bd5da070f388087bd4adb8ec611c54c?pvs=21' },
      { title: 'LexisNexis Search', url: 'https://www.claudiu.at/LexisNexis-Search-1bc5da070f388026a225d8c6769f8258?pvs=21' },
      { title: 'Die Abstraktion in der Transformation', url: 'https://www.claudiu.at/Die-Abstraktion-in-der-Transformation-1b95da070f3880568867fc3fda2986b3?pvs=21' },
      { title: 'Kognitive Bionik: im System- und Software Engineering', url: 'https://www.claudiu.at/Kognitive-Bionik-im-System-und-Software-Engineering-4aadd73d950240068911497f17399e76?pvs=21' },
      { title: 'Why human-AI relationships need socioaffective alignment', url: 'https://www.claudiu.at/Why-human-AI-relationships-need-socioaffective-alignment-by-Kirk-et-al-1b55da070f388041a5b8d7c1c5eabcd6?pvs=21' },
      { title: 'Tech Innovators Revolutionized Industries', url: 'https://www.claudiu.at/Tech-Innovators-Revolutionized-Industries-d50e7bfa6bfe4398847779d0a5df5f0c?pvs=21' },
      { title: 'Bewertung von Effizienzlösungen unter Nachhaltigkeitsaspekten', url: 'https://www.claudiu.at/Bewertung-von-Effizienzl-sungen-unter-Nachhaltigkeitsaspekten-1cb5da070f38805aa81ae53b2faa647b?pvs=21' },
      { title: 'Nachhaltigkeit braucht Ressourcen – Zur ethischen Verantwortung sozio-technischer Systeme', url: 'https://www.claudiu.at/Nachhaltigkeit-braucht-Ressourcen-Zur-ethischen-Verantwortung-sozio-technischer-Systeme-1cd5da070f38801b9f49edd3a45162de?pvs=21' },
      { title: 'Agent Experience', url: 'https://www.claudiu.at/Agent-Experience-1ed5da070f3880108e8eedf934d306a5?pvs=21' },
      { title: 'Ontologie der Begriffe', url: 'https://www.claudiu.at/Ontologie-der-Begriffe-1f05da070f38803e9c31c7d3ac1c054f?pvs=21' },
      { title: 'Hierarchische Taxonomie: Habitus, Charakter und Virtuosität', url: 'https://www.claudiu.at/Hierarchische-Taxonomie-Habitus-Charakter-und-Virtuosit-t-2035da070f3880aaa175e2f40a87a7da?pvs=21' },
      { title: 'KI x Kreativität', url: 'https://www.claudiu.at/KI-x-Kreativit-t-21a5da070f38814188f8ef26ea6cc776?pvs=21' },
      { title: 'Aktuelle Forschung zu Sustainability Literacy 2020-2025', url: 'https://www.claudiu.at/Aktuelle-Forschung-zu-Sustainability-Literacy-2020-2025-Konsolidierung-Messung-und-Implementierung-24b5da070f3881038f68d42f949988d7?pvs=21' },
    ],
  },
  {
    title: 'Ethics',
    description: 'Ethik, Moral, Governance, Regulierung und gesellschaftliche Verantwortung.',
    items: [
      { title: 'Ethical debt and moral infrastructure in ERP systems: a structured literature synthesis', url: 'https://www.claudiu.at/Ethical-debt-and-moral-infrastructure-in-ERP-systems-a-structured-literature-synthesis-34a5da070f388083acd3f47edfbc8ba1?pvs=21' },
    ],
  },
  {
    title: 'Business',
    description: 'Business-Modelle, Nachhaltigkeitsberichte, Organisation und wirtschaftliche Bewertung.',
    items: [
      { title: 'Whitepaper: Nachhaltigkeitsberichterstattung mit VSME – Praktische Umsetzung für KMU', url: 'https://www.claudiu.at/Whitepaper-Nachhaltigkeitsberichterstattung-mit-VSME-Praktische-Umsetzung-f-r-KMU-1c35da070f388053a49dc89f400b669d?pvs=21' },
    ],
  },
  {
    title: 'Tools',
    description: 'Werkzeuge, Automatisierung, Entwicklung, KI-Agenten und technische Praxisnotizen.',
    items: [
      { title: 'Task Mining vs. Process Mining', url: 'https://www.claudiu.at/Task-Mining-vs-Process-Mining-1bc5da070f3880efad59e4a30836073d?pvs=21' },
      { title: 'Context Engineering: Leitfaden für KI-Systeme (2026)', url: 'https://www.claudiu.at/Context-Engineering-Leitfaden-f-r-KI-Systeme-2026-38d5da070f3881048a1bde4ccf93a1cc?pvs=21' },
    ],
  },
  {
    title: 'Projektideen',
    description: 'Projektideen, Prototypen und konzeptionelle Skizzen.',
    items: [
      { title: 'Prototyp eines Programms: „Begriffstrainer nach einem Curriculum“', url: 'https://www.claudiu.at/Prototyp-eines-Programms-Begriffstrainer-nach-einem-Curriculum-3995da070f3880408723dce27d4211d8?pvs=21' },
    ],
  },
]

const groupTitles = ['Alle', ...resourceGroups.map((group) => group.title)]
const totalResourceCount = resourceGroups.reduce((sum, group) => sum + group.items.length, 0)

export default function Ressourcen() {
  const [query, setQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('Alle')

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return resourceGroups
      .filter((group) => selectedGroup === 'Alle' || group.title === selectedGroup)
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const searchableText = [group.title, group.description, item.title].join(' ').toLowerCase()
          return !normalizedQuery || searchableText.includes(normalizedQuery)
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [query, selectedGroup])

  const visibleResourceCount = filteredGroups.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <div className="ressourcen">
      <section className="ressourcen-header">
        <div className="container">
          <p className="section-label">Sammlung</p>
          <h1 className="ressourcen-header__title">Ressourcen</h1>
          <p className="ressourcen-header__lead">
            Themenblöcke aus meinen Notion-Seiten, Arbeitsnotizen und Lernressourcen. Die Übersicht ist
            durchsuchbar, filterbar und verweist auf direkte Pages, soweit die öffentlichen Page-Links verfügbar sind.
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
            <p className="section-label">Themenblöcke</p>
            <p>
              Angezeigt werden nur Themenblöcke mit direkt verlinkten, allgemein relevanten Seiten.
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
                <span>Themenblock</span>
                <select value={selectedGroup} onChange={(event) => setSelectedGroup(event.target.value)}>
                  {groupTitles.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </label>
            </div>

            <p className="ressourcen-count">
              {visibleResourceCount} von {totalResourceCount} Ressourcen
            </p>

            <div className="resource-groups">
              {filteredGroups.map((group) => (
                <section className="resource-group" key={group.title}>
                  <div className="resource-group__header">
                    <div>
                      <p className="resource-group__count">{group.items.length} direkt verlinkt</p>
                      <h2>{group.title}</h2>
                    </div>
                    <p>{group.description}</p>
                  </div>

                  <ul className="resource-page-list">
                    {group.items.map((item) => (
                      <li key={`${group.title}-${item.title}`}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <span>{item.title}</span>
                          <small>Direktlink öffnen ↗</small>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
