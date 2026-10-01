import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Person from './pages/Person'
import Projekte from './pages/Projekte'
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
          <Route path="/impressum" element={<Impressum />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
