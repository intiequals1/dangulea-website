import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Wissensinfrastruktur.css'

const permalink = 'https://dangulea.at/ressourcen/vom-dialog-zur-werkzeugarbeit'
const pdf = '/ressourcen/vom-dialog-zur-werkzeugarbeit-2026-11-27.pdf'

export default function VomDialogZurWerkzeugarbeit() {
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
        <p className="section-label">Eigene Veröffentlichung · Forschungszwischenbericht · KI-generiert</p>
        <h1>Vom Dialog zur Werkzeugarbeit</h1>
        <p className="research-report__lead">
          Kurz: Ich arbeite mit KI zunehmend in Arbeitsabläufen statt nur im Chat. Dieser Bericht zeigt das an meinen eigenen Daten.
          Ausgewertet sind die 983 Gespräche, die mein Claude-Datenexport enthält (19. Mai 2024 bis 25. November 2026): wie sich
          die Arbeitsweise verändert, wenn Werkzeuge, Connectoren und geplante Aufgaben hinzukommen, eine grobe Einordnung nach
          Themenfeldern und ein Entwurf für eine gemeinsame Ordnung von Gesprächen, Projekten, Memory und Artefakten.
        </p>
        <p className="research-report__meta">Herausgeber: Claudiu Dangulea · Text KI-generiert mit Claude (Anthropic) · <time dateTime="2026-11-27">27. November 2026</time> · Version 1.0 · Deutsch · PDF, 13 Seiten</p>
      </header>

      <aside className="research-report__disclosure" aria-label="KI-Kennzeichnung und Datenherkunft">
        <h2>KI-generiert mit Claude (Anthropic)</h2>
        <p>
          <strong>Fragestellung, Auswahl der veröffentlichten Inhalte und Freigabe:</strong> Claudiu Dangulea.{' '}
          <strong>Text, Auswertungscode, Klassifikation und Grafiken</strong> dieses Berichts und dieser Seite:
          KI-generiert mit Claude (Anthropic).
        </p>
        <p>
          Die Datengrundlage ist mein eigener, von mir bereitgestellter Claude-Datenexport vom 27. November 2026.
          Es handelt sich um meine Daten und eine individuelle Fallstudie.
        </p>
        <p>
          Die Veröffentlichung enthält zusammengefasste Ergebnisse und konzeptionelle Modelle.
          Originalchats, Gesprächstitel, Projekt- und Artefaktnamen, Tages- und Uhrzeitmuster sowie Rohdaten werden
          nicht veröffentlicht. Ein Themenfeld mit persönlichem Bezug ist nicht gesondert ausgewiesen.
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
        <img src="/ressourcen/vom-dialog-zur-werkzeugarbeit-2026-11-27.png" width="1200" height="630" alt="Forschungszwischenbericht: 983 eigene Claude-Gespräche, 10.413 Nachrichten und 63,2 Prozent agentische Sitzungen im vierten Quartal 2026." />
        <figcaption>KI-generiert mit Claude (Anthropic). Datengrundlage: mein eigener Gesprächsbestand. Die Originaldaten bleiben privat.</figcaption>
      </figure>

      <section className="research-report__notes" aria-labelledby="report-limits">
        <h2 id="report-limits">Forschungsstand und Grenzen</h2>
        <p>
          Die Ergebnisse sind explorativ und nicht unabhängig wissenschaftlich validiert. Die Zahlen wurden aus dem Export
          berechnet; 31 Rechenprüfungen von Summen und Anteilen sind im PDF dokumentiert. Arbeitsmodi und Werkzeuge folgen aus
          den Werkzeugaufrufen im Export. Die Themenfelder sind dagegen nur eine grobe Einordnung: Schlüsselwortregeln über
          Gesprächstitel und meine eigenen Nachrichten, danach eine Sichtung der Titel durch Claude. Gegen den vollständigen
          Gesprächsinhalt ist diese Zuordnung nicht geprüft; häufige Felder sind keine Rangliste meiner Interessen. Aus der
          Fallstudie lassen sich keine allgemeinen Aussagen über andere Menschen oder über Claude ableiten.
        </p>
        <p>
          Der Zeitraum ergibt sich aus dem Export: Das älteste enthaltene Gespräch stammt vom 19. Mai 2024. Gelöschte
          Gespräche sind nicht enthalten; ein Datum der Kontoerstellung weist der Export nicht aus.
        </p>
        <p>
          Der Bericht ergänzt meinen Forschungszwischenbericht{' '}
          <Link to="/ressourcen/wissensinfrastruktur">Von Chat-Verläufen zur Wissensinfrastruktur</Link> über 3.173
          ChatGPT-Unterhaltungen. Beide Exporte sind unterschiedlich aufgebaut; die Zahlen sind daher nicht direkt vergleichbar.
        </p>
      </section>

      <section className="research-report__notes" aria-labelledby="report-sharing">
        <h2 id="report-sharing">Teilen, Herkunft und Rückmeldungen</h2>
        <p>
          Der Link zu dieser Seite und zum PDF darf weitergegeben werden.
          Bei einer Bezugnahme bitte Claudiu Dangulea, den Berichtstitel, den Stand vom 27. November 2026
          und die Kennzeichnung „KI-generiert mit Claude (Anthropic)“ nennen. Die Bereitstellung erklärt keine ausschließlichen
          Rechte an KI-Ausgaben oder statistischen Angaben; gesetzliche Nutzungsrechte und etwaige Rechte
          Dritter bleiben unberührt.
        </p>
        <p>
          Die Kennzeichnung als KI-generiert folgt Art. 50 Abs. 4 der{' '}
          <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" target="_blank" rel="noopener noreferrer">Verordnung (EU) 2024/1689 (KI-Verordnung)</a>;
          sie gilt unabhängig davon, dass ich den Bericht freigegeben habe.
          Redaktionelle Verantwortung: Claudiu Dangulea (Medieninhaber, siehe Impressum). Hinweise auf Fehler, Datenschutzfragen oder Rechte Dritter:
          {' '}<a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>.
          {' '}<Link to="/impressum">Impressum und Datenschutz</Link>.
          Claude und Anthropic werden ausschließlich zur Angabe des verwendeten Werkzeugs genannt;
          eine Prüfung oder Unterstützung durch Anthropic wird damit nicht behauptet.
        </p>
      </section>
    </article>
  )
}
