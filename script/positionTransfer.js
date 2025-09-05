function TransferPosition(level) {
  this.level = level; // lưu level hiện tại
  this.num = 1;       // biến đếm frame
}

TransferPosition.prototype.update = function(play) {
  this.num++;

  if (this.num > 120) {
    play.goToPosition(new InGamePosition(play.settings, this.level));
  }
};

TransferPosition.prototype.draw = function(play) {

  ctx.clearRect(0, 0, play.width, play.height);

  ctx.font = "40px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,1)";

  ctx.fillText(
    "Get ready for level " + this.level,
    play.width / 2,
    play.height / 2
  );
};

