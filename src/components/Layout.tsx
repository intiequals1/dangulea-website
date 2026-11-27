import { type ReactNode, useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Layout.css'
import disclosure from '../content/news-disclosure.json'
import PrivacyNotice from './PrivacyNotice'
import titles from '../content/page-titles.json'
import articles from '../generated/news-articles.json'
import { pageTitle } from '../utils/pageTitle'

interface LayoutProps {
  children: ReactNode
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="4.5" y="10.5" width="15" height="10" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lastLocation = useRef(location)
  const title = pageTitle(location.pathname, titles, articles)
  const isNews = location.pathname === '/news' || location.pathname.startsWith('/news/')

  useEffect(() => {
    document.title = title
    const changed = lastLocation.current !== location
    lastLocation.current = location
    if (changed && dialogRef.current?.open) dialogRef.current.close()
    const frame = requestAnimationFrame(() => {
      const target = location.hash ? document.getElementById(location.hash.slice(1)) : null
      if (target) {
        // Hash targets can be a closed disclosure, or contain one.
        if (target instanceof HTMLDetailsElement) target.open = true
        const disclosure = target.querySelector('details')
        if (disclosure) disclosure.open = true
        let parent = target.parentElement
        while (parent) {
          if (parent instanceof HTMLDetailsElement) parent.open = true
          parent = parent.parentElement
        }
        target.tabIndex = -1
        target.focus({ preventScroll: true })
        target.scrollIntoView()
      } else if (changed) {
        const heading = document.querySelector<HTMLElement>('main h1')
        if (heading) {
          heading.tabIndex = -1
          heading.focus({ preventScroll: true })
        }
        window.scrollTo(0, 0)
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [location, title])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (menuOpen) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    } else {
      if (dialog.open) dialog.close()
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="layout">
      <a className="skip-link" href="#main-content">Zum Inhalt</a>
      {/* ── Navigation ── */}
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        <div className="nav__inner container--wide">
          <NavLink to="/" className="nav__brand" onClick={() => setMenuOpen(false)}>
            <span className="nav__brand-name">Claudiu Dangulea</span>
          </NavLink>

          {/* Desktop links */}
          <nav className="nav__links nav__links--desktop" aria-label="Hauptnavigation">
            <NavLink to="/" end className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/person" className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              Person
            </NavLink>
            <NavLink to="/projekte" className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              Projekte
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              News
            </NavLink>
            <NavLink to="/aktuelle-themen" className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              Aktuelle Themen
            </NavLink>
            <NavLink to="/ressourcen" className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              Ressourcen
            </NavLink>
            <NavLink to="/impressum" className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              Impressum
            </NavLink>
            <NavLink to="/intern" aria-label="Privater Bereich" title="Privater Bereich" className={({ isActive }) => `nav__link nav__link--icon${isActive ? ' nav__link--active' : ''}`}>
              <LockIcon />
            </NavLink>
          </nav>

          {/* Burger button */}
          <button
            className={`nav__burger${menuOpen ? ' nav__burger--open' : ''}`}
            type="button"
            aria-label="Menü öffnen"
            aria-controls="navigation-dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
        <dialog ref={dialogRef} id="navigation-dialog" className="nav__overlay" aria-label="Navigation" onClose={() => setMenuOpen(false)} onCancel={() => setMenuOpen(false)} onKeyDown={event => {
          if (event.key !== 'Tab') return
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
        }}>
          <div className="nav__overlay-header">
          <button
            className="nav__overlay-close"
            type="button"
            aria-label="Menü schließen"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          </div>
          <nav className="nav__overlay-links" aria-label="Mobile Hauptnavigation">
            <NavLink to="/" end className={({ isActive }) => `nav__link nav__link--mobile${isActive ? ' nav__link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/person" className={({ isActive }) => `nav__link nav__link--mobile${isActive ? ' nav__link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              Person
            </NavLink>
            <NavLink to="/projekte" className={({ isActive }) => `nav__link nav__link--mobile${isActive ? ' nav__link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              Projekte
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => `nav__link nav__link--mobile${isActive ? ' nav__link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              News
            </NavLink>
            <NavLink to="/aktuelle-themen" className={({ isActive }) => `nav__link nav__link--mobile${isActive ? ' nav__link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              Aktuelle Themen
            </NavLink>
            <NavLink to="/ressourcen" className={({ isActive }) => `nav__link nav__link--mobile${isActive ? ' nav__link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              Ressourcen
            </NavLink>
            <NavLink to="/impressum" className={({ isActive }) => `nav__link nav__link--mobile${isActive ? ' nav__link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              Impressum
            </NavLink>
            <NavLink to="/intern" aria-label="Privater Bereich" title="Privater Bereich" className={({ isActive }) => `nav__link nav__link--mobile nav__link--icon${isActive ? ' nav__link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              <LockIcon />
            </NavLink>
          </nav>
        </dialog>

      {/* ── Page content ── */}
      <main id="main-content" tabIndex={-1} className="main">
        <aside className="site-notice" aria-label="Hinweis zum Entwicklungsstand">
          <p><strong>Diese Website ist noch im Aufbau.</strong> Inhalte und Funktionen werden laufend ergänzt und verbessert.</p>
        </aside>
        {isNews && <aside className="news-workflow-strip" aria-label="News als Proof of Concept" data-news-poc="persistent"><span>{disclosure.persistent}</span><a href="/news#news-workflow">Ablauf erklärt</a></aside>}
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer__ornament" aria-hidden="true">
          <span className="footer__diamond">◆</span>
        </div>
        <div className="footer__inner container">
          <p className="footer__name">Claudiu Dangulea</p>
          <p className="footer__location">Vienna, Austria</p>
          <div className="footer__links">
            <a href="mailto:claudiu.dangulea@gmail.com" className="footer__link">
              claudiu.dangulea@gmail.com
            </a>
            <span className="footer__sep" aria-hidden="true">·</span>
            <a
              href="https://linkedin.com/in/claudang"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              LinkedIn
            </a>
          </div>
          <p className="footer__places">
            Drei Orte: <span className="footer__place">dangulea.at · Person</span>
            <span className="footer__sep" aria-hidden="true">·</span>
            <a href="https://www.digitalpath.at" target="_blank" rel="noopener noreferrer" className="footer__link">
              digitalpath.at · Projektlabor
            </a>
            <span className="footer__sep" aria-hidden="true">·</span>
            <a href="https://www.coolwebtoday.org" target="_blank" rel="noopener noreferrer" className="footer__link">
              coolwebtoday.org · Werkstatt
            </a>
          </p>
          <p className="footer__copy">
            <a href="/news#news-workflow" className="footer__link">News-PoC: autonome KI-Synthese und Veröffentlichung</a>
          </p>
          <PrivacyNotice />
          <p className="footer__copy">
            © {new Date().getFullYear()} Claudiu Dangulea
          </p>
        </div>
      </footer>

    </div>
  )
}
