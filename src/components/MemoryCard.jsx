import React from "react";
import { Box } from "@mui/material";

export default function MemoryCard({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled && !flipped) {
      handleChoice(card);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: "100%",
        aspectRatio: "1 / 1",
        perspective: "1000px",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "none",
          transition: "transform 0.6s",
        }}
      >
        {/* BACK of the card (shows initially) */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            backgroundColor: "#1976d2", // solid blue
            borderRadius: "12px",
          }}
        />

        {/* FRONT of the card (revealed on flip) */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid #ccc",
            backgroundColor: "#fff",
          }}
        >
          <img
            src={card.src}
            alt="card front"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
