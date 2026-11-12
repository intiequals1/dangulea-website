import { useCallback, useEffect, useMemo, useState } from 'react'
import './Intern.css'
import {
  batchGetUrl, buildAuthUrl, daysUntil, parseAuthHash, rowsToObjects, safeUrl, sheetUrl,
  toFristen, toMeldungen, toNachfrage, toQuellen, toSkills, trends, upcoming,
  type Frist, type Meldung, type Quelle, type Skill, type Trend,
} from '../utils/skillRadar'

// Beide Werte kommen beim Build aus den GitHub-Repository-Variablen GOOGLE_CLIENT_ID und SKILL_SHEET_ID.
const CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? ''
const SHEET_ID = (import.meta.env.VITE_SKILL_SHEET_ID as string | undefined) ?? ''

const KEY_TOKEN = 'skillradar.token'
const KEY_EXPIRES = 'skillradar.expires'
const KEY_STATE = 'skillradar.state'

type Data = { skills: Skill[]; meldungen: Meldung[]; fristen: Frist[]; quellen: Quelle[]; trends: Trend[] }
type Phase = 'init' | 'signedOut' | 'loading' | 'ready' | 'error'

const EINORDNUNGEN = ['erneuern', 'veraltet', 'entwertet', 'Chance']
const ENTSCHEIDUNGEN = ['offen', 'übernehmen', 'beobachten', 'verwerfen']
const fmt = new Intl.DateTimeFormat('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
const formatDate = (d: Date | null) => (d ? fmt.format(d) : '–')
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')

function store(): Storage | null {
  try { return window.sessionStorage } catch { return null }
}

function readToken(): string | null {
  const s = store()
  const token = s?.getItem(KEY_TOKEN)
  const expires = Number(s?.getItem(KEY_EXPIRES) ?? 0)
  return token && expires > Date.now() + 30_000 ? token : null
}

function clearToken() {
  const s = store()
  s?.removeItem(KEY_TOKEN)
  s?.removeItem(KEY_EXPIRES)
}

export default function Intern() {
  const [phase, setPhase] = useState<Phase>('init')
  const [error, setError] = useState('')
  const [data, setData] = useState<Data | null>(null)
  const [einordnung, setEinordnung] = useState('alle')
  const [entscheidung, setEntscheidung] = useState('alle')
  const [skillFilter, setSkillFilter] = useState('')
  const configured = CLIENT_ID !== '' && SHEET_ID !== ''

  const load = useCallback(async (token: string) => {
    setPhase('loading')
    setError('')
    try {
      const res = await fetch(batchGetUrl(SHEET_ID), { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 401) {
        clearToken()
        setPhase('signedOut')
        setError('Die Anmeldung ist abgelaufen. Bitte erneut anmelden.')
        return
      }
      if (res.status === 403 || res.status === 404) {
        setPhase('error')
        setError('Dieses Google-Konto hat keinen Lesezugriff auf das Register.')
        return
      }
      if (!res.ok) throw new Error(`Sheets-API: HTTP ${res.status}`)
      const json = await res.json() as { valueRanges?: { values?: unknown[][] }[] }
      const [reg, mel, fri, que, nach] = (json.valueRanges ?? []).map(v => rowsToObjects(v.values))
      setData({
        skills: toSkills(reg ?? []),
        meldungen: toMeldungen(mel ?? []),
        fristen: toFristen(fri ?? []),
        quellen: toQuellen(que ?? []),
        trends: trends(toNachfrage(nach ?? [])),
      })
      setPhase('ready')
    } catch (e) {
      setPhase('error')
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler beim Laden.')
    }
  }, [])

  // Rückkehr von Google: Token aus dem URL-Fragment übernehmen, Fragment sofort entfernen.
  useEffect(() => {
    if (!configured) return
    const auth = parseAuthHash(window.location.hash)
    const s = store()
    if (auth) {
      window.history.replaceState(null, '', window.location.pathname)
      const expected = s?.getItem(KEY_STATE)
      s?.removeItem(KEY_STATE)
      if (auth.error) {
        setPhase('signedOut')
        setError(auth.error === 'access_denied' ? 'Die Anmeldung wurde abgebrochen.' : `Google meldet: ${auth.error}`)
        return
      }
      if (!auth.accessToken || !expected || auth.state !== expected) {
        setPhase('signedOut')
        setError('Die Anmeldung konnte nicht bestätigt werden. Bitte erneut anmelden.')
        return
      }
      s?.setItem(KEY_TOKEN, auth.accessToken)
      s?.setItem(KEY_EXPIRES, String(Date.now() + (auth.expiresIn ?? 3600) * 1000))
    }
    const token = readToken()
    if (token) void load(token)
    else setPhase('signedOut')
  }, [configured, load])

  const signIn = () => {
    const state = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('')
    store()?.setItem(KEY_STATE, state)
    window.location.assign(buildAuthUrl(CLIENT_ID, `${window.location.origin}/intern`, state))
  }

  const signOut = () => {
    const token = readToken()
    clearToken()
    setData(null)
    setPhase('signedOut')
    setError('')
    if (token) {
      void fetch('https://oauth2.googleapis.com/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `token=${encodeURIComponent(token)}`,
      }).catch(() => undefined)
    }
  }

  return (
    <div className="intern">
      <header className="intern-header">
        <div className="container">
          <p className="section-label">Interner Bereich</p>
          <h1 className="intern-header__title">Skill-Radar</h1>
          <p className="intern-header__lead">
            Skills, ihre Abhängigkeiten und die wöchentlichen Meldungen dazu. Die Daten liegen im privaten Google Sheet
            „Skill-Radar Register“ und werden erst nach der Google-Anmeldung geladen. Ohne Leserecht auf das Sheet bleibt die Seite leer.
          </p>
          <div className="intern-actions">
            {phase === 'ready' || phase === 'loading' ? (
              <>
                <button type="button" className="intern-btn" onClick={() => { const t = readToken(); if (t) void load(t); else setPhase('signedOut') }}>Neu laden</button>
                <a className="intern-btn" href={sheetUrl(SHEET_ID)} target="_blank" rel="noopener noreferrer">Im Sheet bearbeiten</a>
                <button type="button" className="intern-btn intern-btn--ghost" onClick={signOut}>Abmelden</button>
              </>
            ) : configured && phase !== 'init' ? (
              <button type="button" className="intern-btn intern-btn--primary" onClick={signIn}>Mit Google anmelden</button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="container intern-body">
        {!configured && (
          <p className="intern-note">Der Bereich ist noch nicht eingerichtet: Es fehlen die Google-Client-ID oder die Sheet-ID.</p>
        )}
        {error && <p className="intern-note intern-note--error" role="alert">{error}</p>}
        {phase === 'loading' && <p className="intern-note" aria-live="polite">Lade Daten aus dem Sheet …</p>}
        {phase === 'ready' && data && (
          <Dashboard
            data={data}
            einordnung={einordnung} setEinordnung={setEinordnung}
            entscheidung={entscheidung} setEntscheidung={setEntscheidung}
            skillFilter={skillFilter} setSkillFilter={setSkillFilter}
          />
        )}
      </div>
    </div>
  )
}

type DashboardProps = {
  data: Data
  einordnung: string; setEinordnung: (v: string) => void
  entscheidung: string; setEntscheidung: (v: string) => void
  skillFilter: string; setSkillFilter: (v: string) => void
}

function Dashboard({ data, einordnung, setEinordnung, entscheidung, setEntscheidung, skillFilter, setSkillFilter }: DashboardProps) {
  const today = useMemo(() => new Date(), [])
  const skillById = useMemo(() => new Map(data.skills.map(s => [s.id, s])), [data.skills])
  const quelleById = useMemo(() => new Map(data.quellen.map(q => [q.id, q])), [data.quellen])
  const naechste = useMemo(() => upcoming(data.fristen, today), [data.fristen, today])
  const spaeter = useMemo(() => data.fristen.filter(f => f.datum && daysUntil(f.datum, today) > 84 && !/^(erledigt|entfällt)$/i.test(f.status)), [data.fristen, today])
  const offen = data.meldungen.filter(m => m.entscheidung.toLowerCase() === 'offen')
  const aktiv = data.skills.filter(s => s.status !== 'ruht')
  const letzte = data.meldungen[0]?.datum ?? null

  const meldungen = data.meldungen.filter(m =>
    (einordnung === 'alle' || m.einordnung.toLowerCase() === einordnung.toLowerCase()) &&
    (entscheidung === 'alle' || m.entscheidung.toLowerCase() === entscheidung.toLowerCase()) &&
    (!skillFilter || m.skills.includes(skillFilter)))

  const bereiche = useMemo(() => {
    const map = new Map<string, Skill[]>()
    for (const s of data.skills) map.set(s.bereich || 'Ohne Bereich', [...(map.get(s.bereich || 'Ohne Bereich') ?? []), s])
    return [...map.entries()]
  }, [data.skills])

  const showSkill = (id: string) => {
    setSkillFilter(id)
    setEinordnung('alle')
    setEntscheidung('alle')
    document.getElementById('meldungen')?.scrollIntoView({ behavior: 'smooth' })
  }

  const SkillChips = ({ ids }: { ids: string[] }) => (
    <span className="intern-chips">
      {ids.map(id => (
        <button key={id} type="button" className="intern-chip" title={skillById.get(id)?.skill ?? id} onClick={() => showSkill(id)}>{id}</button>
      ))}
    </span>
  )

  return (
    <>
      <dl className="intern-stats">
        <div><dt>Aktive Skills</dt><dd>{aktiv.length}</dd></div>
        <div><dt>Offene Meldungen</dt><dd>{offen.length}</dd></div>
        <div><dt>Fristen in 12 Wochen</dt><dd>{naechste.length}</dd></div>
        <div><dt>Letzte Meldung</dt><dd className="intern-stats__date">{formatDate(letzte)}</dd></div>
      </dl>

      <section className="intern-section" aria-labelledby="fristen">
        <h2 id="fristen">Fristen</h2>
        {naechste.length === 0 && <p className="intern-muted">Keine offenen Fristen in den nächsten 12 Wochen.</p>}
        <ol className="intern-deadlines">
          {[...naechste, ...spaeter].map((f, i) => {
            const d = f.datum ? daysUntil(f.datum, today) : null
            const url = safeUrl(f.quelle)
            return (
              <li key={`${f.ereignis}-${i}`} className={d !== null && d <= 84 ? 'is-soon' : ''}>
                <span className="intern-deadlines__date">{formatDate(f.datum)}<small>{d !== null ? (d === 0 ? 'heute' : `in ${d} Tagen`) : ''}</small></span>
                <span className="intern-deadlines__text">
                  {url ? <a href={url} target="_blank" rel="noopener noreferrer">{f.ereignis}</a> : f.ereignis}
                  {f.notiz && <small>{f.notiz}</small>}
                </span>
                <span className={`intern-badge intern-badge--${slug(f.einordnung)}`}>{f.einordnung}</span>
                <SkillChips ids={f.skills} />
              </li>
            )
          })}
        </ol>
      </section>

      <section className="intern-section" aria-labelledby="meldungen">
        <h2 id="meldungen">Meldungen</h2>
        <div className="intern-filters" role="group" aria-label="Meldungen filtern">
          <label>Einordnung
            <select value={einordnung} onChange={e => setEinordnung(e.target.value)}>
              <option value="alle">alle</option>
              {EINORDNUNGEN.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          <label>Entscheidung
            <select value={entscheidung} onChange={e => setEntscheidung(e.target.value)}>
              <option value="alle">alle</option>
              {ENTSCHEIDUNGEN.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          {skillFilter && (
            <button type="button" className="intern-chip intern-chip--active" onClick={() => setSkillFilter('')}>
              {skillFilter} · {skillById.get(skillFilter)?.skill.split('(')[0].trim()} ✕
            </button>
          )}
          <span className="intern-muted">{meldungen.length} von {data.meldungen.length}</span>
        </div>
        <div className="intern-cards">
          {meldungen.map(m => {
            const url = safeUrl(m.quelle)
            return (
              <article key={m.id} className="intern-card">
                <header className="intern-card__head">
                  <span className={`intern-badge intern-badge--${slug(m.einordnung)}`}>{m.einordnung || '–'}</span>
                  <span className="intern-card__meta">{m.id} · {formatDate(m.datum)}{m.frist && m.frist !== '–' ? ` · Frist ${m.frist}` : ''}</span>
                  <span className={`intern-decision intern-decision--${slug(m.entscheidung)}`}>{m.entscheidung}</span>
                </header>
                <p className="intern-card__text">{m.meldung}</p>
                {m.einschaetzung && <p className="intern-card__assessment"><strong>Einschätzung:</strong> {m.einschaetzung}</p>}
                {m.vorschlag && <p className="intern-card__proposal"><strong>Vorschlag:</strong> {m.vorschlag}</p>}
                {m.massnahme && <p className="intern-card__proposal"><strong>Maßnahme:</strong> {m.massnahme}</p>}
                <footer className="intern-card__foot">
                  <SkillChips ids={m.skills} />
                  {url ? <a href={url} target="_blank" rel="noopener noreferrer">Quelle</a> : <span className="intern-muted">{m.quelle}</span>}
                </footer>
              </article>
            )
          })}
          {meldungen.length === 0 && <p className="intern-muted">Keine Meldungen für diese Auswahl.</p>}
        </div>
      </section>

      <section className="intern-section" aria-labelledby="skills">
        <h2 id="skills">Skills und Wissen</h2>
        {bereiche.map(([bereich, skills]) => (
          <div key={bereich} className="intern-area">
            <h3>{bereich}</h3>
            <div className="intern-skills">
              {skills.map(s => {
                const eigene = data.meldungen.filter(m => m.skills.includes(s.id))
                const offeneEigene = eigene.filter(m => m.entscheidung.toLowerCase() === 'offen').length
                return (
                  <details key={s.id} className={`intern-skill intern-skill--${slug(s.status)}`}>
                    <summary>
                      <span className="intern-skill__id">{s.id}</span>
                      <span className="intern-skill__name">{s.skill}</span>
                      <span className={`intern-status intern-status--${slug(s.status)}`}>{s.status}</span>
                      {eigene.length > 0 && <span className="intern-skill__count">{eigene.length} Meldung{eigene.length === 1 ? '' : 'en'}{offeneEigene ? `, ${offeneEigene} offen` : ''}</span>}
                    </summary>
                    <dl className="intern-skill__facts">
                      <dt>Einsatz</dt><dd>{s.einsatz || '–'}</dd>
                      <dt>Hängt ab von</dt><dd>{s.abhaengigkeiten || '–'}</dd>
                      <dt>Anzeichen für Wertverlust</dt><dd>{s.anzeichen || '–'}</dd>
                      <dt>Eigenregie / KI-Ersatz</dt><dd>{s.eigenregie || '–'}</dd>
                      <dt>Beleg</dt><dd>{s.beleg || '–'}</dd>
                      <dt>Quellen</dt>
                      <dd>
                        {s.quellen.length === 0 ? '–' : s.quellen.map((id, i) => {
                          const q = quelleById.get(id)
                          const url = q ? safeUrl(q.url) : null
                          return <span key={id}>{i > 0 && ', '}{url ? <a href={url} target="_blank" rel="noopener noreferrer">{q?.name ?? id}</a> : (q?.name ?? id)}</span>
                        })}
                      </dd>
                      {s.notiz && <><dt>Notiz</dt><dd>{s.notiz}</dd></>}
                      <dt>Zuletzt geprüft</dt><dd>{s.geprueft || '–'}</dd>
                    </dl>
                    {eigene.length > 0 && <button type="button" className="intern-btn intern-btn--small" onClick={() => showSkill(s.id)}>Meldungen zu {s.id} anzeigen</button>}
                  </details>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="intern-section" aria-labelledby="nachfrage">
        <h2 id="nachfrage">Nachfrage</h2>
        {data.trends.length === 0 ? (
          <p className="intern-muted">Noch keine Zählungen. Die geplante Aufgabe erfasst Stellenanzeigen am ersten Montag jedes Monats.</p>
        ) : (
          <table className="intern-table">
            <thead><tr><th>Suchbegriff</th><th>Skill</th><th>Treffer</th><th>Veränderung</th><th>Verlauf</th></tr></thead>
            <tbody>
              {data.trends.map(t => (
                <tr key={t.suchbegriff}>
                  <td>{t.suchbegriff}</td>
                  <td>{t.skill}</td>
                  <td>{t.letzter ?? 'nicht ermittelbar'}</td>
                  <td className={t.veraenderung === null ? '' : t.veraenderung < 0 ? 'is-down' : 'is-up'}>{t.veraenderung === null ? '–' : `${t.veraenderung > 0 ? '+' : ''}${t.veraenderung} %`}</td>
                  <td><Sparkline values={t.werte} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="intern-section intern-section--last" aria-labelledby="quellen">
        <h2 id="quellen">Quellen</h2>
        <ul className="intern-sources">
          {data.quellen.map(q => {
            const url = safeUrl(q.url)
            return (
              <li key={q.id}>
                <span className="intern-skill__id">{q.id}</span>
                <span>{url ? <a href={url} target="_blank" rel="noopener noreferrer">{q.name}</a> : q.name}<small>{q.art}{q.hinweis ? ` · ${q.hinweis}` : ''}</small></span>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return <span className="intern-muted">–</span>
  const w = 96
  const h = 24
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const points = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / span) * (h - 4) - 2}`).join(' ')
  return (
    <svg className="intern-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Verlauf: ${values.join(', ')}`}>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
