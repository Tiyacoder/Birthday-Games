import React, { useState, useEffect, useRef } from "react";

export default function StickJumpGame() {
  const [isJumping, setIsJumping] = useState(false);
  const [canJump, setCanJump] = useState(true);
  const [obstacleLeft, setObstacleLeft] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [collisionEnabled, setCollisionEnabled] = useState(true);
  const [currentWord, setCurrentWord] = useState("chores");

  const obstacleWords = [
    "chores", "exams", "stress", "viva", "bugs",
    "drama", "errors", "work", "lab report", "internship", "anxiety"
  ];

  const baseObstacleSpeed = 0.5;
  const animationRef = useRef();
  const gameStartTimeRef = useRef(null);

  const handleJump = () => {
    if (canJump && isGameRunning && !gameOver) {
      setIsJumping(true);
      setCanJump(false);
      setCollisionEnabled(false);

      setTimeout(() => {
        setIsJumping(false);
        setCollisionEnabled(true);
        setCanJump(true);
      }, 700); // 👈 Shorter jump time
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canJump, isGameRunning, gameOver]);

  useEffect(() => {
    if (!isGameRunning || gameOver) return;

    gameStartTimeRef.current = Date.now();

    const moveObstacle = () => {
      const elapsed = (Date.now() - gameStartTimeRef.current) / 1000;
      const currentSpeed = baseObstacleSpeed + elapsed * 0.02;

      setObstacleLeft((prev) => {
        if (prev <= -10) {
          const nextWord = obstacleWords[Math.floor(Math.random() * obstacleWords.length)];
          setCurrentWord(nextWord);
          return 100;
        }
        return prev - currentSpeed;
      });

      animationRef.current = requestAnimationFrame(moveObstacle);
    };

    animationRef.current = requestAnimationFrame(moveObstacle);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isGameRunning, gameOver]);

  useEffect(() => {
    if (!isGameRunning || gameOver || !collisionEnabled) return;

    const playerLeft = 60;
    const playerRight = playerLeft + 40;
    const containerWidth = window.innerWidth * 0.95;
    const obstacleWidth = 40;
    const obstacleLeftPx = (obstacleLeft / 100) * containerWidth;
    const obstacleRightPx = obstacleLeftPx + obstacleWidth;

    const playerBottomPx = isJumping ? 180 : 12;
    const obstacleBottomPx = 12;

    const isOverlap =
      obstacleRightPx > playerLeft && obstacleLeftPx < playerRight;
    const isOnGround = playerBottomPx <= obstacleBottomPx + 5;

    if (isOverlap && isOnGround) {
      setGameOver(true);
      setIsGameRunning(false);
    }
  }, [obstacleLeft, isJumping, isGameRunning, gameOver, collisionEnabled]);

  const playerBottom = isJumping ? 180 : 12;

  const startGame = () => {
    setGameOver(false);
    setIsGameRunning(true);
    setObstacleLeft(100);
    setIsJumping(false);
    setCollisionEnabled(true);
    setCanJump(true);
    const firstWord = obstacleWords[Math.floor(Math.random() * obstacleWords.length)];
    setCurrentWord(firstWord);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#D0E6FF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        userSelect: "none",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: "#000" }}>
          DODGE THE RESPONSIBILITIES
        </h1>
        <p style={{ margin: 0, fontSize: 16, color: "#333" }}>
          Press spacebar or tap jump to avoid!
        </p>
      </div>

      {!isGameRunning && (
        <button
          onClick={startGame}
          style={{
            padding: "12px 28px",
            fontSize: 18,
            cursor: "pointer",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#1976D2",
            color: "#fff",
            fontWeight: "bold",
            marginBottom: 40,
          }}
        >
          START
        </button>
      )}

      <div
        style={{
          position: "relative",
          width: "95vw",
          height: "60vh",
          border: "3px solid #333",
          borderRadius: 12,
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Ground */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 12,
            backgroundColor: "#444",
          }}
        />

        {/* Stick Figure */}
        <div
          style={{
            position: "absolute",
            bottom: playerBottom,
            left: 60,
            width: 40,
            height: 100,
            transition: "bottom 0.3s ease",
          }}
        >
          <svg
            width="40"
            height="100"
            viewBox="0 0 40 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="15" r="12" stroke="black" strokeWidth="3" fill="none" />
            <line x1="20" y1="27" x2="20" y2="70" stroke="black" strokeWidth="3" />
            <line x1="5" y1="45" x2="35" y2="45" stroke="black" strokeWidth="3" />
            <line x1="20" y1="70" x2="5" y2="95" stroke="black" strokeWidth="3" />
            <line x1="20" y1="70" x2="35" y2="95" stroke="black" strokeWidth="3" />
          </svg>
        </div>

        {/* Obstacle */}
        {isGameRunning && !gameOver && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: `${obstacleLeft}%`,
              width: 40,
              height: 70,
              backgroundColor: "#ff4d4f",
              borderRadius: 6,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 12,
              textAlign: "center",
              padding: "0 2px",
            }}
          >
            {currentWord}
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              width: "100%",
              textAlign: "center",
              transform: "translateY(-50%)",
              fontSize: 28,
              fontWeight: "bold",
              color: "red",
              userSelect: "none",
            }}
          >
            Couldn't escape the responsibilities! Press Start to try again.
          </div>
        )}
      </div>

      {/* Mobile Jump Button */}
      <button
        onClick={handleJump}
        style={{
          marginTop: 30,
          padding: "12px 28px",
          fontSize: 18,
          cursor: "pointer",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#388E3C",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        JUMP ⬆️
      </button>
    </div>
  );
}
