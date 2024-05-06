const countdown = document.getElementById("countdown") as HTMLInputElement;

const background = document.getElementById("bg") as HTMLInputElement;

const startButton = document.getElementById("start") as HTMLInputElement;
const stopButton = document.getElementById("stop") as HTMLInputElement;

const pomodoro = document.getElementById("pomodoro") as HTMLInputElement;
const shortBreak = document.getElementById("short") as HTMLInputElement;
const longBreak = document.getElementById("long") as HTMLInputElement;

const settings: any = document.getElementById("settingsmenu") as HTMLInputElement;

const pomodoroTimer = document.getElementById("pomodoro-timers") as HTMLInputElement;
const customization = document.getElementById("customizations") as HTMLInputElement;
const sounds = document.getElementById("sounds") as HTMLInputElement;

const form = document.getElementById("form") as HTMLInputElement;

const pomoInput: any = document.getElementById("pomoinput") as HTMLInputElement;
const shortInput: any = document.getElementById("shortinput") as HTMLInputElement;
const longInput: any = document.getElementById("longinput") as HTMLInputElement;

const pomNo: any = document.getElementById("noofpom") as HTMLInputElement;

const pomoInputSec: any = document.getElementById("pomoinputsec") as HTMLInputElement;
const shortInputSec: any = document.getElementById("shortinputsec") as HTMLInputElement;
const longInputSec: any = document.getElementById("longinputsec") as HTMLInputElement;

const colInput: any = document.getElementById("colinput") as HTMLInputElement;
const imgInput: any = document.getElementById("imginput") as HTMLInputElement;

const chooseImg: any = document.getElementById("chooseImg") as HTMLInputElement;

const fontInput: any = document.getElementById("fontinput") as HTMLInputElement;

const chooseFont: any = document.getElementById("chooseFont") as HTMLInputElement;

const almSound: any = document.getElementById("almSound") as HTMLInputElement;

const chooseAlmSound: any = document.getElementById("chooseAlmS") as HTMLInputElement;

let pressSound = new Audio('https://github.com/maykbrito/automatic-video-creator/blob/master/audios/button-press.wav?raw=true')
let timerSound = new Audio('https://github.com/anthonyhuang07/PomodoPro/blob/main/assets/ringin.mp3?raw=true')

let defaultTime: number = 1500;
let shortTime: number = 300;
let longTime: number = 900;
let currentTime: number = -1;
let mode: number = 1 // 1 - Pomodoro | 2 - Short | 3 - Long 
let numOfPomodoros: number = 0;
let timer: number;

pressSound.volume = 0.5;
timerSound.volume = 0.5;
countdown.innerHTML = "Loading";
settings.style.display = "none";
setRandomBackgroundColor()

// Add this code to your script to retrieve values from cache on page load

window.onload = () => {
  const bgImageUrl = localStorage.getItem("bgImageUrl");
  if (bgImageUrl) {
    document.body.style.backgroundImage = `url(${bgImageUrl})`;
  }
  
  const storedDefaultTime = localStorage.getItem("defaultTime");
  if (storedDefaultTime) {
    defaultTime = parseInt(storedDefaultTime);
    pomoInput.value = Math.floor(defaultTime / 60);
    pomoInputSec.value = defaultTime % 60;
  }

  const storedShortTime = localStorage.getItem("shortTime");
  if (storedShortTime) {
    shortTime = parseInt(storedShortTime);
    shortInput.value = Math.floor(shortTime / 60);
    shortInputSec.value = shortTime % 60;
  }

  const storedLongTime = localStorage.getItem("longTime");
  if (storedLongTime) {
    longTime = parseInt(storedLongTime);
    longInput.value = Math.floor(longTime / 60);
    longInputSec.value = longTime % 60;
  }

  countdown.innerHTML = formatTime(defaultTime); // Update countdown display with defaultTime
};


function playSound() {
  pressSound.currentTime = 0;
  pressSound.play();
}

function playSoundTimer() {
  timerSound.currentTime = 0;
  timerSound.play();
}

function setRandomBackgroundColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  document.body.style.backgroundColor = color;
  colInput.value = color;
}

