import { Link } from 'react-router-dom'
import './PrivacyNotice.css'

export default function PrivacyNotice() {
  return (
    <aside className="privacy-notice" aria-label="Datenschutzhinweis">
      <p>
        Öffentliche Seiten: keine eigenen Cookies, kein Analyse- oder Werbetracking.
        Schriftarten werden lokal ausgeliefert. Der interne Bereich nutzt nach gestarteter
        Google-Anmeldung Sitzungsspeicher und Google-Dienste.
      </p>
      <Link to="/impressum#datenschutz" className="footer__link">Datenschutz und Browser-Speicher</Link>
    </aside>
  )
}
