var pipe = document.getElementsByClassName("pipe");
var hole = document.getElementById("hole");

var game = document.getElementsByClassName("game")[0];
var bird = document.getElementById("bird");
var score = 0;

hole.addEventListener('animationiteration', () => {
    var random = -((Math.random() * (300)) + 150); //todo height
    hole.style.top = random + "px";
    score++;
});


var isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return (
        navigator.userAgent.match(/IEMobile/i) ||
        navigator.userAgent.match(/WPDesktop/i)
      );
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

setInterval(function() {
  var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
  if (jumping == 0) {
    bird.style.top = (birdTop+3) + "px";
  }
  var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
  if (birdTop > 830) {
    alert("G a m e  o v e r");
    bird.style.top = 300 + "px";
    score = 0;
  }
  //var pipeLeft = parseInt(window.getComputedStyle(pipe).getPropertyValue("left"));
  var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
  var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
},10)

function clickJump() {
  jumping = 1;
  var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
  bird.style.top = (birdTop+5) + "px";
  var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
  if (birdTop < 40) {
    alert("G a m e  o v e r");
    bird.style.top = 300 + "px";
    score = 0;
  }
}

function gameSize() {
  document.querySelector('a').addEventListener('click', setGameSize)
}

function setGameSize() {
  if (isMobile.any()) {
    game.setAttribute("style", "height: 60vh;", "width: 90%;");
  } else {
    game.setAttribute("style", "height: 600px;", "width: 800px;");
  }
}

function getAccel() {
    if (isMobile.iOS()) {
      DeviceMotionEvent.requestPermission().then((response) => {
        if (response == "granted") {
          // Add a listener to get smartphone orientation
          // in the alpha-beta-gamma axes (units in degrees)
          window.addEventListener("deviceorientation", deviceOrientationListener);
        } else {
          alert("Konnte die Berechtigungen nicht einholen.");
        }
      });
    } else {
      if (window.DeviceMotionEvent == undefined) {
        alert("Konnte die Berechtigungen nicht einholen.");
      } else {
        alert("accelerometer found");
        window.addEventListener("deviceorientation", deviceOrientationListener, true);
      }
    }
}