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
      {items.length === 0 ? (
        <p>Noch keine News vorhanden.</p>
      ) : (
        <ul className="news-list">
          {items.map((item, idx) => (
            <li key={idx} className="news-item">
              <div className="news-date">{item.date}</div>
              <h2 className="news-title">{item.title}</h2>
              <p className="news-text">{item.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
