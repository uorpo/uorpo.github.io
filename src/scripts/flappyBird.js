var pipe = document.getElementById("pipe");
var hole = document.getElementById("hole");

hole.addEventListener('animationiteration', () => {
    var random = -((Math.random() * 600) + 150);
    hole.style.top = random + "px";
});


var vy = 0.0;
var py = 50;
var updateRate = 1 / 60;


function deviceOrientationListener(event) {
    frontToBack_degrees = event.beta;
    vy = vy + frontToBack_degrees * updateRate;

    py = py + vy * 0.1;
    if (py > 70 || py < 0) {
        py = Math.max(0, Math.min(70, py)); // Clip py between 0-98
        vy = 0;
    }

    newPosY = frontToBack_degrees * 10;
    if (newPosY > 100 || newPosY < -100) {
        newPosY = Math.max(-100, Math.min(100, newPosY));
    }

    bird = document.getElementById("bird");
    bird.style.top = calc(40% + 5 + "px" + newPosY + "px");

}


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