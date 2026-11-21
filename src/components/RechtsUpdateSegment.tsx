import { rechtsUpdate, formatDate } from '../content/rechts-update'
import RechtsUpdateHinweis from './RechtsUpdateHinweis'

// Zweites Segment der News-Seite: monatliches, von mir geprüftes Rechts-Update.
export default function RechtsUpdateSegment() {
  const { hinweis, editions, preview } = rechtsUpdate
  return (
    <section className="news-segment rechts-update-segment" id="rechts-update" aria-labelledby="rechts-update-title" data-rechts-update="segment">
      <p className="news-segment-kicker">Segment 2 · monatlich</p>
      <h2 id="rechts-update-title" className="news-segment-title">{hinweis.title}</h2>
      <p className="news-segment-lead">{hinweis.kurz}</p>
      <RechtsUpdateHinweis />
      {editions.length === 0 ? (
        <p className="rechts-update-empty">Die erste Ausgabe wird derzeit geprüft und erscheint nach meiner Freigabe.</p>
      ) : (
        <ul className="rechts-update-list">
          {editions.map(edition => (
            <li key={edition.month} className="rechts-update-teaser">
              <p className="news-date">
                Stand {formatDate(edition.stand)}
                {edition.freigabe.status === 'freigegeben' && edition.freigabe.am
                  ? <> · geprüft und freigegeben am {formatDate(edition.freigabe.am)}</>
                  : <> · <strong>Entwurf, nicht freigegeben</strong></>}
              </p>
              <h3 className="rechts-update-teaser-title"><a href={edition.path}>{hinweis.label} · {edition.title}</a></h3>
              <p>{edition.summary}</p>
              <p className="rechts-update-topics">{edition.topics.map(topic => topic.title).join(' · ')}</p>
              <a href={edition.path}>Ausgabe mit Fristen und Quellen lesen →</a>
            </li>
          ))}
        </ul>
      )}
      {preview && <p className="rechts-update-preview" role="note">Lokale Vorschau: Entwürfe sind sichtbar. Diese Ansicht wird nicht veröffentlicht.</p>}
    </section>
  )
}
