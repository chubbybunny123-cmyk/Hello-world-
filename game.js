const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreText = document.getElementById('score');

let monkey, gravity, obstacles, score, isJumping, gameInterval;

function resetGame() {
  monkey = {
    x: 50,
    y: 250,
    width: 40,
    height: 40,
    dy: 0,
  };
  gravity = 0.7;
  isJumping = false;
  obstacles = [];
  score = 0;
  scoreText.textContent = 'Score: 0';
}

function drawMonkey() {
  ctx.fillStyle = '#8b5cf6'; // purple monkey
  ctx.fillRect(monkey.x, monkey.y, monkey.width, monkey.height);
}

function drawObstacles() {
  ctx.fillStyle = '#dc2626'; // red obstacle
  obstacles.forEach((ob) => {
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
  });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  monkey.dy += gravity;
  monkey.y += monkey.dy;

  if (monkey.y + monkey.height > canvas.height) {
    monkey.y = canvas.height - monkey.height;
    monkey.dy = 0;
    isJumping = false;
  }

  obstacles.forEach((ob, i) => {
    ob.x -= 3;

    // Collision detection
    if (
      monkey.x < ob.x + ob.width &&
      monkey.x + monkey.width > ob.x &&
      monkey.y < ob.y + ob.height &&
      monkey.y + monkey.height > ob.y
    ) {
      clearInterval(gameInterval);
      alert('Game Over! Score: ' + score);
    }

    if (ob.x + ob.width < 0) {
      obstacles.splice(i, 1);
      score++;
      scoreText.textContent = 'Score: ' + score;
    }
  });

  drawMonkey();
  drawObstacles();
}

function jump() {
  if (!isJumping) {
    monkey.dy = -12;
    isJumping = true;
  }
}

function spawnObstacle() {
  const height = Math.floor(Math.random() * 80) + 30;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: 30,
    height: height,
  });
}

function gameLoop() {
  update();
  if (Math.random() < 0.03) {
    spawnObstacle();
  }
}

startBtn.addEventListener('click', () => {
  resetGame();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 1000 / 60);
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});
