function rand(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toggleVisablity(id) {
  const el = document.getElementById(id);
  el.style.visibility = el.style.visibility === "visible" ? "hidden" : "visible";
}

function displayVictoryMess() {
  toggleVisablity("Message-Container");
}

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

      if (ny >= 0 && ny < height && nx >= 0 && nx < width && !mazeMap[ny][nx].visited) {
        mazeMap[pos.y][pos.x][dir] = true;
        mazeMap[ny][nx][modDir[dir].o] = true;
        mazeMap[ny][nx].priorPos = pos;
        pos = { x: nx, y: ny };
        cellsVisited++;
        moveMade = true;
        break;
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

    if (!cell.n) ctx.moveTo(px, py), ctx.lineTo(px + cellSize, py);
    if (!cell.s) ctx.moveTo(px, py + cellSize), ctx.lineTo(px + cellSize, py + cellSize);
    if (!cell.e) ctx.moveTo(px + cellSize, py), ctx.lineTo(px + cellSize, py + cellSize);
    if (!cell.w) ctx.moveTo(px, py), ctx.lineTo(px, py + cellSize);

    ctx.stroke();
  }

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      drawCell(x, y, map[y][x]);
    }
  }

  const end = maze.endCoord();
  ctx.fillStyle = "red";
  ctx.fillRect(end.x * cellSize + 10, end.y * cellSize + 10, cellSize - 20, cellSize - 20);
}

function Player(maze, canvas, cellSize, onComplete) {
  const ctx = canvas.getContext("2d");
  const map = maze.map();
  let pos = maze.startCoord();

  function draw() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(pos.x * cellSize + cellSize / 2, pos.y * cellSize + cellSize / 2, cellSize / 3, 0, 2 * Math.PI);
    ctx.fill();
    checkVictory();
  }

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    new DrawMaze(maze, ctx, cellSize);
  }

  function move(dx, dy) {
    const dir = dx === -1 ? "w" : dx === 1 ? "e" : dy === -1 ? "n" : "s";
    if (map[pos.y][pos.x][dir]) {
      pos = { x: pos.x + dx, y: pos.y + dy };
      clear();
      draw();
    }
  }

  function checkVictory() {
    const end = maze.endCoord();
    if (pos.x === end.x && pos.y === end.y) {
      onComplete();
      window.removeEventListener("keydown", handleKeyDown);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowUp") move(0, -1);
    if (e.key === "ArrowDown") move(0, 1);
    if (e.key === "ArrowLeft") move(-1, 0);
    if (e.key === "ArrowRight") move(1, 0);
  }

  window.addEventListener("keydown", handleKeyDown);
  draw();
}

function makeMaze() {
  const difficulty = parseInt(document.getElementById("diffSelect").value);
  const canvas = document.getElementById("mazeCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const maze = new Maze(difficulty, difficulty);
  new DrawMaze(maze, ctx, canvas.width / difficulty);
  new Player(maze, canvas, canvas.width / difficulty, displayVictoryMess);
  document.getElementById("mazeContainer").style.opacity = "100";
}

window.makeMaze = makeMaze;
window.toggleVisablity = toggleVisablity;
