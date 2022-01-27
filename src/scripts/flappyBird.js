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



function listenToMicrophone() {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then(function (stream) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = function () {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        const average = arraySum / array.length;
        if ((Math.round(average) > 30) &&  playing) {
          jump();
        }
      };
    })
    .catch(function (err) {
      console.error(err);
    });
}

var path = window.location.pathname;
var page = path.split("/").pop();

var pipe = document.getElementById("pipe");
var game = document.getElementById("game");
var hole = document.getElementById("hole");
var bird = document.getElementById("bird");
var scoreText = document.getElementById("score");

var switchToMobileMessage = "Bitte wechseln Sie auf ein mobiles Gerät um diese Version zu spielen.";
var switchToWebMessage = "Bitte wechseln Sie auf die Webversion um diese Version zu spielen.";

var mode = null;

var tiltButton = document.getElementById("tilt");
tiltButton.addEventListener('click', mobile_version, false);
var blowButton = document.getElementById("blow");
blowButton.addEventListener('click', mobile_version, false);
var clickButton = document.getElementById("click");
clickButton.addEventListener('click', web_version, false);


function mobile_version() {
  if (isMobile.any()) {
    if (this == tiltButton) {
      mode = "tilt";
      getAccel();
    } else {
      mode = "blow";
      listenToMicrophone();
    }
    playButton.classList.add("play-allowed");
    playButton.classList.remove("play-not-allowed");
  } else {
    alert(switchToMobileMessage);
  } 
}

function web_version() {
  if (isMobile.any() == null) {
    mode = "click";
    playButton.classList.add("play-allowed");
    playButton.classList.remove("play-not-allowed");
  } else if (isMobile.any()) {
    alert(switchToWebMessage);
  } 
}




var playButton = document.getElementById("play_button");
playButton.addEventListener('click', hideshow, false);
playButton.classList.add("play-not-allowed");

function hideshow() {
  if (mode != null) {
    playButton.style.display = 'none';
  } 
}


function holeEventListener() {
  var top = Math.random() * (parseInt(window.getComputedStyle(game).getPropertyValue("height")) - parseInt(window.getComputedStyle(hole).getPropertyValue("height")));
    hole.style.top = top + "px";
    score++;
    scoreText.innerHTML = "score: " + score;
}


var playing = false;
var score = 0;
var jumping = 0;

function startGame() {
  console.log(mode);
  if (mode == null) {
    return;
  }
  playing = true;
  hole.addEventListener('animationiteration', holeEventListener);
  pipe.style.animation = "pipe 3s infinite linear";
  hole.style.animation = "pipe 3s infinite linear";
  birdFalling();
  birdJumping();
};

function birdJumping() {
  console.log(mode);
  if (mode == "click") {
    document.body.addEventListener('click', jump, true);
  } else if (mode == "blow") {
    
  } 
}

function jump() {
  if (!playing) {
    return;
  }
  jumping = 1;
  let jump= 0;
  var jumpInterval = setInterval(function() {
    var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
      bird.style.top = (birdTop - 3) + "px";
    
    if (jump>20) {
      clearInterval(jumpInterval);
      jumping = 0;
      jump = 0;
    }
    jump++;
    checkGameOver(); 
  }, 10);
}

function birdFalling() {
  if (mode == null)  {return;}
  birdFallingInterval = setInterval(function() {
    var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    if (jumping == 0) {
      bird.style.top = (birdTop+2) + "px";
    }
    var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    checkGameOver();
  },10);
}

function checkGameOver() {
  var birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
  var gameHeigt = parseInt(window.getComputedStyle(game).getPropertyValue("height"));
  var birdHeight = parseInt(window.getComputedStyle(bird).getPropertyValue("height"));
  var birdWidth = parseInt(window.getComputedStyle(bird).getPropertyValue("width"));
  var holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
  var holeLeft = parseInt(window.getComputedStyle(hole).getPropertyValue("left"));
  var holeBottom = holeTop + parseInt(window.getComputedStyle(hole).getPropertyValue("height"));
  var birdRight = parseInt(window.getComputedStyle(bird).getPropertyValue("left")) + birdWidth
  if ((birdTop > (gameHeigt-birdHeight)) || (birdTop < 0) 
         || ((holeLeft <= birdRight) && ((birdTop < holeTop) || (birdTop > (holeBottom-birdHeight))))) {
          //  mode = null;
           playButton.style.display = "block";
           hole.removeEventListener('animationiteration', holeEventListener);
           pipe.style.animation = "";
           hole.style.animation = "";
           clearInterval(birdFallingInterval);
           score = 0;
           scoreText.innerHTML = "score: " + score;
           bird.style.top = 200 + "px";
           playing = false;
           alert("G a m e  o v e r");
    //window.location.reload();
  }
}

function deviceOrientationListener(event) {
  // Expose each orientation angle in a more readable way
  rotation_degrees = event.alpha;
  frontToBack_degrees = event.beta;
  leftToRight_degrees = event.gamma;

  if (frontToBack_degrees > 10) {
    alert("JUMP!");
    jump();
  }

  // // Update velocity according to how tilted the phone is
  // // Since phones are narrower than they are long, double the increase to the x velocity
  // vx = vx + leftToRight_degrees * updateRate * 2;
  // vy = vy + frontToBack_degrees * updateRate;

  // // Update position and clip it to bounds
  // px = px + vx * 0.1;
  // if (px > 50 || px < 0) {
  //   px = Math.max(0, Math.min(50, px)); // Clip px between 0-98
  //   vx = 0;
  // }

  // py = py + vy * 0.1;
  // if (py > 70 || py < 0) {
  //   py = Math.max(0, Math.min(70, py)); // Clip py between 0-98
  //   vy = 0;
  // }

  // newPosY = frontToBack_degrees * 10;
  // if (newPosY > 100 || newPosY < -100) {
  //   newPosY = Math.max(-100, Math.min(100, newPosY));
  // }
  // newPosX = leftToRight_degrees * 10;
  // if (newPosX > 100 || newPosX < -100) {
  //   newPosX = Math.max(-100, Math.min(100, newPosX));
  // }

  // dot = document.getElementsByClassName("indicatorDot")[0];
  // dot.setAttribute(
  //   "style",
  //   "left: calc(50% - 120px + " +
  //     newPosX +
  //     "px);" +
  //     "top: calc(40% + 5px + " +
  //     newPosY +
  //     "px);"
  // );
  // center = document.getElementById("scaleCenter");
  // var rect = center.getBoundingClientRect();
  // var dotPos = dot.getBoundingClientRect();

  if (
    Math.abs(rect.top - dotPos.top) < SCALE_TOLERANCE &&
    Math.abs(rect.right - dotPos.right) < SCALE_TOLERANCE &&
    Math.abs(rect.bottom - dotPos.bottom) < SCALE_TOLERANCE &&
    Math.abs(rect.left - dotPos.left) < SCALE_TOLERANCE
  ) {
    dot.setAttribute(
      "style",
      "left: calc(50% - 120px + " +
        newPosX +
        "px);" +
        "top: calc(40% + 5px + " +
        newPosY +
        "px); background-color: green;"
    );
    // alert(
    //   `Center: ${rect.top}, ${rect.right}, ${rect.bottom}, ${rect.left} \n Dot: ${dotPos.top}, ${dotPos.right}, ${dotPos.bottom}, ${dotPos.left}`
    // );
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