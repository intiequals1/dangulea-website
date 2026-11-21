import { useParams } from 'react-router-dom'
import { rechtsUpdate, formatDate } from '../content/rechts-update'
import RechtsUpdateHinweis from '../components/RechtsUpdateHinweis'
import './News.css'
import './RechtsUpdate.css'

export default function RechtsUpdateEdition() {
  const { month } = useParams()
  const { hinweis, editions } = rechtsUpdate
  const edition = editions.find(item => item.month === month)
  if (!edition) {
    return <div className="news-page"><h1>Ausgabe nicht gefunden</h1><a href="/news#rechts-update">Zum Rechts-Update</a></div>
  }
  const approvedOn = edition.freigabe.status === 'freigegeben' ? edition.freigabe.am : null
  return (
    <article className="news-page rechts-update-edition" data-rechts-update="ausgabe">
      <a href="/news#rechts-update">← Zum Rechts-Update</a>
      <p className="news-segment-kicker">{hinweis.title}</p>
      <h1>{hinweis.label} · {edition.title}</h1>
      <p className="news-date">
        Stand <time dateTime={edition.stand}>{formatDate(edition.stand)}</time>
        {approvedOn
          ? <> · von Claudiu Dangulea geprüft und freigegeben am <time dateTime={approvedOn}>{formatDate(approvedOn)}</time></>
          : <> · <strong>Entwurf, nicht freigegeben</strong></>}
      </p>
      <RechtsUpdateHinweis />

      <section aria-labelledby="ru-overview">
        <h2 id="ru-overview">Kurzüberblick</h2>
        <p className="news-lead">{edition.summary}</p>
        <nav aria-label="Themen dieser Ausgabe">
          <ol className="rechts-update-toc">
            {edition.topics.map(topic => <li key={topic.id}><a href={`#${topic.id}`}>{topic.title}</a> <span className="rechts-update-status">{topic.status}</span></li>)}
          </ol>
        </nav>
      </section>

      {edition.topics.map((topic, index) => (
        <section key={topic.id} id={topic.id} className="rechts-update-topic" aria-labelledby={`${topic.id}-title`}>
          <h2 id={`${topic.id}-title`}>{index + 1}. {topic.title} <span className="rechts-update-status" data-status={topic.status}>{topic.status}</span></h2>
          <dl className="rechts-update-items">
            {topic.items.map(item => (
              <div key={item.label} className="rechts-update-item">
                <dt>{item.label}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
          <h3 className="rechts-update-sources-title">Quellen</h3>
          <ul className="rechts-update-sources">
            {topic.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}
          </ul>
        </section>
      ))}

      <section aria-labelledby="ru-deadlines">
        <h2 id="ru-deadlines">Fristen der nächsten zwölf Monate</h2>
        <div className="rechts-update-table-wrap">
          <table className="rechts-update-table">
            <thead><tr><th scope="col">Datum</th><th scope="col">Thema</th><th scope="col">Was passiert</th></tr></thead>
            <tbody>
              {edition.deadlines.map(deadline => (
                <tr key={`${deadline.date}-${deadline.topic}`}><td><time dateTime={deadline.date}>{formatDate(deadline.date)}</time></td><td>{deadline.topic}</td><td>{deadline.what}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        {edition.later && <p>{edition.later}</p>}
      </section>

      <section aria-labelledby="ru-changes">
        <h2 id="ru-changes">Änderungen gegenüber der letzten Ausgabe</h2>
        <ul>{edition.changes.map(change => <li key={change}>{change}</li>)}</ul>
      </section>
    </article>
  )
}
