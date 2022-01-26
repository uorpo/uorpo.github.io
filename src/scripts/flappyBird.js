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
        if (Math.round(average) > 30) {
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

var mode = "blow";

  var tiltButton = document.getElementById("tilt");
  tiltButton.addEventListener('click', mobileVersion, false);
  var blowButton = document.getElementById("blow");
  blowButton.addEventListener('click', mobileVersion, false);
  var clickButton = document.getElementById("click");
  clickButton.addEventListener('click', webVersion, false);
  
  
  function mobileVersion() {
    if (isMobile.any()) {
      if (this == tiltButton) {
        mode = "tilt";
      } else {
        mode = "blow";
        //listenToMicrophone();
      }
      if (page == "flappyBird.html") {
        this.href = "flappyBird.html";
      } else {
        this.href = "src/flappyBird.html";
      }
    } else {
      alert(switchToMobileMessage);
    } 
  }

  function webVersion() {
    console.log(isMobile.any());
    if (isMobile.any() == null) {
      mode = "click";
      this.href = "flappyBird.html";
    } else if (isMobile.any()) {
      alert(switchToWebMessage);
    } 
  }





if (page == "flappyBird.html") {
  var playButton = document.getElementById("play_button");
  playButton.addEventListener('click', hideshow, false);
  function hideshow() {
    this.style.display = 'none';
  }
}



var score = 0;
var jumping = 0;

function startGame() {
  hole.addEventListener('animationiteration', () => {
    var top = Math.random() * (parseInt(window.getComputedStyle(game).getPropertyValue("height")) - parseInt(window.getComputedStyle(hole).getPropertyValue("height")));
    hole.style.top = top + "px";
    score++;
    scoreText.innerHTML = "score: " + score;
  });
  pipe.style.animation = "pipe 3s infinite linear";
  hole.style.animation = "pipe 3s infinite linear";
  if (mode != "tilt") {
    birdFalling();
  }
  birdJumping();
};

function birdJumping() {
  if (mode == "click") {
    document.body.addEventListener('click', jump, true);
  } else if (mode == "blow") {
    listenToMicrophone();
  } 
}

function jump() {
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
  if (mode == "tilt") {return;}
  setInterval(function() {
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
    alert("G a m e  o v e r");
    score = 0;
    window.location.reload();
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