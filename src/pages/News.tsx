import { useEffect, useState } from "react";
import "./News.css";

type NewsItem = {
  date: string;
  title: string;
  text: string;
};

export default function News() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/news-updates.json")
      .then((res) => {
        if (!res.ok) throw new Error("News konnten nicht geladen werden");
        return res.json();
      })
      .then((data: NewsItem[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Unbekannter Fehler");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="news-loading">Lade News…</div>;
  if (error) return <div className="news-error">Fehler: {error}</div>;

  return (
    <div className="news-page">
      <h1>News</h1>
      <section className="news-transparency" aria-labelledby="news-transparency-title">
        <p className="news-kicker">Transparenzhinweis</p>
        <h2 id="news-transparency-title">Automatisiert erstellte Inhalte</h2>
        <p>
          Die auf dieser Seite veröffentlichten Beiträge können vollständig oder teilweise
          automatisiert und unter Einsatz künstlicher Intelligenz, insbesondere durch
          Perplexity-Automatisierungen, erstellt, zusammengefasst oder sprachlich
          bearbeitet werden.
        </p>
        <p>
          Automatisierte Inhalte können Fehler enthalten, unvollständig sein, Quellen
          falsch gewichten oder nach Veröffentlichung veralten. Sie dienen allgemeinen
          Informationszwecken und ersetzen keine individuelle rechtliche, steuerliche,
          finanzielle, technische oder sonstige fachliche Beratung.
        </p>
        <p>
          Quellen werden, soweit verfügbar, im jeweiligen Beitrag angegeben. Hinweise auf
          Fehler, unklare Quellen oder notwendige Korrekturen können per E-Mail an{' '}
          <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a> gesendet werden.
        </p>
      </section>

      {items.length === 0 ? (
        <p>Noch keine News vorhanden.</p>
      ) : (
        <ul className="news-list">
          {items.map((item, idx) => (
            <li key={idx} className="news-item">
              <div className="news-date">{item.date}</div>
              <h2 className="news-title">{item.title}</h2>
              <p className="news-text">{item.text}</p>
              <p className="news-disclosure">
                Dieser Beitrag wurde automatisiert unter Einsatz künstlicher Intelligenz
                erstellt oder bearbeitet. Stand: {item.date}.
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
