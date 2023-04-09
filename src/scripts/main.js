"use strict";
const countdown = document.getElementById("countdown");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const pomodoro = document.getElementById("pomodoro");
const shortBreak = document.getElementById("short");
const longBreak = document.getElementById("long");
const settings = document.getElementById("settingsmenu");
const pomodoroTimer = document.getElementById("pomodoro-timers");
const customization = document.getElementById("customizations");
const form = document.getElementById("form");
const pomoInput = document.getElementById("pomoinput");
const shortInput = document.getElementById("shortinput");
const longInput = document.getElementById("longinput");
const pomoInputSec = document.getElementById("pomoinputsec");
const shortInputSec = document.getElementById("shortinputsec");
const longInputSec = document.getElementById("longinputsec");
const colInput = document.getElementById("colinput");
const imgInput = document.getElementById("imginput");
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
setRandomBackgroundColor();
function setRandomBackgroundColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    document.body.style.backgroundColor = color;
    colInput.value = color;
}
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
        if (timeType <= 0) {
            clearInterval(timer);
            if (mode === 1 && numOfPomodoros !== 3) {
                numOfPomodoros++;
                mode = 2;
                countdown.innerHTML = formatTime(shortTime);
                pomodoro.style.backgroundColor = "transparent";
                pomodoro.style.color = "white";
                shortBreak.style.backgroundColor = "white";
                shortBreak.style.color = "black";
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 2 && numOfPomodoros !== 4) {
                mode = 1;
                countdown.innerHTML = formatTime(defaultTime);
                pomodoro.style.backgroundColor = "white";
                pomodoro.style.color = "black";
                shortBreak.style.backgroundColor = "transparent";
                shortBreak.style.color = "white";
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 1 && numOfPomodoros === 3) {
                numOfPomodoros++;
                mode = 3;
                countdown.innerHTML = formatTime(longTime);
                longBreak.style.backgroundColor = "white";
                longBreak.style.color = "black";
                pomodoro.style.backgroundColor = "transparent";
                pomodoro.style.color = "white";
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 3) {
                numOfPomodoros = 0;
                mode = 1;
                countdown.innerHTML = formatTime(defaultTime);
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
    pressSound.play();
    startButton.style.display = "block";
    stopButton.style.display = "none";
    clearInterval(timer);
}
function modeSwitcher(modeNum, timeType, pomoCol, shortCol, longCol, col1, col2, col3) {
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
    pomodoro.style.color = col1;
    shortBreak.style.color = col2;
    longBreak.style.color = col3;
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
function switchMenu(val) {
    pressSound.play();
    if (val == 2) {
        pomodoroTimer.style.display = "none";
        customization.style.display = "flex";
    }
    else if (val == 1) {
        pomodoroTimer.style.display = "flex";
        customization.style.display = "none";
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
    document.body.style.backgroundColor = colInput.value;
    const file = imgInput.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        const imageUrl = reader.result;
        document.body.style.backgroundImage = `url(${imageUrl})`;
    };
    reader.readAsDataURL(file);
});
form.addEventListener('reset', function (e) {
    e.preventDefault();
    settingsMenu();
});
