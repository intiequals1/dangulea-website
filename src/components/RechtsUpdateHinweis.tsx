import { rechtsUpdate } from '../content/rechts-update'

// Zweck, Entstehung und Grenzen des Rechts-Updates; erscheint im Segment und auf jeder Ausgabe.
export default function RechtsUpdateHinweis() {
  const { hinweis } = rechtsUpdate
  const mail = 'claudiu@dangulea.at'
  const [beforeMail, afterMail = ''] = hinweis.korrekturen.split(mail)
  return (
    <section className="rechts-update-hinweis" aria-label="Zweck und Grenzen des Rechts-Updates" data-rechts-update="hinweis">
      <p><strong>Zweck:</strong> {hinweis.zweck}</p>
      <p><strong>Entstehung:</strong> {hinweis.erstellung}</p>
      <p><strong>Grenzen:</strong> {hinweis.grenzen}</p>
      <p>{hinweis.abgrenzung}</p>
      <p>{beforeMail}<a href={`mailto:${mail}`}>{mail}</a>{afterMail}</p>
    </section>
  )
}
