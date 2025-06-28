import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MemoryGame from "./pages/MemoryGame";
import StickJumpGame from "./pages/StickJumpGame";
import MazeGame from './components/MazeGame';
import GiftSurpriseGame from './pages/GiftSurpriseGame'; // ✅ Added this

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/memory-flip" element={<MemoryGame />} />
        <Route path="/stick-jump" element={<StickJumpGame />} />
        <Route path="/puzzle" element={<MazeGame />} />
        <Route path="/catch-the-gift" element={<GiftSurpriseGame />} /> {/* ✅ New Route */}
      </Routes>
    </Router>
  );
}
