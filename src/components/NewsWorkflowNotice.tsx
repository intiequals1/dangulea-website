import disclosure from '../content/news-disclosure.json'

export default function NewsWorkflowNotice() {
  return (
    <section className="news-transparency" id="news-workflow" aria-labelledby="news-transparency-title" data-news-poc="autonomous">
      <p id="news-transparency-title"><strong>Transparenz zur KI-Unterstützung:</strong> {disclosure.label} · KI erstellt und veröffentlicht diese Meldungen automatisch; auch die Prüfungen sind automatisiert. Keine redaktionelle Einzelprüfung. <a href="/news#news-methodology">Vollständige Methodik und Grenzen</a></p>
      <details id="news-methodology">
      <summary>Methodik und Transparenz im Detail</summary>
      <h2>{disclosure.title}</h2>
      <p>{disclosure.summary}</p>
      <p>{disclosure.review}</p>
      <p>{disclosure.limits}</p>
      <p>Der jeweilige Prüfstatus steht beim Beitrag. Hinweise auf Fehler oder notwendige Korrekturen bitte an <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>.</p>
      </details>
    </section>
  )
}
