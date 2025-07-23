const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const scoreText = document.getElementById('score');

const jumpSound = new Audio('jump.mp3');
const gameOverSound = new Audio('gameover.mp3');

const monkeyImg = new Image();
monkeyImg.src = 'monkey.png';

const spikeImg = new Image();
spikeImg.src = 'spike.png';

let monkey, gravity, obstacles, score, highScore = 0, isJumping, gameInterval, gamePaused = false;
let spawnCooldown = 0;

function resetGame() {
  monkey = {
    x: 50,
    y: 250,
    width: 40,
    height: 40,
    dy: 0,
  };
  gravity = 0.5;
  isJumping = false;
  obstacles = [];
  score = 0;
  spawnCooldown = 0;
  scoreText.textContent = 'Score: 0';
}

function drawMonkey() {
  ctx.drawImage(monkeyImg, monkey.x, monkey.y, monkey.width, monkey.height);
}

function drawObstacles() {
  obstacles.forEach(ob => {
    ctx.drawImage(spikeImg, ob.x, ob.y, ob.width, ob.height);
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
    ob.x -= 4;

    if (
      monkey.x < ob.x + ob.width &&
      monkey.x + monkey.width > ob.x &&
      monkey.y < ob.y + ob.height &&
      monkey.y + monkey.height > ob.y
    ) {
      gameOverSound.play();
      clearInterval(gameInterval);
      alert(`Game Over!\nScore: ${score}\nHigh Score: ${highScore}`);
      return;
    }

    if (ob.x + ob.width < 0) {
      obstacles.splice(i, 1);
      score++;
      if (score > highScore) highScore = score;
      scoreText.textContent = `Score: ${score} | High Score: ${highScore}`;
    }
  });

  drawMonkey();
  drawObstacles();
}

function jump() {
  if (!isJumping) {
    monkey.dy = -13;
    isJumping = true;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
}

function spawnObstacle() {
  const height = Math.floor(Math.random() * 30) + 30;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: 30,
    height: height,
  });
  spawnCooldown = 100; // wait 100 frames (~1.6s)
}

function gameLoop() {
  if (!gamePaused) {
    update();
    if (spawnCooldown <= 0) {
      spawnObstacle();
    } else {
      spawnCooldown--;
    }
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
  } else if (e.code === 'KeyP') {
    gamePaused = !gamePaused;
  }
});

canvas.addEventListener('touchstart', jump);
