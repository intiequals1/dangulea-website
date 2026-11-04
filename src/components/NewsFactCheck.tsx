type Check = { status: string; checkedAt: string | null; limitations: string[] }

export default function NewsFactCheck({ check }: { check: Check }) {
  return (
    <section className="news-factcheck" data-factcheck={check.status} aria-label="Prüfstatus des Beitrags">
      <p><strong>Prüfstatus:</strong> {check.status === 'reviewed'
        ? <>Quellenabgleich und Gegenprüfung dokumentiert. Stand: {check.checkedAt && new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium', timeZone: 'Europe/Vienna' }).format(new Date(check.checkedAt))}.</>
        : 'Für diesen Beitrag ist noch kein zweistufiger Faktencheck dokumentiert.'}</p>
      {check.limitations.map(limitation => <p key={limitation}>{limitation}</p>)}
      <details><summary>Wie wird geprüft?</summary><p>Zuerst werden Überschrift und einzelne Quellenaussagen mit den Originalquellen abgeglichen. Danach werden gezielt Gegenbelege gesucht sowie Zahlen, Termine, Geltungsbereich und die Unabhängigkeit der Quellen geprüft. Diese automatisierten Prüfungen ersetzen keine unabhängige redaktionelle Prüfung und schließen Fehler nicht aus.</p></details>
    </section>
  )
}
