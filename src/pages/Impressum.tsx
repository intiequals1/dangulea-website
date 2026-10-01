import Layout from './Layout'
import './Impressum.css'

export default function Impressum() {
  return (
    <Layout>
      <section className="impressum-page">
        <div className="impressum-hero">
          <p className="eyebrow">Rechtliches</p>
          <h1>Impressum</h1>
        </div>

        <div className="impressum-content">
          <section>
            <h2>Medieninhaber und Herausgeber</h2>
            <p>
              Claudiu Dangulea<br />
              Wien, Österreich
            </p>
          </section>

          <section>
            <h2>Kontakt</h2>
            <p>
              E-Mail: <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>
            </p>
          </section>

          <section>
            <h2>Haftungshinweis</h2>
            <p>
              Trotz sorgfältiger inhaltlicher Kontrolle übernehme ich keine Haftung für die Inhalte externer Links.
              Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </section>
        </div>
      </section>
    </Layout>
  )
}
