import disclosure from '../content/news-disclosure.json'

export default function NewsWorkflowNotice() {
  return (
    <section className="news-transparency" id="news-workflow" aria-labelledby="news-transparency-title" data-news-poc="autonomous">
      <p className="news-kicker">{disclosure.label} · Transparenz</p>
      <h2 id="news-transparency-title">{disclosure.title}</h2>
      <p>{disclosure.summary}</p>
      <p>{disclosure.review}</p>
      <p>{disclosure.limits}</p>
      <p>Der jeweilige Prüfstatus steht beim Beitrag. Hinweise auf Fehler oder notwendige Korrekturen bitte an <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>.</p>
    </section>
  )
}
