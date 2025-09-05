// --- positionInGame --- //

// ====== AABB collision (global) ======
function aabb(a, b) {
  return (
    Math.abs(a.x - b.x) * 2 < (a.w + b.w) &&
    Math.abs(a.y - b.y) * 2 < (a.h + b.h)
  );
}


function InGamePosition(settings, level) {
  this.settings  = settings;
  this.level     = level;
  this.object    = null;
  this.spaceship = null;
  this.speed     = 6; // tốc độ di chuyển khi giữ phím

  this.bullets = [];
this.fireDelay = 10;   // số frame giữa 2 viên (≈ 10/60s)
this.fireCooldown = 0; // đếm ngược

this.enemies = [];
this.bombs = [];
this.spawnDelay = 90;        // ~1.5s sinh 1 đợt địch
this.spawnCooldown = 60;      // chờ một chút rồi bắt đầu sinh
this.time = 0;                // tick đếm frame (dùng cho chuyển động)


}

InGamePosition.prototype.entry = function (play) {
  // tạo tàu
  this.spaceship_image = new Image();
  this.object = new Objects();
  // đặt ở giữa, sát đáy vùng chơi (vẽ căn giữa nên y = bottom - h/2)
  const startX = play.width / 2;
  const startY = play.playBoundaries.bottom - 80 / 2; // 80 là chiều cao tàu mặc định
  this.spaceship = this.object.spaceship(startX, startY, this.spaceship_image);
  // tạo enemy 
  this.enemy_image = new Image();
  this.enemy_image.src = "images/enemy.png"; // đúng đường dẫn file

};

InGamePosition.prototype.update = function (play) {
  if (!this.spaceship) return;

  const keys = play.pressedKeys || {};
  let dx = 0, dy = 0;

  // Hỗ trợ cả Arrow và WASD
  if (keys["ArrowLeft"]  || keys["KeyA"]) dx -= 1;
  if (keys["ArrowRight"] || keys["KeyD"]) dx += 1;
  if (keys["ArrowUp"]    || keys["KeyW"]) dy -= 1;
  if (keys["ArrowDown"]  || keys["KeyS"]) dy += 1;

  // Nếu đi chéo, chuẩn hóa tốc độ để không nhanh hơn
  if (dx !== 0 && dy !== 0) {
    const inv = 1 / Math.sqrt(2);
    dx *= inv;
    dy *= inv;
  }

  // Cập nhật vị trí
  this.spaceship.x += dx * this.speed;
  this.spaceship.y += dy * this.speed;

  // Giới hạn trong biên (vẽ căn giữa)
  const halfW = this.spaceship.width  / 2;
  const halfH = this.spaceship.height / 2;

  const minX = play.playBoundaries.left   + halfW;
  const maxX = play.playBoundaries.right  - halfW;
  const minY = play.playBoundaries.top    + halfH;
  const maxY = play.playBoundaries.bottom - halfH;

  if (this.spaceship.x < minX) this.spaceship.x = minX;
  if (this.spaceship.x > maxX) this.spaceship.x = maxX;
  if (this.spaceship.y < minY) this.spaceship.y = minY;
  if (this.spaceship.y > maxY) this.spaceship.y = maxY;

  // Cooldown bắn
if (this.fireCooldown > 0) this.fireCooldown--;

// Cập nhật đạn: bay lên & lọc đạn ra ngoài màn
const topLimit = play.playBoundaries.top;
for (let i = 0; i < this.bullets.length; i++) {
  this.bullets[i].y -= this.bullets[i].speed;
}
// giữ lại những viên còn trong màn
this.bullets = this.bullets.filter(b => b.y + b.h >= topLimit);

// ======= ENEMY SPAWN (formation theo HÀNG) =======
this.time++;
if (this.spawnCooldown > 0) this.spawnCooldown--;

if (this.spawnCooldown <= 0) {
  const left  = play.playBoundaries.left;
  const right = play.playBoundaries.right;
  const top   = play.playBoundaries.top;

  // Hàng nằm gần đỉnh, ngẫu nhiên trong 50px
  const rowY = top + 30 + Math.random() * 50;

  // Số enemy trong 1 hàng: 5–8 ngẫu nhiên
  const count = 5 + Math.floor(Math.random() * 4);

  // khoảng cách giữa 2 enemy trong hàng (>= bề rộng enemy để không chồng)
  const spacing = 100; // có thể chỉnh 90–110

  // Tính X bắt đầu sao cho cả hàng nằm trong biên
  const rowWidth = (count - 1) * spacing;
  const minStartX = left + 60;
  const maxStartX = right - 60 - rowWidth;
  const startX = Math.max(minStartX, Math.min(maxStartX,
                  minStartX + Math.random() * Math.max(1, maxStartX - minStartX)));

  // Tốc độ ngang mỗi con (2–4 px/frame), hướng ngẫu nhiên
  const baseSpeedX = 2 + Math.random() * 2;
  const dir = Math.random() < 0.5 ? -1 : 1;

  // Tạo nguyên 1 hàng
  for (let i = 0; i < count; i++) {
    const x = startX + i * spacing;
    const y = rowY;
    const speedX = baseSpeedX;
    const speedY = 0.2 + Math.random() * 0.4; // trôi dọc nhẹ
    const e = this.object.enemy(x, y, speedX, speedY);
    e.dir = dir; // tất cả cùng hướng lúc đầu
    e.w = 90; e.h = 90; // đúng với kích thước enemy.png
    this.enemies.push(e);
  }

  // Hồi cooldown sinh đợt kế (ngẫu nhiên 2–3.5 giây)
  this.spawnCooldown = 120 + Math.floor(Math.random() * 90);
}


// ======= ENEMY MOVE + DROP =======
const left  = play.playBoundaries.left;
const right = play.playBoundaries.right;
const bottom = play.playBoundaries.bottom;

for (let e of this.enemies) {
  // bay ngang, chạm biên đổi hướng
  e.x += e.speedX * e.dir;
  if (e.x - e.w / 2 < left)  { e.x = left  + e.w / 2; e.dir = 1;  }
  if (e.x + e.w / 2 > right) { e.x = right - e.w / 2; e.dir = -1; }

  // trôi dọc nhẹ, thêm sóng sin cho mượt
  e.y += e.speedY;
  e.y += Math.sin((this.time + e.x) * 0.02) * 0.4;

  // cooldown ném bom
  if (e.dropCooldown > 0) e.dropCooldown--;
  if (e.dropCooldown <= 0) {
    this.bombs.push(this.object.bomb(e.x, e.y + e.h / 2));
    e.dropCooldown = Math.floor(60 + Math.random() * 90); // đặt lại
  }
}

// loại địch tụt ra khỏi đáy
this.enemies = this.enemies.filter(e => e.y - e.h / 2 < bottom);

// ======= BOMB UPDATE =======
for (let b of this.bombs) {
  b.y += b.speed;
}
// loại bom rơi ra ngoài đáy
this.bombs = this.bombs.filter(b => b.y - b.h < bottom);

// ======= COLLISIONS: bullets vs enemies =======
outer:
for (let i = 0; i < this.bullets.length; i++) {
  const bullet = {
    x: this.bullets[i].x,
    y: this.bullets[i].y - this.bullets[i].h / 2,
    w: this.bullets[i].w, h: this.bullets[i].h
  };
  for (let j = 0; j < this.enemies.length; j++) {
    const enemy = {
      x: this.enemies[j].x,
      y: this.enemies[j].y,
      w: this.enemies[j].w, h: this.enemies[j].h
    };
    if (aabb(bullet, enemy)) {
      // trúng: xóa viên đạn & 1 kẻ địch
      this.bullets.splice(i, 1);
      this.enemies.splice(j, 1);
      // có thể play.score++; ở đây nếu muốn
      break outer;
    }
  }
}

// ======= COLLISIONS: bombs vs spaceship (đơn giản) =======
const shipBox = {
  x: this.spaceship.x,
  y: this.spaceship.y,
  w: this.spaceship.width,
  h: this.spaceship.height
};
for (let k = 0; k < this.bombs.length; k++) {
  const bb = { x: this.bombs[k].x, y: this.bombs[k].y, w: this.bombs[k].w, h: this.bombs[k].h };
  if (aabb(bb, shipBox)) {
    // TODO: trừ máu/shield, hiệu ứng nổ...
    // tạm thời chỉ xóa bom để demo
    this.bombs.splice(k, 1);
    k--;
  }
}

};


