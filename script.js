// Select HTML elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-game");
const playerNameInput = document.getElementById("player-name");
const rankingBoard = document.getElementById("rankings");
const controls = {
  up: document.getElementById("up"),
  down: document.getElementById("down"),
  left: document.getElementById("left"),
  right: document.getElementById("right"),
};

// Game variables
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 100, y: 100 };
let score = 0;
let speed = 200; // Initial speed
let gameInterval;
let rankings = JSON.parse(localStorage.getItem("rankings")) || [];

// Draw the snake
function drawSnake() {
  snake.forEach((segment) => {
    ctx.fillStyle = "black"; // Snake is now black
    ctx.fillRect(segment.x, segment.y, 20, 20);
  });
}

// Move the snake
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    placeFood();
    if (score % 100 === 0) {
      speed -= 20; // Increase speed every 10 pieces of food
      clearInterval(gameInterval);
      gameInterval = setInterval(updateGame, speed);
    }
  } else {
    snake.pop();
  }
}

// Draw the food
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);
}

// Place food randomly
function placeFood() {
  food.x = Math.floor(Math.random() * 20) * 20;
  food.y = Math.floor(Math.random() * 20) * 20;
}

// Check for collisions
function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
  }
}

// Game over logic
function gameOver() {
  clearInterval(gameInterval);
  alert(`Game Over! Your score: ${score}`);
  saveScore();
  resetGame();
}

// Save score to the ranking board
function saveScore() {
  const playerName = playerNameInput.value || "Anonymous";
  rankings.push({ name: playerName, score });
  rankings.sort((a, b) => b.score - a.score);
  rankings = rankings.slice(0, 5); // Keep top 5 scores
  localStorage.setItem("rankings", JSON.stringify(rankings));
  displayRankings();
}

// Display the ranking board
function displayRankings() {
  rankingBoard.innerHTML = rankings
    .map((entry) => `<li>${entry.name}: ${entry.score}</li>`)
    .join("");
}

// Reset the game
function resetGame() {
  snake = [{ x: 200, y: 200 }];
  direction = { x: 0, y: 0 };
  score = 0;
  speed = 200;
  placeFood();
}

// Update the game
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  drawSnake();
  drawFood();
  checkCollision();
}

// Handle keyboard controls
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -20 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 20 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -20, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 20, y: 0 };
      break;
  }
});

// Handle on-screen controls
Object.keys(controls).forEach((key) => {
  controls[key].addEventListener("click", () => {
    switch (key) {
      case "up":
        if (direction.y === 0) direction = { x: 0, y: -20 };
        break;
      case "down":
        if (direction.y === 0) direction = { x: 0, y: 20 };
        break;
      case "left":
        if (direction.x === 0) direction = { x: -20, y: 0 };
        break;
      case "right":
        if (direction.x === 0) direction = { x: 20, y: 0 };
        break;
    }
  });
});

// Start the game
startButton.addEventListener("click", () => {
  resetGame();
  displayRankings();
  gameInterval = setInterval(updateGame, speed);
});
