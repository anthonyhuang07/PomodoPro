const countdown = document.getElementById("countdown");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const pomodoro = document.getElementById("pomodoro");
const shortBreak = document.getElementById("short");
const longBreak = document.getElementById("long");
const pressSound = new Audio('https://github.com/maykbrito/automatic-video-creator/blob/master/audios/button-press.wav?raw=true');
let defaultTime = 1500;
let shortTime = 300;
let longTime = 900;
let mode = 1; // 1 - Pomodoro | 2 - Short | 3 - Long 
let numOfPomodoros = 0;
let timer;
countdown.innerHTML = formatTime(defaultTime);
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
        document.title = formatTime(timeType) + " - Pomodiddily";
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
                pomodoro.style.backgroundColor = "#e0e0e5";
                shortBreak.style.backgroundColor = "hsl(240, 9%, 82.5%)";
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 2 && numOfPomodoros !== 4) {
                mode = 1;
                console.log(numOfPomodoros);
                countdown.innerHTML = formatTime(defaultTime);
                pomodoro.style.backgroundColor = "hsl(240, 9%, 82.5%)";
                shortBreak.style.backgroundColor = "#e0e0e5";
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 1 && numOfPomodoros === 3) {
                numOfPomodoros++;
                console.log(numOfPomodoros);
                mode = 3;
                countdown.innerHTML = formatTime(longTime);
                longBreak.style.backgroundColor = "hsl(240, 9%, 82.5%)";
                pomodoro.style.backgroundColor = "#e0e0e5";
                startButton.style.display = "block";
                stopButton.style.display = "none";
            }
            else if (mode === 3) {
                numOfPomodoros = 0;
                console.log(numOfPomodoros);
                mode = 1;
                countdown.innerHTML = formatTime(defaultTime);
                longBreak.style.backgroundColor = "#e0e0e5";
                pomodoro.style.backgroundColor = "hsl(240, 9%, 82.5%)";
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
function switch1() {
    numOfPomodoros = 0;
    clearInterval(timer);
    mode = 1;
    countdown.innerHTML = formatTime(defaultTime);
    startButton.style.display = "block";
    stopButton.style.display = "none";
    pomodoro.style.backgroundColor = "hsl(240, 9%, 82.5%)";
    shortBreak.style.backgroundColor = "#e0e0e5";
    longBreak.style.backgroundColor = "#e0e0e5";
}
function switch2() {
    numOfPomodoros = 0;
    clearInterval(timer);
    mode = 2;
    countdown.innerHTML = formatTime(shortTime);
    startButton.style.display = "block";
    stopButton.style.display = "none";
    pomodoro.style.backgroundColor = "#e0e0e5";
    shortBreak.style.backgroundColor = "hsl(240, 9%, 82.5%)";
    longBreak.style.backgroundColor = "#e0e0e5";
}
function switch3() {
    numOfPomodoros = 0;
    clearInterval(timer);
    mode = 3;
    countdown.innerHTML = formatTime(longTime);
    startButton.style.display = "block";
    stopButton.style.display = "none";
    shortBreak.style.backgroundColor = "#e0e0e5";
    longBreak.style.backgroundColor = "hsl(240, 9%, 82.5%)";
    pomodoro.style.backgroundColor = "#e0e0e5";
}
