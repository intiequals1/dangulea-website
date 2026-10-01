import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Person from './pages/Person'
import Projekte from './pages/Projekte'
import Impressum from './pages/Impressum'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/person" element={<Person />} />
        <Route path="/projekte" element={<Projekte />} />
        <Route path="/impressum" element={<Impressum />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
