const CANVAS_BORDER = "black";
const CANVAS_BACKGROUND = "lightgray";
const SNAKE_SQUARES = "pink";
const SNAKE_SQUARES_BORDER = "gray";

let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

let score = 0;
let changing_direction = false;
let food_x;
let food_y;
let dx = 10;
let dy = 0;

const snakeBoard = document.getElementById("board");
const snakeBoardContext = snakeBoard.getContext("2d");

let startButton = document.getElementById('start-game');
let resetButton = document.getElementById('reset');
let scoreDiv = document.getElementById('score');

startButton.addEventListener('click', hideshow, false);
resetButton.addEventListener('click', hideshow, false);

function hideshow() {
  startButton.style.display = 'none';
  resetButton.style.display = 'block';
  scoreDiv.style.display = 'block';
}   

document.addEventListener("keydown", changeDirection);

function startGame() {
  if (isGameOver()) {
    alert('Game Over');
    window.location.reload();
    return;
  }
  changing_direction = false;
  setTimeout(function onTick() {
    resetGame();
    genetareFood();
    moveSnake();
    generateSnake();
    startGame();
  }, 50);
}

function resetGame() {
  snakeBoardContext.fillStyle = CANVAS_BACKGROUND;
  snakeBoardContext.strokestyle = CANVAS_BORDER;
  snakeBoardContext.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
  snakeBoardContext.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
}

function generateSnake() {
  snake.forEach(generateSnakePart);
}

function genetareFood() {
  snakeBoardContext.fillStyle = "red";
  snakeBoardContext.strokestyle = "gray";
  snakeBoardContext.fillRect(food_x, food_y, 10, 10);
  snakeBoardContext.strokeRect(food_x, food_y, 10, 10);
}

function generateSnakePart(snakePart) {
  snakeBoardContext.fillStyle = SNAKE_SQUARES;
  snakeBoardContext.strokestyle = SNAKE_SQUARES_BORDER;
  snakeBoardContext.fillRect(snakePart.x, snakePart.y, 10, 10);
  snakeBoardContext.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function isGameOver() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeBoard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeBoard.height - 10;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function randomFood(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function generateFood() {
  food_x = randomFood(0, snakeBoard.width - 10);
  food_y = randomFood(0, snakeBoard.height - 10);
  snake.forEach(function has_snake_eaten_food(part) {
    const snakeEated = part.x == food_x && part.y == food_y;
    if (snakeEated) generateFood();
  });
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  if (changing_direction) return;
  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function moveSnake() {
  const snakeHead = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(snakeHead);
  const eatedFood = snake[0].x === food_x && snake[0].y === food_y;
  if (eatedFood) {
    score += 10;
    document.getElementById("score").innerHTML = score;
    generateFood();
  } else {
    snake.pop();
  }
}
