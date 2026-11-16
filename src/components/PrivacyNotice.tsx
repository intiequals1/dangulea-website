import { useEffect, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import './PrivacyNotice.css'

/*
 * Datenschutzhinweis: informiert und fragt keine Einwilligung ab, weil die öffentlichen Seiten
 * keine Cookies, kein Tracking und keine externen Dienste nutzen. Gespeichert wird nur, dass der
 * Hinweis geschlossen wurde (beschrieben in der Datenschutzerklärung, § 165 Abs. 3 TKG 2021).
 * Beim Vorrendern gilt der Hinweis als geschlossen; sichtbar wird er erst im Browser.
 */
const NOTICE_KEY = 'dangulea.datenschutzhinweis.v1'
const listeners = new Set<() => void>()
let closedInMemory = false

function isClosed(): boolean {
  if (closedInMemory) return true
  try {
    return window.localStorage.getItem(NOTICE_KEY) === 'geschlossen'
  } catch {
    return false
  }
}

function closeNotice() {
  closedInMemory = true
  try {
    window.localStorage.setItem(NOTICE_KEY, 'geschlossen')
  } catch {
    /* nur für diesen Aufruf */
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export default function PrivacyNotice() {
  const closed = useSyncExternalStore(subscribe, isClosed, () => true)

  useEffect(() => {
    document.body.classList.toggle('has-privacy-notice', !closed)
    return () => document.body.classList.remove('has-privacy-notice')
  }, [closed])

  if (closed) return null

  return (
    <aside className="privacy-notice" aria-label="Datenschutzhinweis">
      <p>
        Diese Website setzt keine Cookies und kein Tracking ein und lädt keine externen Dienste. Nur die
        ausdrücklich gestartete Google-Anmeldung im internen Bereich nutzt einen Sitzungsspeicher. Wenn Sie
        diesen Hinweis schließen, wird nur das in Ihrem Browser vermerkt.
      </p>
      <div className="privacy-notice__actions">
        <Link to="/impressum#datenschutz">Datenschutzerklärung</Link>
        <button type="button" onClick={closeNotice}>Verstanden</button>
      </div>
    </aside>
  )
}
