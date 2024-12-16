// Select HTML elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const leaderboardElement = document.getElementById("leaderboard");
const playerNameInput = document.getElementById("playerName");
const startGameButton = document.getElementById("startGame");

document.getElementById("up").addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: -gridSize };
});
document.getElementById("down").addEventListener("click", () => {
    if (direction.y === 0) direction = { x: 0, y: gridSize };
});
document.getElementById("left").addEventListener("click", () => {
    if (direction.x === 0) direction = { x: -gridSize, y: 0 };
});
document.getElementById("right").addEventListener("click", () => {
    if (direction.x === 0) direction = { x: gridSize, y: 0 };
});

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
            e.preventDefault(); // Prevent page scroll
            break;
    }
    // Movement logic
});

const gridSize = 20; // Size of each grid square
let snake = [{ x: 100, y: 100 }];
let direction = { x: gridSize, y: 0 };
let food = { x: 200, y: 200, type: "green" };
let score = 0;
let speed = 300;
let interval;
let highScores = [];
let playerName = "";

// Food colors and point values
const foodTypes = {
    green: { color: "green", points: 5 },
    blue: { color: "blue", points: 10 },
    yellow: { color: "yellow", points: 20 },
};

// Start game only after the name is input
startGameButton.addEventListener("click", () => {
    const nameInput = playerNameInput.value.trim();
    if (nameInput) {
        playerName = nameInput;
        startGame();
    } else {
        alert("Please enter your name to start the game.");
    }
});

function startGame() {
    score = 0;
    snake = [{ x: 100, y: 100 }];
    direction = { x: gridSize, y: 0 };
    generateFood();
    updateScore();
    clearInterval(interval);
    interval = setInterval(update, speed);
}

function update() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (checkFoodCollision()) {
        eatFood();
    }
    drawGame();
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (!checkFoodCollision()) {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

function eatFood() {
    score += foodTypes[food.type].points;
    updateScore();
    generateFood();
    increaseSpeed();
}

function generateFood() {
    const foodTypesArray = ["green", "green", "blue", "yellow"];
    const type = foodTypesArray[Math.floor(Math.random() * foodTypesArray.length)];
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
        type: type,
    };
    if (type === "yellow") {
        setTimeout(() => {
            if (food.type === "yellow") {
                generateFood();
            }
        }, 4000);
    }
}

function increaseSpeed() {
    if (score % 30 === 0 && speed > 100) {
        speed -= 50;
        clearInterval(interval);
        interval = setInterval(update, speed);
    }
}

function updateScore() {
    scoreDisplay.textContent = score;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach(segment => {
        ctx.fillStyle = "black";
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
    ctx.fillStyle = foodTypes[food.type].color;
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function endGame() {
    clearInterval(interval);
    saveScore();
    alert("Game Over! Your Score: " + score);
}

function saveScore() {
    highScores.push({ name: playerName, score: score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);
    updateLeaderboard();
}

function updateLeaderboard() {
    leaderboardElement.innerHTML = "";
    highScores.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardElement.appendChild(li);
    });
}
function saveLeaderboard() {
    localStorage.setItem("leaderboard", JSON.stringify(highScores));
}
function loadLeaderboard() {
    const savedScores = localStorage.getItem("leaderboard");
    if (savedScores) {
        highScores = JSON.parse(savedScores);
        updateLeaderboard();
    }
}
function saveScore() {
    highScores.push({ name: playerName, score: score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);
    saveLeaderboard(); // Persist the leaderboard
    updateLeaderboard();
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});