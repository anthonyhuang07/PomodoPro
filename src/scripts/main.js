"use strict";
const countdown = document.getElementById("countdown");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const pomodoro = document.getElementById("pomodoro");
const shortBreak = document.getElementById("short");
const longBreak = document.getElementById("long");
const settings = document.getElementById("settingsmenu");
const form = document.getElementById("form");
const pomoInput = document.getElementById("pomoinput");
const shortInput = document.getElementById("shortinput");
const longInput = document.getElementById("longinput");
const pomoInputSec = document.getElementById("pomoinputsec");
const shortInputSec = document.getElementById("shortinputsec");
const longInputSec = document.getElementById("longinputsec");
const darkBg = "hsl(240, 9%, 82.5%)";
const lightBg = "#e0e0e5";
const pressSound = new Audio('https://github.com/maykbrito/automatic-video-creator/blob/master/audios/button-press.wav?raw=true');
let defaultTime = 1500;
let shortTime = 300;
let longTime = 900;
let mode = 1; // 1 - Pomodoro | 2 - Short | 3 - Long 
let numOfPomodoros = 0;
let timer;
pressSound.volume = 0.5;
countdown.innerHTML = formatTime(defaultTime);
settings.style.display = "none";
function formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    let formattedTime = "";
    if (hours > 0) {
        formattedTime += `${hours.toString().padStart(2, "0")}:`;
    }
    formattedTime += `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return formattedTime;
}
function letsGo() {
    pressSound.play();
    switch (mode) {
        case 1:
            startTimer(defaultTime);
            break;
        case 2:
            startTimer(shortTime);
            break;
        case 3:
            startTimer(longTime);
            break;
    }
}
function startTimer(timeType) {
    startButton.style.display = "none";
    stopButton.style.display = "block";
    timer = setInterval(() => {
        timeType--;
        countdown.innerHTML = formatTime(timeType);
        document.title = formatTime(timeType) + " - PomodoPro";
        if (timeType === 0) {
            clearInterval(timer);
            defaultTime = 1500;
            shortTime = 300;
            longTime = 900;
            if (mode === 1 && numOfPomodoros !== 3) {
                numOfPomodoros++;
                console.log(numOfPomodoros);
                mode = 2;
                countdown.innerHTML = formatTime(shortTime);
                pomodoro.style.backgroundColor = lightBg;
                shortBreak.style.backgroundColor = darkBg;
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 2 && numOfPomodoros !== 4) {
                mode = 1;
                console.log(numOfPomodoros);
                countdown.innerHTML = formatTime(defaultTime);
                pomodoro.style.backgroundColor = darkBg;
                shortBreak.style.backgroundColor = lightBg;
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 1 && numOfPomodoros === 3) {
                numOfPomodoros++;
                console.log(numOfPomodoros);
                mode = 3;
                countdown.innerHTML = formatTime(longTime);
                longBreak.style.backgroundColor = darkBg;
                pomodoro.style.backgroundColor = lightBg;
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 3) {
                numOfPomodoros = 0;
                console.log(numOfPomodoros);
                mode = 1;
                countdown.innerHTML = formatTime(defaultTime);
                longBreak.style.backgroundColor = lightBg;
                pomodoro.style.backgroundColor = darkBg;
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
        }
    }, 1000);
}
function stopTimer() {
    pressSound.play();
    startButton.style.display = "block";
    stopButton.style.display = "none";
    clearInterval(timer);
}
function modeSwitcher(modeNum, timeType, pomoCol, shortCol, longCol) {
    pressSound.play();
    numOfPomodoros = 0;
    clearInterval(timer);
    mode = modeNum;
    countdown.innerHTML = formatTime(timeType);
    startButton.style.display = "block";
    stopButton.style.display = "none";
    pomodoro.style.backgroundColor = pomoCol;
    shortBreak.style.backgroundColor = shortCol;
    longBreak.style.backgroundColor = longCol;
}
function settingsMenu() {
    pressSound.play();
    if (settings.style.display == "none") {
        settings.style.display = "block";
    }
    else if (settings.style.display == "block") {
        settings.style.display = "none";
    }
}
form.addEventListener('submit', function (e) {
    e.preventDefault();
    stopTimer();
    settingsMenu();
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
});
form.addEventListener('reset', function (e) {
    e.preventDefault();
    settingsMenu();
});
