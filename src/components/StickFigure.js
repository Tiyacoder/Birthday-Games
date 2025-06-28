// src/components/StickFigure.js
import React from "react";
import "./StickFigure.css";

export default function StickFigure() {
  return (
    <div className="stick-container">
      <div className="arrow">← Arkin</div>
      <div className="stick-figure">
        <div className="head" />
        <div className="body" />
        <div className="arms" />
        <div className="legs" />
      </div>
    </div>
  );
}
