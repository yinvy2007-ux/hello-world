// --- objects --- //
function Objects() {
}

Objects.prototype.spaceship = function (x, y, spaceship_image) {
  this.x = x;
  this.y = y;
  this.width = 80;   
  this.height = 80;
  this.spaceship_image = spaceship_image;
  this.spaceship_image.src = "images/ship.png";
  return this;
};

// Bullet object (đạn thẳng lên)
Objects.prototype.bullet = function (x, y) {
  return {
    x: x,
    y: y,
    w: 6,
    h: 18,
    speed: 14,   // tốc độ bay
    color: "#FFD400"
  };
};

// Enemy object (kẻ địch cơ bản, bay ngang, đổi hướng khi chạm biên)
Objects.prototype.enemy = function (x, y, speedX, speedY) {
  return {
    x: x,
    y: y,
    w: 90,
    h: 90,
    speedX: speedX,   // px / frame (ngang)
    speedY: speedY,   // px / frame (dọc)
    dir: 1,           // 1: sang phải, -1: sang trái
    hp: 1,
    color: "#39FFEA",
    dropCooldown: Math.floor(60 + Math.random() * 90) // ~1–2.5s sẽ ném 1 quả
  };
};

// Bomb object (bom rơi xuống từ kẻ địch)
Objects.prototype.bomb = function (x, y) {
  return {
    x: x,
    y: y,
    w: 6,
    h: 14,
    speed: 8,
    color: "#A0C7FF"
  };
};

