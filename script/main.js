
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