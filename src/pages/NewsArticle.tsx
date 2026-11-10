import { useParams } from 'react-router-dom'
import articles from '../generated/news-articles.json'
import withdrawnEditions from '../../data/news-withdrawn-editions.json'
import NewsShare from '../components/NewsShare'
import NewsText from '../components/NewsText'
import NewsFactCheck from '../components/NewsFactCheck'
import NewsWorkflowNotice from '../components/NewsWorkflowNotice'
import './News.css'

const withdrawnCounts: Record<string, number> = withdrawnEditions

export default function NewsArticle() {
  const { date, number } = useParams()
  const article = articles.find(item => item.date === date && String(item.number) === number)
  if (!article) return <div className="news-page"><h1>Artikel nicht gefunden</h1><a href="/news">Zur News-Übersicht</a></div>
  const withdrawnCount = withdrawnCounts[article.date] ?? 0
  const withdrawn = article.number <= withdrawnCount
  return (
    <article className="news-page news-article">
      <a href={withdrawn ? '/news' : `/news#news-${article.date}`}>← Zur News-Übersicht</a>
      <p className="news-date"><time dateTime={article.date}>{article.date}</time> · Meldung {withdrawn ? article.number : article.number - withdrawnCount}</p>
      <h1>{article.title}</h1>
      {withdrawn && <p>Diese Ausgabe wurde wegen der Themenauswahl aus der News-Übersicht und dem RSS-Feed zurückgezogen. Der Artikel bleibt als Archivfassung abrufbar.</p>}
      <p className="news-lead">{article.description}</p>
      <NewsFactCheck check={article.factCheck} />
      <img className="news-article-image" src={article.ogImage} width="1200" height="630" alt={article.title} />
      <div className="news-text"><NewsText text={article.text} /></div>
      <NewsShare article={article} />
      <NewsWorkflowNotice />
    </article>
  )
}
