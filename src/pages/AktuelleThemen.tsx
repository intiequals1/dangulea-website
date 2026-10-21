import { useEffect, useState } from 'react'
import './AktuelleThemen.css'

type Source = { title: string; url: string }
type Update = { id: string; date: string; title: string; summary: string; relevance: string; sources: Source[] }
type Topic = { id: string; title: string; url: string; lastCheckedAt: string | null; status: 'pending' | 'ok' | 'access_required'; updates: Update[] }

function isWebUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try { return ['https:', 'http:'].includes(new URL(value).protocol) } catch { return false }
}

function isTopic(value: unknown): value is Topic {
  if (!value || typeof value !== 'object') return false
  const topic = value as Topic
  return typeof topic.id === 'string' && typeof topic.title === 'string' && isWebUrl(topic.url) &&
    ['pending', 'ok', 'access_required'].includes(topic.status) &&
    (topic.lastCheckedAt === null || (typeof topic.lastCheckedAt === 'string' && Number.isFinite(Date.parse(topic.lastCheckedAt)))) &&
    Array.isArray(topic.updates) && topic.updates.every((update) =>
      typeof update.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(update.date) &&
      typeof update.title === 'string' && typeof update.summary === 'string' && typeof update.relevance === 'string' &&
      Array.isArray(update.sources) && update.sources.length > 0 && update.sources.every((source) =>
        typeof source.title === 'string' && isWebUrl(source.url)))
}

const formatChecked = (value: string) => new Intl.DateTimeFormat('de-AT', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Vienna',
}).format(new Date(value))

export default function AktuelleThemen() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/current-topics.json', { signal: controller.signal, cache: 'no-cache' })
      .then((response) => {
        if (!response.ok) throw new Error('Themen konnten nicht geladen werden')
        return response.json()
      })
      .then((data: unknown) => {
        if (!Array.isArray(data) || !data.every(isTopic)) throw new Error('Ungültige Themendaten')
        setTopics(data)
        setLoading(false)
      })
      .catch(() => {
        if (!controller.signal.aborted) { setError(true); setLoading(false) }
      })
    return () => controller.abort()
  }, [])

  return (
    <div className="topics-page">
      <section className="page-header">
        <div className="container">
          <p className="section-label">Projekte im Fokus</p>
          <h1 className="page-header__title">Aktuelle Themen</h1>
          <p className="topics-lead">Entwicklungen aus meinen Projekten zu ERP und zur Zeit nach der Implementierung – mit Einordnung und Quellen.</p>
        </div>
      </section>
      <div className="container topics-body">
        <p className="topics-disclosure">Diese Rubrik wird automatisiert und mit KI-Unterstützung aus den verlinkten Projekten zusammengestellt. Inhalte können Fehler enthalten und sind nicht einzeln redaktionell geprüft. Maßgeblich sind die angegebenen Quellen. Korrekturhinweise an <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>.</p>
        {loading && <p role="status">Themen werden geladen …</p>}
        {error && <p role="alert">Die Themen konnten nicht geladen werden. Bitte versuche es später erneut.</p>}
        {!loading && !error && topics.length === 0 && <p>Noch keine Themen veröffentlicht.</p>}
        {topics.map((topic) => (
          <section className="topic" key={topic.id} aria-labelledby={`topic-${topic.id}`}>
            <header className="topic-header">
              <h2 id={`topic-${topic.id}`}>{topic.title}</h2>
              <a href={topic.url} target="_blank" rel="noopener noreferrer">Projekt bei Perplexity öffnen ↗</a>
              {topic.lastCheckedAt && <p className="topic-checked">Letzter Prüfversuch: {formatChecked(topic.lastCheckedAt)} (Wien)</p>}
            </header>
            {topic.status === 'access_required' && <p className="topic-status">Die Projektinhalte sind derzeit nicht abrufbar. Vorhandene Beiträge bleiben erhalten.</p>}
            {topic.status === 'pending' && <p className="topic-status">Die erste Projektprüfung steht noch aus.</p>}
            {topic.updates.length === 0 ? <p>Noch keine Beiträge aus diesem Projekt veröffentlicht.</p> :
              [...topic.updates].sort((a, b) => b.date.localeCompare(a.date)).map((update) => (
                <article key={update.id} className="topic-update" id={`update-${update.id}`}>
                  <time dateTime={update.date}>{update.date}</time>
                  <h3>{update.title}</h3>
                  <p>{update.summary}</p>
                  <p><strong>Einordnung:</strong> {update.relevance}</p>
                  <ul aria-label="Quellen">{update.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a></li>)}</ul>
                </article>
              ))}
          </section>
        ))}
      </div>
    </div>
  )
}
