const countdown = document.getElementById("countdown") as HTMLInputElement;

const startButton = document.getElementById("start") as HTMLInputElement;
const stopButton = document.getElementById("stop") as HTMLInputElement;

const pomodoro = document.getElementById("pomodoro") as HTMLInputElement;
const shortBreak = document.getElementById("short") as HTMLInputElement;
const longBreak = document.getElementById("long") as HTMLInputElement;

let defaultTime = 1;
let shortTime = 1;
let longTime = 3;
let mode = 1 // 1 - Pomodoro | 2 - Short | 3 - Long 
let numOfPomodoros = 0;
countdown.innerHTML = formatTime(defaultTime);

let timer: number;

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function letsGo() {
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

function startTimer(timeType: number) {
  console.log(numOfPomodoros)
  startButton.style.display = "none";
  stopButton.style.display = "block";
  timer = setInterval(() => {
    timeType--;
    countdown.innerHTML = formatTime(timeType);
    document.title = formatTime(timeType) + " - Pomodiddily";

    if (timeType === 0) {
      clearInterval(timer);
      defaultTime = 1
      shortTime = 1
      longTime = 3
      numOfPomodoros++
      if (mode === 1 && ((numOfPomodoros % 7) !== 0)) {
        mode = 2;
        countdown.innerHTML = formatTime(shortTime);
        pomodoro.style.backgroundColor = "lightgray";
        shortBreak.style.backgroundColor = "green";
        startButton.style.display = "block";
        stopButton.style.display = "none";
      } else if (mode === 2 && ((numOfPomodoros % 7) !== 0)) {
        mode = 1;
        countdown.innerHTML = formatTime(defaultTime);
        pomodoro.style.backgroundColor = "green";
        shortBreak.style.backgroundColor = "lightgray";
        startButton.style.display = "block";
        stopButton.style.display = "none";
      } else if (mode === 1 && ((numOfPomodoros % 7) === 0)){
        mode = 3;
        countdown.innerHTML = formatTime(longTime);
        longBreak.style.backgroundColor = "green";
        pomodoro.style.backgroundColor = "lightgray";
        startButton.style.display = "block";
        stopButton.style.display = "none";
      }
    }
  }, 1000);
}

function stopTimer() {
  startButton.style.display = "block";
  stopButton.style.display = "none";
  clearInterval(timer)
}



