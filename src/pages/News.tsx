import { useEffect } from "react";
import "./News.css";
import "./Disclosure.css";
import articles from '../generated/news-articles.json';
import NewsShare from '../components/NewsShare';
import NewsFactCheck from '../components/NewsFactCheck';
import NewsWorkflowNotice from '../components/NewsWorkflowNotice';
import disclosure from '../content/news-disclosure.json';

const dates = [...new Set(articles.map(article => article.date))];

export default function News() {
  useEffect(() => {
    const openLinkedEntry = () => {
      const id = window.location.hash.slice(1);
      if (id === 'news-methodology') {
        const methodology = document.getElementById(id);
        if (methodology instanceof HTMLDetailsElement) methodology.open = true;
        methodology?.scrollIntoView();
        return;
      }
      if (!/^news-\d{4}-\d{2}-\d{2}$/.test(id)) return;
      const entry = document.getElementById(id);
      const details = entry?.querySelector("details");
      if (details) details.open = true;
      entry?.scrollIntoView();
    };
    openLinkedEntry();
    window.addEventListener("hashchange", openLinkedEntry);
    return () => window.removeEventListener("hashchange", openLinkedEntry);
  }, []);

  return (
    <div className="news-page">
      <h1>News</h1>
      <NewsWorkflowNotice />

      {dates.length === 0 ? (
        <p>Noch keine News vorhanden.</p>
      ) : (
        <ul className="news-list">
          {dates.map((date) => (
            <li key={date} id={`news-${date}`} className="news-item">
              <details className="content-disclosure">
                <summary>
                  <span className="news-date">{date}</span>
                  <span className="news-poc-label">{disclosure.label} · autonomer KI-Workflow</span>
                  <h2 className="news-title">Täglicher Überblick: KI, Technologie, ERP, Nachhaltigkeit und Ethik</h2>
                  <span className="disclosure-preview">{articles.filter(article => article.date === date).map(article => article.title).join(' · ')}</span>
                  <span className="disclosure-hint" aria-hidden="true" />
                </summary>
                <div className="disclosure-content">
                  {articles.filter(article => article.date === date).map(article => (
                    <article key={article.id} className="news-teaser">
                      <h3 className="news-entry-heading"><a href={article.path}>{article.number}. {article.title}</a></h3>
                      <p>{article.description}</p>
                      <p className="news-poc-label" data-news-poc="teaser">{disclosure.label} · KI-Synthese · automatisch veröffentlicht</p>
                      <NewsFactCheck check={article.factCheck} />
                      <a href={article.path}>Vollständige Meldung und Quellen lesen →</a>
                      <NewsShare article={article} />
                    </article>
                  ))}
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
      <section className="news-rss" aria-labelledby="news-rss-title">
        <h2 id="news-rss-title">News per RSS abonnieren</h2>
        <p>Neue Tagesausgaben mit vollständigen Texten und Quellen direkt in deinem RSS-Reader lesen. Der Feed wird bei jeder Veröffentlichung automatisch aktualisiert.</p>
        <a className="news-rss-button" href="/rss.xml" type="application/rss+xml">RSS-Feed öffnen ↗</a>
        <p className="news-rss-address">Feed-Adresse: <a href="/rss.xml">https://dangulea.at/rss.xml</a></p>
        <p>Zum Abonnieren die Feed-Adresse in einen RSS-Reader einfügen.</p>
      </section>
    </div>
  );
}
