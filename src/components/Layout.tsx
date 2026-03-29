import { type ReactNode, useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
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
      {/* ── Navigation ── */}
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        <div className="nav__inner container--wide">
          <NavLink to="/" className="nav__brand">
            <span className="nav__brand-name">Claudiu Dangulea</span>
          </NavLink>

          {/* Desktop links */}
          <nav className="nav__links nav__links--desktop" aria-label="Main navigation">
            <NavLink to="/" end className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/person" className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              Person
            </NavLink>
            <NavLink to="/impressum" className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}>
              Impressum
            </NavLink>
          </nav>

          {/* Burger button */}
          <button
            className={`nav__burger${menuOpen ? ' nav__burger--open' : ''}`}
            aria-label="Toggle menu"
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
      {menuOpen && (
        <div className="nav__overlay" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            className="nav__overlay-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          <nav className="nav__overlay-links" aria-label="Mobile navigation">
            <NavLink to="/" end className={({ isActive }) => `nav__link nav__link--mobile${isActive ? ' nav__link--active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/person" className={({ isActive }) => `nav__link nav__link--mobile${isActive ? ' nav__link--active' : ''}`}>
              Person
            </NavLink>
            <NavLink to="/impressum" className={({ isActive }) => `nav__link nav__link--mobile${isActive ? ' nav__link--active' : ''}`}>
              Impressum
            </NavLink>
          </nav>
        </div>
      )}

      {/* ── Page content ── */}
      <main className="main">
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
          <p className="footer__copy">
            © {new Date().getFullYear()} Claudiu Dangulea
          </p>
        </div>
      </footer>
    </div>
  )
}
