import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import "../styles/global.css";

const navigation = [
  { to: "/", label: "HOME", end: true },
  { to: "/person", label: "PERSON" },
  { to: "/projekte", label: "PROJEKTE" },
  { to: "/news", label: "NEWS" },
  { to: "/impressum", label: "IMPRESSUM" },
];

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Claudiu Dangulea Startseite">
            Claudiu Dangulea
          </Link>
          <nav className="site-nav" aria-label="Hauptnavigation">
            {navigation.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className={isHome ? "main-content home-main" : "main-content"}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} Claudiu Dangulea</span>
          <Link to="/impressum">Impressum</Link>
        </div>
      </footer>
    </div>
  );
}
