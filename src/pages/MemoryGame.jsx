import React, { useState, useEffect } from "react";
import MemoryCard from "../components/MemoryCard";
import { Box, Button, Typography } from "@mui/material";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

const imageNames = [
  "arkin1.jpg", "arkin2.jpg", "arkin3.jpg", "arkin4.jpg",
  "arkin5.jpg", "arkin6.jpg", "arkin7.jpg", "arkin8.jpg",
];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const { width, height } = useWindowSize(); // for Confetti

  const shuffleCards = () => {
    const shuffled = [...imageNames, ...imageNames]
      .map((img) => ({
        src: `/images/${img}`,
        id: Math.random(),
        matched: false,
      }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFirstChoice(null);
    setSecondChoice(null);
    setMatchedPairs(0);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.src === secondChoice.src) {
        setCards((prev) =>
          prev.map((card) =>
            card.src === firstChoice.src ? { ...card, matched: true } : card
          )
        );
        setMatchedPairs((prev) => prev + 1);
        resetTurn();
      } else {
        setTimeout(resetTurn, 800);
      }
    }
  }, [firstChoice, secondChoice]);

  const handleChoice = (card) => {
    if (!disabled) {
      firstChoice ? setSecondChoice(card) : setFirstChoice(card);
    }
  };

  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  const isGameWon = matchedPairs === imageNames.length;

  return (
    <Box sx={{ py: 6, px: 3, textAlign: "center" }}>
      {isGameWon && <Confetti width={width} height={height} numberOfPieces={300} />}

      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        MATCH CARDS TO UNLOCK MEMORIES
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          maxWidth: 800,
          mx: "auto",
          mt: 4,
        }}
      >
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={
              card === firstChoice ||
              card === secondChoice ||
              card.matched
            }
            disabled={disabled}
          />
        ))}
      </Box>

      {isGameWon && (
        <Typography variant="h5" sx={{ mt: 4, color: "green" }}>
          CONGRATS ARKIN! YOU WON MEMORY FLIP!
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={shuffleCards}
        sx={{ mt: 5 }}
      >
        Restart Game
      </Button>
    </Box>
  );
}
