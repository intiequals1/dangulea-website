import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Person from './pages/Person'
import Impressum from './pages/Impressum'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter basename="/dangulea-website">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/person" element={<Person />} />
          <Route path="/impressum" element={<Impressum />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
