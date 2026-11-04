import { useParams } from 'react-router-dom'
import articles from '../generated/news-articles.json'
import NewsShare from '../components/NewsShare'
import NewsText from '../components/NewsText'
import NewsFactCheck from '../components/NewsFactCheck'
import NewsWorkflowNotice from '../components/NewsWorkflowNotice'
import disclosure from '../content/news-disclosure.json'
import './News.css'

export default function NewsArticle() {
  const { date, number } = useParams()
  const article = articles.find(item => item.date === date && String(item.number) === number)
  if (!article) return <div className="news-page"><h1>Artikel nicht gefunden</h1><a href="/news">Zur News-Übersicht</a></div>
  return (
    <article className="news-page news-article">
      <a href={`/news#news-${article.date}`}>← Zur News-Übersicht</a>
      <p className="news-date"><time dateTime={article.date}>{article.date}</time> · Meldung {article.number}</p>
      <h1>{article.title}</h1>
      <NewsWorkflowNotice />
      <NewsFactCheck check={article.factCheck} />
      <NewsShare article={article} />
      <img className="news-article-image" src={article.ogImage} width="1200" height="630" alt={article.title} />
      <div className="news-text"><NewsText text={article.text} /></div>
      <p className="news-disclosure"><strong>Transparenz zur KI-Unterstützung:</strong> {disclosure.label}. {disclosure.summary} {disclosure.review} Stand: {article.date}. Hinweise auf Fehler bitte an <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>.</p>
    </article>
  )
}
