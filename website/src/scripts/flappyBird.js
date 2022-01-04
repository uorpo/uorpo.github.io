var pipe = document.getElementById("pipe");
var hole = document.getElementById("hole");

hole.addEventListener('animationiteration', () => {
    var random = -((Math.random() * 600) + 150);
    hole.style.top = random + "px";
});
