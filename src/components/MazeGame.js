import React, { useEffect } from "react";
import "./MazeGame.css";

export default function MazeGame() {
  useEffect(() => {
    const rand = (max) => Math.floor(Math.random() * max);
    const shuffle = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    window.toggleVisablity = function (id) {
      const el = document.getElementById(id);
      el.style.visibility = el.style.visibility === "visible" ? "hidden" : "visible";
    };

    const displayVictoryMess = () => {
      window.toggleVisablity("Message-Container");
    };

    function Maze(width, height) {
      let mazeMap = [];
      let startCoord = { x: 0, y: 0 };
      let endCoord = { x: width - 1, y: height - 1 };
      const dirs = ["n", "s", "e", "w"];
      const modDir = {
        n: { y: -1, x: 0, o: "s" },
        s: { y: 1, x: 0, o: "n" },
        e: { y: 0, x: 1, o: "w" },
        w: { y: 0, x: -1, o: "e" },
      };

      for (let y = 0; y < height; y++) {
        mazeMap[y] = [];
        for (let x = 0; x < width; x++) {
          mazeMap[y][x] = { n: false, s: false, e: false, w: false, visited: false, priorPos: null };
        }
      }

      let isComplete = false;
      let cellsVisited = 1;
      let pos = { x: 0, y: 0 };
      const numCells = width * height;

      while (!isComplete) {
        let moveMade = false;
        mazeMap[pos.y][pos.x].visited = true;
        shuffle(dirs);

        for (let i = 0; i < dirs.length; i++) {
          const dir = dirs[i];
          const nx = pos.x + modDir[dir].x;
          const ny = pos.y + modDir[dir].y;

          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            if (!mazeMap[ny][nx].visited) {
              mazeMap[pos.y][pos.x][dir] = true;
              mazeMap[ny][nx][modDir[dir].o] = true;

              mazeMap[ny][nx].priorPos = pos;
              pos = { x: nx, y: ny };
              cellsVisited++;
              moveMade = true;
              break;
            }
          }
        }

        if (!moveMade) pos = mazeMap[pos.y][pos.x].priorPos;
        if (cellsVisited === numCells) isComplete = true;
      }

      this.map = () => mazeMap;
      this.startCoord = () => startCoord;
      this.endCoord = () => endCoord;
    }

    function DrawMaze(maze, ctx, cellSize) {
      const map = maze.map();

      function drawCell(x, y, cell) {
        const px = x * cellSize;
        const py = y * cellSize;

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        if (!cell.n) {
          ctx.moveTo(px, py);
          ctx.lineTo(px + cellSize, py);
        }
        if (!cell.s) {
          ctx.moveTo(px, py + cellSize);
          ctx.lineTo(px + cellSize, py + cellSize);
        }
        if (!cell.e) {
          ctx.moveTo(px + cellSize, py);
          ctx.lineTo(px + cellSize, py + cellSize);
        }
        if (!cell.w) {
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + cellSize);
        }
        ctx.stroke();
      }

      for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
          drawCell(x, y, map[y][x]);
        }
      }

      // Coffee emoji at the end
      const end = maze.endCoord();
      ctx.font = `${cellSize * 0.8}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("☕️", end.x * cellSize + cellSize / 2, end.y * cellSize + cellSize / 2);
    }

    function Player(maze, canvas, cellSize, onComplete) {
      const ctx = canvas.getContext("2d");
      const map = maze.map();
      let pos = maze.startCoord();
      let finished = false;

      function draw() {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(pos.x * cellSize + cellSize / 2, pos.y * cellSize + cellSize / 2, cellSize / 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        new DrawMaze(maze, ctx, cellSize);
      }

      function move(dx, dy) {
        if (finished) return;

        const dir = dx === -1 ? "w" : dx === 1 ? "e" : dy === -1 ? "n" : "s";
        if (map[pos.y][pos.x][dir]) {
          pos = { x: pos.x + dx, y: pos.y + dy };
          clear();
          draw();
          if (pos.x === maze.endCoord().x && pos.y === maze.endCoord().y) {
            finished = true;
            onComplete();
          }
        }
      }

      const moveHandler = (e) => {
        if (e.key === "ArrowUp") move(0, -1);
        if (e.key === "ArrowDown") move(0, 1);
        if (e.key === "ArrowLeft") move(-1, 0);
        if (e.key === "ArrowRight") move(1, 0);
      };

      window.addEventListener("keydown", moveHandler);
      window.movePlayer = move;

      draw();
    }

    window.makeMaze = function () {
      const difficulty = parseInt(document.getElementById("diffSelect").value);
      const canvas = document.getElementById("mazeCanvas");
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maze = new Maze(difficulty, difficulty);
      new DrawMaze(maze, ctx, canvas.width / difficulty);
      new Player(maze, canvas, canvas.width / difficulty, displayVictoryMess);
      document.getElementById("mazeContainer").style.opacity = "100";
    };
  }, []);

  return (
    <div className="maze-wrapper">
      <div id="page">
        <div id="Message-Container">
          <div id="message">
            <h1>Congratsss!</h1>
            <p>You got the Coffee!!<br />
            (Now go make a cup for me :) </p>
            <input
              id="okBtn"
              type="button"
              onClick={() => window.toggleVisablity("Message-Container")}
              value="BACK"
            />
          </div>
        </div>

        <div id="menu">
          <select id="diffSelect">
            <option value="10">Easy</option>
            <option value="15">Medium</option>
            <option value="25">Hard</option>
          </select>
          <input id="startMazeBtn" type="button" onClick={() => window.makeMaze()} value="Start" />
        </div>

        <div id="view">
          <div id="mazeContainer">
            <canvas id="mazeCanvas" className="border" height="500" width="500"></canvas>
          </div>
        </div>

        <p id="instructions">Use arrows to reach the coffee!</p>

        <div className="mobile-controls">
          <div className="arrow-row">
            <button onClick={() => window.movePlayer(0, -1)}>⬆️</button>
          </div>
          <div className="arrow-row">
            <button onClick={() => window.movePlayer(-1, 0)}>⬅️</button>
            <button onClick={() => window.movePlayer(0, 1)}>⬇️</button>
            <button onClick={() => window.movePlayer(1, 0)}>➡️</button>
          </div>
        </div>
      </div>
    </div>
  );
}
