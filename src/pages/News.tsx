import { useEffect, useMemo, useState, type ReactNode } from "react";
import "./News.css";

type NewsItem = {
  date: string;
  title: string;
  text: string;
};

const urlPattern = /https?:\/\/[^\s|]+/g;

const topicFilters = [
  'Alle',
  'KI & Technologie',
  'ERP & SAP',
  'Nachhaltigkeit',
  'Ethik & Regulierung',
  'Österreich & EU',
] as const;

type TopicFilter = typeof topicFilters[number];

const topicKeywords: Record<Exclude<TopicFilter, 'Alle'>, string[]> = {
  'KI & Technologie': ['ki', 'künstliche intelligenz', 'ai', 'technologie', 'data science', 'daten', 'cyber', 'digital', 'software'],
  'ERP & SAP': ['erp', 'sap', 's/4hana', 'fi/co', 'system-architektur', 'prozess', 'joule'],
  'Nachhaltigkeit': ['nachhaltigkeit', 'sustainability', 'sdg', 'esg', 'klima', 'kreislauf', 'umwelt', 'ressourcen'],
  'Ethik & Regulierung': ['ethik', 'regulierung', 'gesetz', 'ai act', 'urheberrecht', 'transparenz', 'governance', 'compliance'],
  'Österreich & EU': ['österreich', 'austria', 'wien', 'eu ', 'eu-', 'europäische', 'eurostat', 'kommission', 'enisa'],
};

function matchesTopic(item: NewsItem, selectedTopic: TopicFilter) {
  if (selectedTopic === 'Alle') return true;
  const haystack = `${item.date} ${item.title} ${item.text}`.toLowerCase();
  return topicKeywords[selectedTopic].some((keyword) => haystack.includes(keyword));
}


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
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>("Alle");
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

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const searchableText = `${item.date} ${item.title} ${item.text}`.toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      return matchesQuery && matchesTopic(item, selectedTopic);
    });
  }, [items, query, selectedTopic]);

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

      <section className="news-controls" aria-label="News filtern">
        <label className="news-search">
          <span>Suche</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="z. B. SAP, AI Act, Österreich"
          />
        </label>
        <label>
          <span>Thema</span>
          <select value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value as TopicFilter)}>
            {topicFilters.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </label>
      </section>

      <p className="news-count">{filteredItems.length} von {items.length} Beiträgen</p>

      {items.length === 0 ? (
        <p>Noch keine News vorhanden.</p>
      ) : filteredItems.length === 0 ? (
        <p className="news-empty">Keine News für diese Suche gefunden.</p>
      ) : (
        <ul className="news-list">
          {filteredItems.map((item, idx) => (
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
