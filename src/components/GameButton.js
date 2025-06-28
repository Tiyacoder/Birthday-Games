import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function GameButton({ text, color, to }) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(to)}
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: color,
        color: "#fff",
        fontSize: "1rem",
        borderRadius: "16px",
        textTransform: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          backgroundColor: color,
          opacity: 0.9,
        },
      }}
    >
      {text}
    </Button>
  );
}
