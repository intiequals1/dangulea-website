import { useMemo, useState } from 'react'
import { daysUntil } from '../utils/skillRadar'
import { offeneRechtsFristen, type RechtsData } from '../utils/rechtsUpdate'

const fmt = new Intl.DateTimeFormat('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
const formatDate = (d: Date | null) => (d ? fmt.format(d) : '–')
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')
const monthName = new Intl.DateTimeFormat('de-AT', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const formatMonat = (monat: string) => monthName.format(new Date(`${monat}-01T00:00:00Z`))

// Reiter „Rechts-Update“: monatliche Ausgaben aus dem privaten Sheet, nur für Claudiu Dangulea.
export default function InternRechtsUpdate({ data }: { data: RechtsData }) {
  const today = useMemo(() => new Date(), [])
  const monate = useMemo(() => [...new Set([...data.ausgaben.map(a => a.monat), ...data.themen.map(t => t.monat)])].sort().reverse(), [data])
  const [monat, setMonat] = useState(monate[0] ?? '')
  const ausgabe = data.ausgaben.find(a => a.monat === monat)
  const themen = data.themen.filter(t => t.monat === monat)
  const betroffenheit = data.betroffenheit.filter(b => b.monat === monat)
  const fristen = useMemo(() => offeneRechtsFristen(data.fristen, today), [data.fristen, today])
  const bald = fristen.filter(f => f.datum && daysUntil(f.datum, today) <= 90)

  if (monate.length === 0) {
    return <p className="intern-muted">Noch keine Ausgabe im Sheet. Die geplante Aufgabe legt am 1. des Monats einen Entwurf an.</p>
  }

  return (
    <>
      <dl className="intern-stats">
        <div><dt>Ausgaben</dt><dd>{monate.length}</dd></div>
        <div><dt>Themen dieser Ausgabe</dt><dd>{themen.length}</dd></div>
        <div><dt>Fristen in 90 Tagen</dt><dd>{bald.length}</dd></div>
        <div><dt>Stand</dt><dd className="intern-stats__date">{formatDate(ausgabe?.stand ?? null)}</dd></div>
      </dl>

      <section className="intern-section" aria-labelledby="ru-ausgabe">
        <h2 id="ru-ausgabe">Ausgabe</h2>
        <div className="intern-filters" role="group" aria-label="Ausgabe wählen">
          <label>Monat
            <select value={monat} onChange={e => setMonat(e.target.value)}>
              {monate.map(m => <option key={m} value={m}>{formatMonat(m)}</option>)}
            </select>
          </label>
          {ausgabe && <span className={`intern-decision intern-decision--${slug(ausgabe.status)}`}>{ausgabe.status}</span>}
          {ausgabe?.datei && <a href={ausgabe.datei} target="_blank" rel="noopener noreferrer">Fassung im Drive</a>}
        </div>
        {ausgabe?.kurz && <p className="intern-ru-lead">{ausgabe.kurz}</p>}
        {ausgabe?.aenderungen && <p className="intern-muted"><strong>Änderungen gegenüber der Vorausgabe:</strong> {ausgabe.aenderungen}</p>}
      </section>

      <section className="intern-section" aria-labelledby="ru-themen">
        <h2 id="ru-themen">Themen</h2>
        <div className="intern-skills">
          {themen.map(t => (
            <details key={`${t.monat}-${t.nr}-${t.thema}`} className="intern-skill">
              <summary>
                <span className="intern-skill__id">{t.nr || '–'}</span>
                <span className="intern-skill__name">{t.thema}</span>
                <span className={`intern-status intern-ru-status--${slug(t.status)}`}>{t.status || '–'}</span>
              </summary>
              <dl className="intern-skill__facts">
                {t.wasGilt && <><dt>Was gilt</dt><dd>{t.wasGilt}</dd></>}
                {t.abWann && <><dt>Ab wann</dt><dd>{t.abWann}</dd></>}
                {t.wen && <><dt>Wen betrifft es</dt><dd>{t.wen}</dd></>}
                {t.wasTun && <><dt>Was tun</dt><dd>{t.wasTun}</dd></>}
                {t.hinweise && <><dt>Weitere Hinweise</dt><dd>{t.hinweise}</dd></>}
                {t.neu && <><dt>Neu</dt><dd>{t.neu}</dd></>}
                <dt>Quellen</dt>
                <dd>
                  {t.quellen.length === 0 ? '–' : (
                    <ul className="intern-ru-sources">
                      {t.quellen.map((q, i) => <li key={`${q.titel}-${i}`}>{q.url ? <a href={q.url} target="_blank" rel="noopener noreferrer">{q.titel}</a> : q.titel}</li>)}
                    </ul>
                  )}
                </dd>
              </dl>
            </details>
          ))}
          {themen.length === 0 && <p className="intern-muted">Für diese Ausgabe sind keine Themen eingetragen.</p>}
        </div>
      </section>

      <section className="intern-section" aria-labelledby="ru-betroffenheit">
        <h2 id="ru-betroffenheit">Eigene Betroffenheit</h2>
        {betroffenheit.length === 0 ? <p className="intern-muted">Für diese Ausgabe nicht eingetragen.</p> : (
          <div className="intern-ru-table-wrap">
            <table className="intern-table">
              <thead><tr><th>Thema</th><th>Betroffen?</th><th>Bezug</th><th>Nächster Schritt</th></tr></thead>
              <tbody>
                {betroffenheit.map((b, i) => <tr key={`${b.thema}-${i}`}><td>{b.thema}</td><td>{b.betroffen}</td><td>{b.bezug}</td><td>{b.schritt}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="intern-section intern-section--last" aria-labelledby="ru-fristen">
        <h2 id="ru-fristen">Offene Fristen</h2>
        {fristen.length === 0 && <p className="intern-muted">Keine offenen Fristen.</p>}
        <ol className="intern-deadlines">
          {fristen.map((f, i) => {
            const d = f.datum ? daysUntil(f.datum, today) : null
            return (
              <li key={`${f.thema}-${i}`} className={d !== null && d <= 90 ? 'is-soon' : ''}>
                <span className="intern-deadlines__date">{formatDate(f.datum)}<small>{d !== null ? (d === 0 ? 'heute' : `in ${d} Tagen`) : ''}</small></span>
                <span className="intern-deadlines__text">{f.was}<small>{f.thema}</small></span>
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}
