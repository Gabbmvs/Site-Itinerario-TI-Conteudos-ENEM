const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const livesEl = document.getElementById("lives");
const startOverlay = document.getElementById("startOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreEl = document.getElementById("finalScore");
const rankingList = document.getElementById("rankingList");

let score = 0;
let level = 1;
let lives = 3;
let gameRunning = false;
let animationId;

const keys = {};

const player = {
  width: 46,
  height: 20,
  x: canvas.width / 2 - 23,
  y: canvas.height - 38,
  speed: 6,
};

let bullets = [];
let enemyBullets = [];
let enemies = [];
let enemyDirection = 1;
let enemySpeed = 1.2;
let lastShotTime = 0;

// Carrega ranking do backend Python
async function carregarRanking() {
  try {
    const res = await fetch("/api/ranking");
    const data = await res.json();
    rankingList.innerHTML = "";

    if (data.length === 0) {
      rankingList.innerHTML = "<li>Nenhum recorde ainda!</li>";
      return;
    }

    data.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `${item.nome} <span>${item.pontos} pts</span>`;
      rankingList.appendChild(li);
    });
  } catch (err) {
    rankingList.innerHTML = "<li>Erro ao carregar ranking.</li>";
  }
}

function criarInimigos() {
  enemies = [];
  const rows = Math.min(3 + Math.floor(level / 2), 5);
  const cols = 8;
  const padding = 14;
  const width = 42;
  const height = 24;
  const offsetX = 55;
  const offsetY = 45;

  const tipos = ["404", "BUG", "ERR", "NULL", "NaN"];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      enemies.push({
        x: offsetX + c * (width + padding),
        y: offsetY + r * (height + padding),
        width,
        height,
        label: tipos[r % tipos.length],
        color: r === 0 ? "#f43f5e" : r === 1 ? "#fb923c" : "#a855f7",
      });
    }
  }
}

function resetGame() {
  score = 0;
  level = 1;
  lives = 3;
  enemySpeed = 1.2;
  bullets = [];
  enemyBullets = [];
  player.x = canvas.width / 2 - player.width / 2;
  atualizarHUD();
  criarInimigos();
}

function atualizarHUD() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
  livesEl.textContent = lives;
}

function desenharNave() {
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(player.x, player.y + 8, player.width, player.height - 8);
  ctx.fillStyle = "#7dd3fc";
  ctx.fillRect(player.x + player.width / 2 - 5, player.y, 10, 10);
}

function desenharInimigos() {
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(enemy.label, enemy.x + enemy.width / 2, enemy.y + 16);
  });
}

function desenharTiros() {
  ctx.fillStyle = "#22c55e";
  bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.width, b.height));

  ctx.fillStyle = "#facc15";
  enemyBullets.forEach((b) => ctx.fillRect(b.x, b.y, b.width, b.height));
}

function colidiu(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function encerrarJogo() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
  finalScoreEl.textContent = score;
  gameOverOverlay.classList.remove("hidden");
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Movimento da nave
  if ((keys["ArrowLeft"] || keys["KeyA"]) && player.x > 10) {
    player.x -= player.speed;
  }
  if (
    (keys["ArrowRight"] || keys["KeyD"]) &&
    player.x + player.width < canvas.width - 10
  ) {
    player.x += player.speed;
  }

  // Disparo do jogador
  if (keys["Space"] && Date.now() - lastShotTime > 280) {
    bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y - 10,
      width: 4,
      height: 12,
      speed: 8,
    });
    lastShotTime = Date.now();
  }

  // Atualiza tiros do jogador
  bullets.forEach((b) => (b.y -= b.speed));
  bullets = bullets.filter((b) => b.y > -20);

  // Move inimigos
  let baterBorda = false;
  enemies.forEach((e) => {
    e.x += enemySpeed * enemyDirection;
    if (e.x + e.width >= canvas.width - 10 || e.x <= 10) {
      baterBorda = true;
    }
  });

  if (baterBorda) {
    enemyDirection *= -1;
    enemies.forEach((e) => (e.y += 18));
  }

  // Tiro aleatório dos inimigos
  if (enemies.length > 0 && Math.random() < 0.02 + level * 0.005) {
    const shooter = enemies[Math.floor(Math.random() * enemies.length)];
    enemyBullets.push({
      x: shooter.x + shooter.width / 2 - 2,
      y: shooter.y + shooter.height,
      width: 4,
      height: 10,
      speed: 4 + level * 0.4,
    });
  }

  enemyBullets.forEach((b) => (b.y += b.speed));
  enemyBullets = enemyBullets.filter((b) => b.y < canvas.height + 20);

  // Colisão tiro jogador vs inimigo
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (colidiu(bullets[i], enemies[j])) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score += 100;
        atualizarHUD();
        break;
      }
    }
  }

  // Colisão tiro inimigo vs jogador
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    if (colidiu(enemyBullets[i], player)) {
      enemyBullets.splice(i, 1);
      lives--;
      atualizarHUD();
      if (lives <= 0) {
        encerrarJogo();
        return;
      }
    }
  }

  // Verifica se inimigos chegaram embaixo
  if (enemies.some((e) => e.y + e.height >= player.y)) {
    encerrarJogo();
    return;
  }

  // Próxima fase
  if (enemies.length === 0) {
    level++;
    enemySpeed += 0.35;
    atualizarHUD();
    criarInimigos();
  }

  desenharNave();
  desenharInimigos();
  desenharTiros();

  animationId = requestAnimationFrame(update);
}

// Eventos de teclado
window.addEventListener("keydown", (e) => {
  if (["Space", "ArrowLeft", "ArrowRight"].includes(e.code)) {
    e.preventDefault();
  }
  keys[e.code] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// Botões de início e reinício
document.getElementById("startBtn").addEventListener("click", () => {
  startOverlay.classList.add("hidden");
  resetGame();
  gameRunning = true;
  update();
});

document.getElementById("restartBtn").addEventListener("click", () => {
  gameOverOverlay.classList.add("hidden");
  resetGame();
  gameRunning = true;
  update();
});

// Envio do recorde para o Python
document.getElementById("scoreForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("playerName").value.trim();
  if (!nome) return;

  await fetch("/api/ranking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, pontos: score }),
  });

  document.getElementById("playerName").value = "";
  await carregarRanking();
});

carregarRanking();