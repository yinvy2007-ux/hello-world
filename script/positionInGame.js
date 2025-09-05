function InGamePosition(settings, level) {
    this.settings = settings;
    this.level = level;
}

InGamePosition.prototype.draw = function(play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.font = "40px Comic Sans MS";
    ctx.fillStyle = "#D7DF01";
    ctx.fillText("We are in InPosition", play.width / 2, play.height / 2);
};
