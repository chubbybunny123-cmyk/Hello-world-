const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreText = document.getElementById('score');
const jumpSound = document.getElementById('jumpSound');

let monkeyImg = new Image();
monkeyImg.src = 'monkey.png';

let monkey, gravity, obstacles, score, isJumping, gameInterval;

function resetGame() {
  monkey = {
    x: 50,
    y: 250,
    width: 40,
    height: 40,
    dy: 0,
  };
  gravity = 0.5;                // slightly lighter gravity
  isJumping = false;
  obstacles = [];
  score = 0;
  scoreText.textContent = 'Score: 0';
}

function drawMonkey() {
  ctx.drawImage(monkeyImg, monkey.x, monkey.y, monkey.width, monkey.height);
}

function drawObstacle(ob) {
  // Draw triangle-like tree spikes
  ctx.fillStyle = '#3b3b3b';
  ctx.beginPath();
  ctx.moveTo(ob.x, ob.y + ob.height); // bottom left
  ctx.lineTo(ob.x + ob.width / 2, ob.y); // top center
  ctx.lineTo(ob.x + ob.width, ob.y + ob.height); // bottom right
  ctx.closePath();
  ctx.fill();
}

function drawObstacles() {
  obstacles.forEach(drawObstacle);
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
    ob.x -= 4;

    // Collision (use bounding box approx for triangle)
    if (
      monkey.x < ob.x + ob.width &&
      monkey.x + monkey.width > ob.x &&
      monkey.y < ob.y + ob.height &&
      monkey.y + monkey.height > ob.y
    ) {
      clearInterval(gameInterval);
      alert('Game Over! Final Score: ' + score);
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
    monkey.dy = -13; // ⬆️ Higher jump
    isJumping = true;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}

function spawnObstacle() {
  const height = Math.floor(Math.random() * 30) + 20; // ⬇️ Smaller spikes
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: 30,
    height: height,
  });
}

function gameLoop() {
  update();
  if (Math.random() < 0.02) {
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

canvas.addEventListener('touchstart', () => {
  jump();
});
