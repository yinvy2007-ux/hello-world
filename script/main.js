
const canvas = document.getElementById("ufoCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 750;

function resize () {

    const height = window.innerHeight -20;

    const ratio = canvas.width / canvas.height;
    const width = height * ratio;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}

window.addEventListener('load',resize,false);

function GameBasics (canvas) {

    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;

    this.playBoundaries = {
        top:150,
        bottom:650,
        left:100,
        right:800,
    };

    this.level = 1;
    this.score = 0;
    this.shields = 2;

    this.setting = {
        updateSeconds: (1/60),
    };

    this.positionContainer = [];
    
    this.pressedKeys = {};

}

GameBasics.prototype.presentPosition = function () {
    return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1 ]:null 
};

GameBasics.prototype.goToPosition = function (position) {
    if (this.presentPosition()) {
        this.positionContainer.length = 0;
    }

    if (position.entry) {
        position.entry(this);
    }

    this.positionContainer.push(position);
};

GameBasics.prototype.pushPosition = function () {
    this.positionContainer.pop();
};

GameBasics.prototype.start = function () {

    setInterval(function() { gameLoop(play); }, this.setting.updateSeconds * 1000);

    this.goToPosition(new OpeningPosition());

    
    

};



// Notifies the game when a key is pressed
GameBasics.prototype.keyDown = function(keyboardCode) {
    this.pressedKeys[keyboardCode] = true;

    if (this.presentPosition() && this.presentPosition().keyDown) {
        this.presentPosition().keyDown(this, keyboardCode);
    }
};

// Notifies the game when a key is released
GameBasics.prototype.keyUp = function(keyboardCode) {
  delete this.pressedKeys[keyboardCode];

  // forward xuống position hiện tại (đồng bộ với keyDown)
  if (this.presentPosition() && this.presentPosition().keyUp) {
    this.presentPosition().keyUp(this, keyboardCode);
  }
};



function gameLoop(play) {

    let presentPosition = play.presentPosition();

    if(presentPosition) {
    
        if(presentPosition.update) {
            presentPosition.update(play);
        }

        if(presentPosition.draw) {
            presentPosition.draw(play);
        }
    }
}

// Keyboard events listening
window.addEventListener('keydown', function(e) {
  const keyboardCode = e.code;
if (
  keyboardCode === "ArrowLeft"  ||
  keyboardCode === "ArrowRight" ||
  keyboardCode === "ArrowUp"    ||
  keyboardCode === "ArrowDown"  ||
  keyboardCode === "Space"
) {
  e.preventDefault();
}


  console.log("window keydown:", keyboardCode);
  play.keyDown(keyboardCode);
}, false);

window.addEventListener('keyup', function(e) {
  const keyboardCode = e.code;
  console.log("window keyup:", keyboardCode); 
  play.keyUp(keyboardCode);
}, false);



const play = new GameBasics(canvas);
play.start();