InGamePosition.prototype.keyDown = function (play, keyboardCode) {
  if (!this.spaceship) return;

  if (keyboardCode === "Space" || keyboardCode === "Spacebar") {
    console.log("FIRE pressed, cooldown =", this.fireCooldown);
    if (this.fireCooldown <= 0) {
      // tạo đạn ở đỉnh mũi tàu (vẽ căn giữa)
      const bx = this.spaceship.x;
      const by = this.spaceship.y - this.spaceship.height / 2;
      this.bullets.push(this.object.bullet(bx, by));
      this.fireCooldown = this.fireDelay;
    }
  }
};


InGamePosition.prototype.keyUp = function (play, keyboardCode) {
  // có thể dùng cho nhả Space/bỏ giữ
};

InGamePosition.prototype.draw = function (play) {
  ctx.clearRect(0, 0, play.width, play.height);
  if (!this.spaceship) return;

  ctx.drawImage(
    this.spaceship_image,
    this.spaceship.x - this.spaceship.width  / 2,
    this.spaceship.y - this.spaceship.height / 2,
    this.spaceship.width,
    this.spaceship.height
  );

  // bullets
for (const b of this.bullets) {
  ctx.fillStyle = b.color;
  ctx.fillRect(b.x - b.w / 2, b.y - b.h, b.w, b.h);
  // viền đậm để nổi bật
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#FF7A00";
  ctx.strokeRect(b.x - b.w / 2, b.y - b.h, b.w, b.h);

}


// enemies
for (const e of this.enemies) {
  ctx.drawImage(
    this.enemy_image,
    e.x - e.w / 2,
    e.y - e.h / 2,
    e.w,
    e.h
  );
}


// bombs
for (const b of this.bombs) {
  ctx.fillStyle = b.color;
  ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
  ctx.strokeStyle = "#6BA7FF";
  ctx.lineWidth = 2;
  ctx.strokeRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
}

};
