"use strict";
const countdown = document.getElementById("countdown");
const background = document.getElementById("bg");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const restartButton = document.getElementById("restart");
const settingsButton = document.getElementById("settings");
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
// const pomNo: any = document.getElementById("noofpom") as HTMLInputElement;
const p2 = document.querySelector(".p2");
const p3 = document.querySelector(".p3");
const p4 = document.querySelector(".p4");
const pomoInputSec = document.getElementById("pomoinputsec");
const shortInputSec = document.getElementById("shortinputsec");
const longInputSec = document.getElementById("longinputsec");
// const colInput: any = document.getElementById("colinput") as HTMLInputElement;
const imgInput = document.getElementById("imginput");
const chooseImg = document.getElementById("chooseImg");
const fontInput = document.getElementById("fontinput");
const chooseFont = document.getElementById("chooseFont");
const almSound = document.getElementById("almSound");
const chooseAlmSound = document.getElementById("chooseAlmS");
let pressSound = new Audio('https://github.com/maykbrito/automatic-video-creator/blob/master/audios/button-press.wav?raw=true');
let timerSound = new Audio('https://github.com/anthonyhuang07/PomodoPro/blob/main/assets/ringin.mp3?raw=true');
let defaultTime = 1500;
let shortTime = 300;
let longTime = 900;
let currentTime = -1;
let mode = 1; // 1 - Pomodoro | 2 - Short | 3 - Long 
let numOfPomodoros = 0;
let timer;
pressSound.volume = 0.5;
timerSound.volume = 0.5;
countdown.innerHTML = "Loading";
settings.style.display = "none";
setRandomBackgroundColor();
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
    countdown.innerHTML = formatTime(defaultTime);
};
document.addEventListener('click', function (event) {
    const isClickInsideSettings = settings.contains(event.target);
    const isClickOnSettingsButton = settingsButton.contains(event.target);
    if (!isClickInsideSettings && !isClickOnSettingsButton && settings.style.display === "block") {
        settingsMenu();
    }
});
function playSound() {
    pressSound.currentTime = 0;
    pressSound.play();
}
function playSoundTimer() {
    timerSound.currentTime = 0;
    timerSound.play();
}
function setRandomBackgroundColor() {
    const randomHue = Math.floor(Math.random() * 360);
    const color1 = `hsl(${randomHue}, 75%, 50%)`;
    const color2 = `hsl(${(randomHue + 60) % 360}, 75%, 50%)`;
    document.body.style.backgroundImage = `linear-gradient(135deg, ${color1}, ${color2})`;
}
function formatTime(time) {
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
function letsGo() {
    playSound();
    if (currentTime == -1) {
        switch (mode) {
            case 1:
                currentTime = defaultTime;
                break;
            case 2:
                currentTime = shortTime;
                break;
            case 3:
                currentTime = longTime;
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
        document.title = formatTime(currentTime) + " - PomodoPro";
        countdown.innerHTML = formatTime(currentTime);
        if (currentTime <= 0) {
            currentTime = -1;
            playSoundTimer();
            clearInterval(timer);
            if (mode === 1 && numOfPomodoros !== 3) { // if was in Pomodoro Mode (go to Short)
                mode = 2;
                countdown.innerHTML = formatTime(shortTime);
                document.title = formatTime(shortTime) + " - PomodoPro";
                pomodoro.style.backgroundColor = "transparent";
                pomodoro.style.color = "white";
                shortBreak.style.backgroundColor = "white";
                shortBreak.style.color = "black";
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 2 && numOfPomodoros !== 4) { // if was in Short Time Mode (return to Default)
                numOfPomodoros++;
                mode = 1;
                countdown.innerHTML = formatTime(defaultTime);
                document.title = formatTime(defaultTime) + " - PomodoPro";
                pomodoro.style.backgroundColor = "white";
                pomodoro.style.color = "black";
                shortBreak.style.backgroundColor = "transparent";
                shortBreak.style.color = "white";
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 1 && numOfPomodoros === 3) { // if was in Pomodoro Mode (go to Long)
                numOfPomodoros++;
                mode = 3;
                countdown.innerHTML = formatTime(longTime);
                document.title = formatTime(longTime) + " - PomodoPro";
                longBreak.style.backgroundColor = "white";
                longBreak.style.color = "black";
                pomodoro.style.backgroundColor = "transparent";
                pomodoro.style.color = "white";
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 3) { // if was in Long Time Mode (return to Default)
                numOfPomodoros = 0;
                p2.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
                p3.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
                p4.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
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
            if (numOfPomodoros == 1) {
                p2.style.backgroundColor = "white";
            }
            else if (numOfPomodoros == 2) {
                p3.style.backgroundColor = "white";
            }
            else if (numOfPomodoros == 3) {
                p4.style.backgroundColor = "white";
            }
        }
    }, 1000);
}
function stopTimer() {
    playSound();
    startButton.style.display = "block";
    stopButton.style.display = "none";
    clearInterval(timer);
}
function restartTimer() {
    restartButton.classList.add("clicked");
    restartButton.style.pointerEvents = "none";
    setTimeout(function () {
        restartButton.classList.remove("clicked");
        restartButton.style.pointerEvents = "auto";
    }, 1000);
    currentTime = -1;
    stopTimer();
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
}
function modeSwitcher(modeNum, timeType, pomoCol, shortCol, longCol, col1, col2, col3) {
    playSound();
    p2.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    p3.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    p4.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    currentTime = -1;
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
    playSound();
    if (settings.style.display == "none") {
        settings.style.display = "block";
        background.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
        countdown.style.color = "rgba(255, 255, 255, 0.5)";
    }
    else if (settings.style.display == "block") {
        settings.style.display = "none";
        background.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        countdown.style.color = "rgba(255, 255, 255, 1)";
    }
}
function switchMenu(val) {
    playSound();
    if (val == 2) {
        pomodoroTimer.style.display = "none";
        customization.style.display = "flex";
    }
    else if (val == 1) {
        pomodoroTimer.style.display = "flex";
        customization.style.display = "none";
    }
    else if (val == 3) {
        pomodoroTimer.style.display = "none";
        customization.style.display = "none";
    }
}
function resetToDefaults() {
    clearInterval(timer);
    mode = 1;
    numOfPomodoros = 0;
    defaultTime = 1500;
    shortTime = 300;
    longTime = 900;
    currentTime = -1;
    document.title = formatTime(defaultTime) + " - PomodoPro";
    longBreak.style.backgroundColor = "transparent";
    longBreak.style.color = "white";
    pomodoro.style.backgroundColor = "white";
    pomodoro.style.color = "black";
    startButton.style.display = "block";
    stopButton.style.display = "none";
    p2.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    p3.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    p4.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    countdown.innerHTML = formatTime(defaultTime);
    document.body.style.backgroundImage = "";
    pomoInput.value = Math.floor(defaultTime / 60);
    pomoInputSec.value = defaultTime % 60;
    shortInput.value = Math.floor(shortTime / 60);
    shortInputSec.value = shortTime % 60;
    longInput.value = Math.floor(longTime / 60);
    longInputSec.value = longTime % 60;
    playSound();
    settingsMenu();
    setRandomBackgroundColor();
    localStorage.setItem("bgImageUrl", "");
    localStorage.setItem("defaultTime", defaultTime.toString());
    localStorage.setItem("shortTime", shortTime.toString());
    localStorage.setItem("longTime", longTime.toString());
}
function focusInput(inputId) {
    const input = document.getElementById(inputId);
    input.focus();
}
form.addEventListener('submit', function (e) {
    e.preventDefault();
    settings.style.display = "none";
    background.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    countdown.style.color = "rgba(255, 255, 255, 1)";
    startButton.style.display = "block";
    stopButton.style.display = "none";
    clearInterval(timer);
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
    // document.body.style.backgroundColor = colInput.value
    if (imgInput.files[0]) { // Set BG as Selected Image
        const file = imgInput.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            const imageUrl = reader.result;
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
                document.fonts.add(fontFace);
                countdown.style.fontFamily = 'CustomFont, sans-serif';
            });
        };
        reader.readAsDataURL(file);
    }
    localStorage.setItem("defaultTime", defaultTime.toString()); // Save default time to cache
    localStorage.setItem("shortTime", shortTime.toString()); // Save short time to cache
    localStorage.setItem("longTime", longTime.toString()); // Save long time to cache
    playSound();
});
form.addEventListener('reset', function (e) {
    e.preventDefault();
    settingsMenu();
});
chooseImg.addEventListener('click', function () {
    imgInput.click();
});
chooseAlmSound.addEventListener('click', function () {
    almSound.click();
});
chooseFont.addEventListener('click', function () {
    fontInput.click();
});
