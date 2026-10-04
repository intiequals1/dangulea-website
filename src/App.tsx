import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Person from './pages/Person'
import Projekte from './pages/Projekte'
import News from './pages/News'
import Ressourcen from './pages/Ressourcen'
import Impressum from './pages/Impressum'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/person" element={<Person />} />
          <Route path="/projekte" element={<Projekte />} />
          <Route path="/news" element={<News />} />
          <Route path="/ressourcen" element={<Ressourcen />} />
          <Route path="/impressum" element={<Impressum />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
