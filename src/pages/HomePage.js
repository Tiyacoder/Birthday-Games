import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import GameButton from "../components/GameButton";

// 🎯 Better suited icons for personality
import { TbBrandVscode } from "react-icons/tb"; // Coding laptop
import {
  FaCoffee,
  FaFutbol,
  FaLaptop,
  FaFlask,
  FaGamepad,
  FaBrain,
} from "react-icons/fa";

// 🎈 Balloon colors
const balloonColors = [
  "#FF0080", "#FF6600", "#FFEB3B", "#00FF00",
  "#00FFFF", "#1E90FF", "#8A2BE2", "#FF1493",
  "#FFD700", "#00FF7F", "#FF4500", "#40E0D0",
];

export default function HomePage() {
  const { width, height } = useWindowSize();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [scrollBalloons, setScrollBalloons] = useState([]);
  const scrollRef = useRef(null);

const gameButtons = [
  { text: "TRIP DOWN MEMORY LANE", color: "#81C784", to: "/memory-flip" },
  { text: "DODGE THE RESPONSIBILITY", color: "#FFB74D", to: "/stick-jump" },  // Changed here
  { text: "MAZE GAME", color: "#BA68C8", to: "/puzzle" },
  { text: "SURPRISE GIFT", color: "#64B5F6", to: "/catch-the-gift" },
];


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let balloons = [];
          let count = 0;

          const interval = setInterval(() => {
            const newBalloon = {
              id: Date.now() + Math.random(),
              color:
                balloonColors[Math.floor(Math.random() * balloonColors.length)],
              left: `${Math.random() * 90}%`,
            };
            balloons.push(newBalloon);
            setScrollBalloons([...balloons]);
            count++;

            if (count >= 50) {
              clearInterval(interval);
              setTimeout(() => setScrollBalloons([]), 4000);
            }
          }, 150);
        }
      },
      { threshold: 0.4 }
    );

    if (scrollRef.current) observer.observe(scrollRef.current);
    return () => {
      if (scrollRef.current) observer.unobserve(scrollRef.current);
    };
  }, []);

  return (
    <>
      {/* 🎈 Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          backgroundColor: "#D0E6FF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <Confetti width={width} height={height} />

        {/* 📝 Text */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            px: 2,
            mb: 1,
            transform: "translateY(1cm)",
          }}
        >
          <Typography
            variant={isMobile ? "h4" : "h2"}
            sx={{ fontWeight: 700, color: "#000000", mb: 5 }}
          >
            HAPPY BIRTHDAY ARKIN 🎉
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{ fontWeight: 600, color: "#000000", mb: 1 }}
          >
            20 years old, no longer a teenager
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 500, color: "#000000" }}
          >
            ( STILL -1 MONTH 7 DAYS YOUNGER THAN ME )
          </Typography>
        </Box>

        {/* 🧠 Trait Icons */}
        <Box
          sx={{
            width: "95%",
            maxWidth: "1300px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "4cm",
            gap: 0.5,
          }}
        >
          {[TbBrandVscode, FaCoffee, FaFutbol, FaLaptop, FaFlask, FaGamepad, FaBrain].map(
            (Icon, i) => (
              <Box
                key={i}
                sx={{
                  flex: "1 1 auto",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Icon size={isMobile ? 50 : 80} color="#000000" />
              </Box>
            )
          )}
        </Box>
      </Box>

      {/* 🎮 Game Buttons Section */}
      <Box
        ref={scrollRef}
        sx={{
          backgroundColor: "#ffffff",
          py: 10,
          px: 3,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {scrollBalloons.map((balloon) => (
          <Box
            key={balloon.id}
            sx={{
              width: "60px",
              height: "80px",
              borderRadius: "50% 50% 40% 40%",
              backgroundColor: balloon.color,
              position: "absolute",
              bottom: 0,
              left: balloon.left,
              animation: `floatUpOnce 4.5s ease-out forwards`,
              opacity: 0.9,
              zIndex: 0,
            }}
          />
        ))}

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: "bold", color: "#444" }}
          >
            Choose a game 🎮
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 3,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            {gameButtons.map((btn, i) => (
              <Box key={i} sx={{ aspectRatio: "3 / 1", width: "100%" }}>
                <GameButton {...btn} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 🎈 Animation Keyframe */}
      <style>
        {`
          @keyframes floatUpOnce {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.9;
            }
            100% {
              transform: translateY(-180vh) scale(0.8);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
}