function formatTime(time: number): string { // formats the timer as xx:xx
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  let formattedTime = "";
  if (hours > 0) {
    formattedTime += `${hours.toString()}:`;
  }
  formattedTime += `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
}

function letsGo() { // Starts Timer
  playSound()
  if (currentTime == -1){
    switch (mode) {
      case 1:
        currentTime = defaultTime
        break;
      case 2:
        currentTime = shortTime
        break;
      case 3:
        currentTime = longTime
        break;
    }
  }
  startTimer();
}

function startTimer() {
  startButton.style.display = "none";
  stopButton.style.display = "block";
  timer = setInterval(() => {
    currentTime--;
    countdown.innerHTML = formatTime(currentTime);
    document.title = formatTime(currentTime) + " - PomodoPro";

    if (currentTime <= 0) {
      currentTime = -1;
      playSoundTimer();
      clearInterval(timer);
      if (mode === 1 && numOfPomodoros !== (pomNo.value - 1)) { // if was in Pomodoro Mode (go to Short)
        numOfPomodoros++
        mode = 2;
        countdown.innerHTML = formatTime(shortTime);
        document.title = formatTime(shortTime) + " - PomodoPro";
        pomodoro.style.backgroundColor = "transparent";
        pomodoro.style.color = "white";
        shortBreak.style.backgroundColor = "white";
        shortBreak.style.color = "black";
        startButton.style.display = "block";
        stopButton.style.display = "none";
      } else if (mode === 2 && numOfPomodoros !== pomNo.value) { // if was in Short Time Mode (return to Default)
        mode = 1;
        countdown.innerHTML = formatTime(defaultTime);
        document.title = formatTime(defaultTime) + " - PomodoPro";
        pomodoro.style.backgroundColor = "white";
        pomodoro.style.color = "black";
        shortBreak.style.backgroundColor = "transparent";
        shortBreak.style.color = "white";
        startButton.style.display = "block";
        stopButton.style.display = "none";
      } else if (mode === 1 && numOfPomodoros === (pomNo.value - 1)) { // if was in Pomodoro Mode (go to Long)
        numOfPomodoros++
        mode = 3;
        countdown.innerHTML = formatTime(longTime);
        document.title = formatTime(longTime) + " - PomodoPro";
        longBreak.style.backgroundColor = "white";
        longBreak.style.color = "black";
        pomodoro.style.backgroundColor = "transparent";
        pomodoro.style.color = "white";
        startButton.style.display = "block";
        stopButton.style.display = "none";
      } else if (mode === 3) { // if was in Short Time Mode (return to Default)
        numOfPomodoros = 0;
        mode = 1;
        countdown.innerHTML = formatTime(defaultTime);
        document.title = formatTime(defaultTime) + " - PomodoPro";
        longBreak.style.backgroundColor = "transparent";
        longBreak.style.color = "white";
        pomodoro.style.backgroundColor = "white";
        pomodoro.style.color = "black";
        startButton.style.display = "block";
        stopButton.style.display = "none";
      }
    }
  }, 1000);
}


function stopTimer() {
  playSound()
  startButton.style.display = "block";
  stopButton.style.display = "none";
  clearInterval(timer)
}

function modeSwitcher(modeNum: number, timeType: number, pomoCol: string, shortCol: string, longCol: string, col1: string, col2: string, col3: string) {
  playSound()
  currentTime = -1;
  numOfPomodoros = 0;
  clearInterval(timer);
  mode = modeNum
  countdown.innerHTML = formatTime(timeType)
  startButton.style.display = "block";
  stopButton.style.display = "none";
  pomodoro.style.backgroundColor = pomoCol;
  shortBreak.style.backgroundColor = shortCol;
  longBreak.style.backgroundColor = longCol;
  pomodoro.style.color = col1;
  shortBreak.style.color = col2;
  longBreak.style.color = col3;
}

function settingsMenu() {
  playSound()
  if (settings.style.display == "none") {
    settings.style.display = "block";
    background.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
    countdown.style.color = "rgba(255, 255, 255, 0.5)";
  } else if (settings.style.display == "block") {
    settings.style.display = "none";
    background.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    countdown.style.color = "rgba(255, 255, 255, 1)";
  }

}

function switchMenu(val: number) {
  playSound()
  if (val == 2) {
    pomodoroTimer.style.display = "none";
    customization.style.display = "flex";
    sounds.style.display = "none";
  } else if (val == 1) {
    pomodoroTimer.style.display = "flex";
    customization.style.display = "none";
    sounds.style.display = "none";
  } else if (val == 3) {
    sounds.style.display = "flex";
    pomodoroTimer.style.display = "none";
    customization.style.display = "none";
  }
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  settings.style.display = "none";
  background.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  countdown.style.color = "rgba(255, 255, 255, 1)";
  startButton.style.display = "block";
  stopButton.style.display = "none";
  clearInterval(timer)
  currentTime = -1;
  defaultTime = (parseInt(pomoInput.value) * 60) + parseInt(pomoInputSec.value);
  shortTime = (parseInt(shortInput.value) * 60) + parseInt(shortInputSec.value);
  longTime = (parseInt(longInput.value) * 60) + parseInt(longInputSec.value);
  switch (mode) {
    case 1:
      countdown.innerHTML = formatTime(defaultTime);
      break;
    case 2:
      countdown.innerHTML = formatTime(shortTime);
      break;
    case 3:
      countdown.innerHTML = formatTime(longTime);
      break;
  }

  document.body.style.backgroundColor = colInput.value

  if (imgInput.files[0]) {
    const file = imgInput.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const imageUrl = reader.result as string;
      document.body.style.backgroundImage = `url(${imageUrl})`;
      localStorage.setItem("bgImageUrl", imageUrl); // Save background image URL to cache
    };
    reader.readAsDataURL(file);
  }

  if (almSound.files[0]) {
    const file = almSound.files[0];
    const audioUrl = URL.createObjectURL(file);
    timerSound = new Audio(audioUrl);
  }

  if (fontInput.files[0]) {
    const file = fontInput.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const fontUrl = reader.result;
      const fontFace = new FontFace('CustomFont', `url(${fontUrl})`);
      fontFace.load().then(function () {
        (document.fonts as any).add(fontFace);
        countdown.style.fontFamily = 'CustomFont, sans-serif';
      });
    };
    reader.readAsDataURL(file);
  }

  localStorage.setItem("defaultTime", defaultTime.toString()); // Save default time to cache
  localStorage.setItem("shortTime", shortTime.toString()); // Save short time to cache
  localStorage.setItem("longTime", longTime.toString()); // Save long time to cache

  playSound()
})

form.addEventListener('reset', function (e) {
  e.preventDefault();
  settingsMenu()
})

chooseImg.addEventListener('click', function () {
  imgInput.click();
})

chooseAlmSound.addEventListener('click', function () {
  almSound.click();
})

chooseFont.addEventListener('click', function () {
  fontInput.click();
})