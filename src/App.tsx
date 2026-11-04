import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Person from './pages/Person'
import Projekte from './pages/Projekte'
import News from './pages/News'
import NewsArticle from './pages/NewsArticle'
import AktuelleThemen from './pages/AktuelleThemen'
import Ressourcen from './pages/Ressourcen'
import Impressum from './pages/Impressum'
import './styles/global.css'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/person" element={<Person />} />
        <Route path="/projekte" element={<Projekte />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:date/:number/" element={<NewsArticle />} />
        <Route path="/aktuelle-themen" element={<AktuelleThemen />} />
        <Route path="/ressourcen" element={<Ressourcen />} />
        <Route path="/impressum" element={<Impressum />} />
      </Routes>
    </Layout>
  )
}
