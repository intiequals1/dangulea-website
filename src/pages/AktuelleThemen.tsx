import { useEffect, useState } from 'react'
import './AktuelleThemen.css'

type Source = { title: string; url: string }
type Update = { id: string; date: string; title: string; summary: string; relevance: string; sources: Source[] }
type Topic = { id: string; title: string; lastCheckedAt: string | null; status: 'pending' | 'ok' | 'access_required'; updates: Update[] }

function isWebUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try { return ['https:', 'http:'].includes(new URL(value).protocol) } catch { return false }
}

function isTopic(value: unknown): value is Topic {
  if (!value || typeof value !== 'object') return false
  const topic = value as Topic
  return typeof topic.id === 'string' && typeof topic.title === 'string' &&
    ['pending', 'ok', 'access_required'].includes(topic.status) &&
    (topic.lastCheckedAt === null || (typeof topic.lastCheckedAt === 'string' && Number.isFinite(Date.parse(topic.lastCheckedAt)))) &&
    Array.isArray(topic.updates) && topic.updates.every((update) =>
      typeof update.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(update.date) &&
      typeof update.title === 'string' && typeof update.summary === 'string' && typeof update.relevance === 'string' &&
      Array.isArray(update.sources) && update.sources.every((source) =>
        typeof source.title === 'string' && isWebUrl(source.url)))
}

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
          <p className="topics-lead">Themenbereiche aus meinen Projekten zu ERP und zur Zeit nach der Implementierung.</p>
        </div>
      </section>
      <div className="container topics-body">
        <p className="topics-disclosure">Diese Rubrik wird automatisiert und mit KI-Unterstützung aus den Projekten zusammengestellt. Inhalte können Fehler enthalten und sind nicht einzeln redaktionell geprüft. Maßgeblich sind die angegebenen Quellen. Korrekturhinweise an <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>.</p>
        {loading && <p role="status">Themen werden geladen …</p>}
        {error && <p role="alert">Die Themen konnten nicht geladen werden. Bitte versuche es später erneut.</p>}
        {!loading && !error && topics.length === 0 && <p>Noch keine Themen veröffentlicht.</p>}
        {topics.map((topic) => (
          <section className="topic" key={topic.id} aria-labelledby={`topic-${topic.id}`}>
            <header className="topic-header">
              <h2 id={`topic-${topic.id}`}>{topic.title}</h2>
            </header>
            {topic.status === 'access_required' && <p className="topic-status">Die Projektinhalte sind derzeit nicht abrufbar. Vorhandene Beiträge bleiben erhalten.</p>}
            {topic.status === 'pending' && <p className="topic-status">Die erste Projektprüfung steht noch aus.</p>}
            {topic.updates.length === 0 ? <p>Aus diesem Projekt liegen noch keine fachlichen Themenbereiche vor.</p> :
              topic.updates.map((update) => (
                <article key={update.id} className="topic-update" id={`update-${update.id}`}>
                  <h3>{update.title}</h3>
                  <p>{update.summary}</p>
                  <ul aria-label="Originalquellen">{update.sources.filter((source) => !/(^|\.)perplexity\.ai$/.test(new URL(source.url).hostname)).map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a></li>)}</ul>
                </article>
              ))}
          </section>
        ))}
      </div>
    </div>
  )
}
