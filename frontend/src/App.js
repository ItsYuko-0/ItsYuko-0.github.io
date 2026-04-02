import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import { AnimatePresence } from "framer-motion";
import "./App.css";

import Navigation from "./components/Navigation";
import ContentPage from "./pages/ContentPage";
import DataPage from "./pages/DataPage";
import CharacterPage from "./pages/CharacterPage";

function App() {
  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

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
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;
