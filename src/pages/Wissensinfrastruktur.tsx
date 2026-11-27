import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Wissensinfrastruktur.css'

const permalink = 'https://dangulea.at/ressourcen/wissensinfrastruktur'
const pdf = '/ressourcen/wissensinfrastruktur-2026-11-27.pdf'

export default function Wissensinfrastruktur() {
  const [copyMessage, setCopyMessage] = useState('')

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(permalink)
      setCopyMessage('Link kopiert.')
    } catch {
      setCopyMessage('Bitte den unten angezeigten Link markieren und kopieren.')
    }
  }

  return (
    <article className="research-report container">
      <Link to="/ressourcen" className="research-report__back">Zur Ressourcenübersicht</Link>
      <header>
        <p className="section-label">Eigene Veröffentlichung · Forschungszwischenbericht</p>
        <h1>Von Chat-Verläufen zur Wissensinfrastruktur</h1>
        <p className="research-report__lead">
          Wie wird aus einem persönlichen Gesprächsarchiv eine nachvollziehbare Wissensstruktur?
          Dieser visuelle Bericht untersucht meine 3.173 ChatGPT-Unterhaltungen aus dem Zeitraum
          10. Dezember 2022 bis 25. November 2026. Er zeigt die zehn größten explorativen Themengruppen,
          Nutzungsmuster, die Konzentration der Nachrichten und einen Entwurf für die spätere Wissensorganisation.
        </p>
        <p className="research-report__meta">Claudiu Dangulea · <time dateTime="2026-11-27">27. November 2026</time> · Version 1.1 · Deutsch · PDF, 17 Seiten</p>
      </header>

      <aside className="research-report__disclosure" aria-label="KI-Kennzeichnung und Datenherkunft">
        <h2>Mit ChatGPT (OpenAI) erstellt</h2>
        <p>
          Auswertung, Text, Strukturierung und Grafiken wurden mit ChatGPT erstellt.
          Die Datengrundlage ist mein eigener, von mir bereitgestellter ChatGPT-Gesprächsbestand
          (Claudiu Dangulea). Es handelt sich um meine Daten und eine individuelle Fallstudie.
        </p>
        <p>
          Die Veröffentlichung enthält zusammengefasste Ergebnisse und konzeptionelle Modelle.
          Originalchats, private Chat-IDs, persönliche Gesprächstitel und Rohdaten werden nicht veröffentlicht.
        </p>
      </aside>

      <div className="research-report__actions">
        <a className="research-report__button" href={pdf}>PDF öffnen</a>
        <a className="research-report__button research-report__button--secondary" href={pdf} download>PDF herunterladen</a>
        <button className="research-report__button research-report__button--secondary" type="button" onClick={copyLink}>Link kopieren</button>
      </div>
      <p className="research-report__status" role="status">{copyMessage}</p>
      <p className="research-report__permalink">Teilbarer Link: <a href={permalink}>{permalink}</a></p>

      <figure className="research-report__figure">
        <img src="/ressourcen/wissensinfrastruktur-2026-11-27.png" width="1200" height="630" alt="Forschungszwischenbericht: 3.173 eigene ChatGPT-Unterhaltungen, 51.239 Nachrichtendatensätze und 59,2 Prozent Abdeckung durch die zehn größten explorativen Gruppen." />
        <figcaption>Datengrundlage: mein eigener Gesprächsbestand. Erstellung mit ChatGPT (OpenAI). Die Originaldaten bleiben privat.</figcaption>
      </figure>

      <section className="research-report__notes" aria-labelledby="report-limits">
        <h2 id="report-limits">Forschungsstand und Grenzen</h2>
        <p>
          Die Ergebnisse sind explorativ und nicht unabhängig wissenschaftlich validiert.
          Summen, Verhältnisse und Anteilswerte wurden anhand der berichteten Zahlen nachgerechnet;
          die Originalarchive wurden für diese Publikationsfassung nicht erneut ausgewertet.
          Eine Rundungsabweichung ist im PDF dokumentiert. Häufige Themen sind keine validierte Rangliste
          meiner persönlichen Interessen. Aus der Fallstudie lassen sich keine allgemeinen Aussagen
          über andere Menschen ableiten.
        </p>
      </section>

      <section className="research-report__notes" aria-labelledby="report-method">
        <h2 id="report-method">Datengrundlage der semantischen Auswertung</h2>
        <p>
          Nach der bisherigen Arbeitsdokumentation wurden für die semantische Analyse Chat-Titel
          und Nutzernachrichten kombiniert; die Titel wurden dabei doppelt gewichtet.
          KI-Antworten gehörten danach nicht zur Textrepräsentation. Die Originalexporte und
          Analyseskripte wurden für diese Fassung noch nicht erneut verifiziert. Diese Angaben
          beschreiben daher das dokumentierte Verfahren, keine reproduzierte Prüfung.
        </p>
        <p>
          Die thematischen Gruppen beschreiben vor allem Themen der Nutzereingaben. Ihr Zuschnitt
          kann durch die Titelgewichtung beeinflusst sein; sie bilden den gesamten Inhalt der
          Unterhaltungen nicht ab. Ein Vergleich von nur Titeln, nur Nutzernachrichten,
          ihrer gewichteten Kombination und vollständigen Chats einschließlich KI-Antworten
          steht aus. Auch die Stabilität der Gruppen wurde damit noch nicht geprüft.
        </p>
      </section>

      <section className="research-report__notes" aria-labelledby="report-sharing">
        <h2 id="report-sharing">Teilen, Herkunft und Rückmeldungen</h2>
        <p>
          Der Link zu dieser Seite und zum PDF darf weitergegeben werden.
          Bei einer Bezugnahme bitte Claudiu Dangulea, den Berichtstitel, den Stand vom 27. November 2026
          und die Erstellung mit ChatGPT (OpenAI) nennen. Die Bereitstellung erklärt keine ausschließlichen
          Rechte an KI-Ausgaben oder statistischen Angaben; gesetzliche Nutzungsrechte und etwaige Rechte
          Dritter bleiben unberührt.
        </p>
        <p>
          Inhaltlich verantwortlich: Claudiu Dangulea. Hinweise auf Fehler, Datenschutzfragen oder Rechte Dritter:
          {' '}<a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>.
          {' '}<Link to="/impressum">Impressum und Datenschutz</Link>.
          ChatGPT und OpenAI werden ausschließlich zur Angabe des verwendeten Werkzeugs genannt;
          eine Prüfung oder Unterstützung durch OpenAI wird damit nicht behauptet.
        </p>
      </section>
    </article>
  )
}
