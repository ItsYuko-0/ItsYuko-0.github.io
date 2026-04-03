import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";

import Navigation from "./components/Navigation";
import ContentPage from "./pages/ContentPage";
import DataPage from "./pages/DataPage";
import CharacterPage from "./pages/CharacterPage";
import OtherPage from "./pages/OtherPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navigation />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<ContentPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/characters" element={<CharacterPage />} />
            <Route path="/characters/:characterName" element={<CharacterPage />} />
            <Route path="/other" element={<OtherPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;
