
const canvas = document.getElementById("ufoCanvas");

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

    this.setting = {
        updateSeconds: (1/60),
    };

    this.positionContainer = [];

}

GameBasics.prototype.presentPosition = function () {
    return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1 ]:null 
};

GameBasics.prototype.goToPosition = function (position) {
    if (this.presentPosition()) {
        this.positionContainer.length = 0;
    }

    if (position.entry) {
        position.entry(play);
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

const play = new GameBasics(canvas);
play.start();

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