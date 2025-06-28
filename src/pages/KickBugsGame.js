import React, { useState, useEffect, useRef } from "react";

export default function KickBugsGame() {
  const [bugs, setBugs] = useState([]);
  const [coffee, setCoffee] = useState(null);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const playerX = 60; // fixed x-position

  const containerWidth = 800;
  const containerHeight = 400;

  const startGame = () => {
    setBugs([]);
    setCoffee(null);
    setScore(0);
    setGameOver(false);
    setIsGameRunning(true);
  };

  const moveEntities = useRef();
  const lastTimeRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === "Space" && isGameRunning && !gameOver) {
        kick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameRunning, gameOver]);

  const kick = () => {
    // kick animation placeholder
    setBugs(prev => prev.filter(b => {
      const inRange = Math.abs(b.x - playerX) < 50 && b.y > containerHeight - 100;
      if (inRange) {
        setScore(s => s + 1);
        return false;
      }
      return true;
    }));
  };

  useEffect(() => {
    if (!isGameRunning) return;
    lastTimeRef.current = performance.now();

    const gameLoop = time => {
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      setBugs(prev =>
        prev
          .map(b => ({ ...b, x: b.x - dt * 0.05 * (1 + score * 0.01) }))
          .filter(b => {
            const crashed = b.x < playerX + 20 && b.x > playerX - 20 && b.y > containerHeight - 100;
            if (crashed) setGameOver(true);
            return b.x > -20;
          })
      );

      if (coffee) {
        setCoffee(c => ({ ...c, x: c.x - dt * 0.05 }));
        if (coffee.x < playerX + 20 && coffee.x > playerX - 20 && coffee.y > containerHeight - 150) {
          setScore(s => s + 3);
          setCoffee(null);
        }
      }

      if (Math.random() < dt * 0.001) {
        setBugs(prev => [...prev, { x: containerWidth, y: containerHeight - 40 }]);
      }

      if (!coffee && Math.random() < dt * 0.0003) {
        setCoffee({ x: containerWidth, y: containerHeight - 120 });
      }

      if (!gameOver) moveEntities.current = requestAnimationFrame(gameLoop);
      else setIsGameRunning(false);
    };

    moveEntities.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(moveEntities.current);
  }, [isGameRunning, score, coffee, gameOver]);

  return (
    <div style={styles.container}>
      <h1>Kick the Bugs</h1>
      <p>Score: {score}</p>
      {!isGameRunning && <button onClick={startGame} style={styles.startBtn}>Start</button>}
      <div style={{ ...styles.gameArea, width: containerWidth, height: containerHeight }}>
        {/* Player */}
        <div style={{ ...styles.player, bottom: 0, left: playerX }} />

        {/* Bugs */}
        {bugs.map((b, i) => (
          <div key={i} style={{ ...styles.bug, left: b.x, top: b.y }} />
        ))}

        {/* Coffee */}
        {coffee && <div style={{ ...styles.coffee, left: coffee.x, top: coffee.y }}>☕</div>}

        {/* Game Over */}
        {gameOver && <div style={styles.gameOver}>Game Over!</div>}
      </div>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", fontFamily: "sans-serif", padding: 20 },
  startBtn: { padding: "10px 20px", fontSize: 18, margin: 10 },
  gameArea: { position: "relative", border: "2px solid #333", background: "#eef", margin: "0 auto", overflow: "hidden" },
  player: { position: "absolute", width: 40, height: 80, background: "#000" },
  bug: { position: "absolute", width: 30, height: 30, background: "green", borderRadius: "50%" },
  coffee: { position: "absolute", width: 30, height: 30, fontSize: 24 },
  gameOver: { position: "absolute", top: "40%", width: "100%", fontSize: 32, color: "red" }
};
