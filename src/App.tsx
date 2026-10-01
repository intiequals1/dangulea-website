import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Person from "./pages/Person";
import Projekte from "./pages/Projekte";
import Impressum from "./pages/Impressum";
import News from "./pages/News";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="person" element={<Person />} />
        <Route path="projekte" element={<Projekte />} />
        <Route path="news" element={<News />} />
        <Route path="impressum" element={<Impressum />} />
      </Route>
    </Routes>
  );
}

export default App;
