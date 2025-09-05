function OpeningPosition() {

}

OpeningPosition.prototype.draw = function (play) {

//UFO Hunter
ctx.clearRect(0,0,play.width,play.height);
ctx.font='80px Comic Sans MS';
ctx.textAlign="center";
const gradient = ctx.createLinearGradient(play.width / 2 - 180, play.height / 2 - 180, play.width / 2 + 180, play.height / 2 + 180);
gradient.addColorStop(0, "#FFD700");  
gradient.addColorStop(0.5, "#FF8C00"); 
gradient.addColorStop(1, "#FF0000"); 

ctx.fillStyle = gradient;
ctx.fillText("UFO HUNTER",play.width / 2, play.height/2 - 70);

// Press 'Space' to start
ctx.font="40px Comic Sans MS";
ctx.fillStyle = '#FFFFFF';
ctx.fillText("Press 'Space' to start.",play.width / 2,play.height/2 );

// Game Controls
ctx.fillStyle = '#AEEEEE';
ctx.fillText("Game Controls",play.width / 2, play.height/2 +210);
ctx.fillText("Left Arrow : Move Left",play.width / 2,play.height/2 +260);
ctx.fillText("Right Arrow : Move Right",play.width / 2,play.height/2 +300);
ctx.fillText("Space : Fire", play.width / 2,play.height/2 +340);
};

OpeningPosition.prototype.keyDown = function(play, keyboardCode) {
    if(keyboardCode === "Space" ) {
        play.goToPosition(new TransferPosition(play.level));
    }
}