import { useEffect, useState, type ReactNode } from "react";
import "./News.css";

type NewsItem = {
  date: string;
  title: string;
  text: string;
};

const urlPattern = /https?:\/\/[^\s|]+/g;


function renderLinkedText(text: string) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(urlPattern)) {
    const rawUrl = match[0];
    const start = match.index ?? 0;
    const trailing = rawUrl.match(/[.,;:!?)]*$/)?.[0] ?? "";
    const url = rawUrl.slice(0, rawUrl.length - trailing.length);

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <a key={`${url}-${start}`} href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    );

    if (trailing) {
      parts.push(trailing);
    }

    lastIndex = start + rawUrl.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function renderNewsText(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const numberedHeading = block.match(/^(\d+)\.\s+(.+)$/);
      if (numberedHeading) {
        return (
          <h3 key={index} className="news-entry-heading">
            <span className="news-entry-heading__number">{numberedHeading[1]}</span>
            {numberedHeading[2]}
          </h3>
        );
      }

      const labelledBlock = block.match(/^([^:\n]+):\s*([\s\S]*)$/);
      if (labelledBlock) {
        const [, label, body] = labelledBlock;
        return (
          <p key={index} className={`news-entry-block news-entry-block--${label.toLowerCase().replace(/\s+/g, "-")}`}>
            <strong>{label}:</strong>
            {body ? <> {renderLinkedText(body)}</> : null}
          </p>
        );
      }

      return (
        <p key={index} className="news-entry-block">
          {renderLinkedText(block)}
        </p>
      );
    });
}

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
              <div className="news-text">{renderNewsText(item.text)}</div>
              {!item.text.includes("Transparenz zur KI-Unterstützung") && (
                <p className="news-disclosure">
                  Dieser Beitrag wurde automatisiert unter Einsatz künstlicher Intelligenz
                  erstellt oder bearbeitet. Stand: {item.date}.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
