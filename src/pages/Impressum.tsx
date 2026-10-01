import "./Impressum.css";

export default function Impressum() {
  return (
    <div className="impressum-page">
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="eyebrow">LEGAL</p>
          <h1>Impressum</h1>
        </div>
      </section>

      <section className="impressum-content">
        <div className="impressum-inner">
          <h2>Angaben gemäß § 5 ECG, § 14 UGB, § 63 GewO</h2>
          <p>
            Claudiu Dangulea<br />
            Hütteldorfer Straße 45/2/12<br />
            1150 Wien<br />
            Österreich
          </p>
          <p>
            E-Mail: <a href="mailto:claudiu@dangulea.at">claudiu@dangulea.at</a>
          </p>
        </div>
      </section>
    </div>
  );
}
