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
const pomodoroTimer = document.getElementById("settings-timer");
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
const almCheckmark = document.getElementById("almCheckmark");
const fontCheckmark = document.getElementById("fontCheckmark");
const noOfPomInput = document.getElementById("noofpom");
const pomsContainer = document.getElementById("poms");
const resetBtn = document.querySelector('#menuButtons button[title="Reset to Default"]');
// Simple audio setup: preload fixed sources on load
let pressSound = new Audio('https://github.com/maykbrito/automatic-video-creator/blob/master/audios/button-press.wav?raw=true');
let timerSound = new Audio('https://github.com/anthonyhuang07/PomodoPro/blob/main/assets/ringin.mp3?raw=true');
pressSound.preload = 'auto';
timerSound.preload = 'auto';
let defaultTime = 1500;
let shortTime = 300;
let longTime = 900;
let currentTime = -1;
let mode = 1; // 1 - Pomodoro | 2 - Short | 3 - Long 
let numOfPomodoros = 0;
let timer;
let resetConfirm = false;
let pomsBeforeLong = 4;
pressSound.volume = 0.5;
timerSound.volume = 0.5;
countdown.innerHTML = "Loading";
settings.style.display = "none";
setRandomBackgroundColor();
window.onload = () => {
    // Preload sounds once so they are ready when user interacts
    try {
        pressSound.load();
    }
    catch { }
    try {
        timerSound.load();
    }
    catch { }
    // Load persisted custom font if available
    const storedFontDataUrl = localStorage.getItem('customFontDataUrl');
    if (storedFontDataUrl) {
        try {
            const persistedFont = new FontFace('CustomFont', `url(${storedFontDataUrl})`);
            persistedFont.load().then(() => {
                document.fonts.add(persistedFont);
                countdown.style.fontFamily = 'CustomFont, sans-serif';
            }).catch(() => {
                // ignore font loading errors silently
            });
        }
        catch { }
    }
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
    const storedPomsBeforeLong = localStorage.getItem("pomsBeforeLong");
    if (storedPomsBeforeLong) {
        pomsBeforeLong = Math.max(1, parseInt(storedPomsBeforeLong));
    }
    if (noOfPomInput)
        noOfPomInput.value = String(pomsBeforeLong);
    renderPomDots(pomsBeforeLong);
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
            if (mode === 1 && numOfPomodoros !== (pomsBeforeLong - 1)) { // if was in Pomodoro Mode (go to Short)
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
            else if (mode === 2 && numOfPomodoros !== pomsBeforeLong) { // if was in Short Time Mode (return to Default)
                numOfPomodoros++;
                updatePomFill();
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
            else if (mode === 1 && numOfPomodoros === (pomsBeforeLong - 1)) { // if was in Pomodoro Mode (go to Long)
                numOfPomodoros++;
                updatePomFill();
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
                updatePomFill();
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
    numOfPomodoros = 0;
    updatePomFill();
    currentTime = -1;
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
    // Cancel any reset confirmation when toggling settings
    if (resetBtn) {
        resetConfirm = false;
        resetBtn.textContent = "Reset";
    }
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
    // First click asks for confirmation
    if (!resetConfirm) {
        if (resetBtn) {
            resetBtn.textContent = "Are you sure?";
        }
        resetConfirm = true;
        return;
    }
    // Second click: proceed with actual reset
    resetConfirm = false;
    if (resetBtn)
        resetBtn.textContent = "Reset";
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
    // Reset number of pomodoros before long break to default
    pomsBeforeLong = 4;
    if (noOfPomInput)
        noOfPomInput.value = String(pomsBeforeLong);
    localStorage.setItem("pomsBeforeLong", String(pomsBeforeLong));
    renderPomDots(pomsBeforeLong);
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
    countdown.style.fontFamily = "'Rubik', sans-serif";
    localStorage.removeItem('customFontDataUrl');
    localStorage.setItem("bgImageUrl", "");
    localStorage.setItem("defaultTime", defaultTime.toString());
    localStorage.setItem("shortTime", shortTime.toString());
    localStorage.setItem("longTime", longTime.toString());
}
function focusInput(inputId) {
    const input = document.getElementById(inputId);
    input.focus();
}
const imgCheckmark = document.getElementById("imgCheckmark");
imgInput.addEventListener('change', function () {
    if (imgInput.files[0]) {
        imgCheckmark.style.display = "inline";
    }
});
almSound.addEventListener('change', function () {
    if (almSound.files[0]) {
        almCheckmark.style.display = "inline";
    }
});
fontInput.addEventListener('change', function () {
    if (fontInput.files[0]) {
        fontCheckmark.style.display = "inline";
    }
});
form.addEventListener('submit', function (e) {
    e.preventDefault();
    imgCheckmark.style.display = "none";
    almCheckmark.style.display = "none";
    fontCheckmark.style.display = "none";
    chooseImg.innerHTML = "Upload Image";
    chooseAlmSound.innerHTML = "Upload Audio";
    chooseFont.innerHTML = "Upload Font";
    settings.style.display = "none";
    background.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    countdown.style.color = "rgba(255, 255, 255, 1)";
    startButton.style.display = "block";
    stopButton.style.display = "none";
    clearInterval(timer);
    // Cancel any pending reset confirmation on save
    if (resetBtn) {
        resetConfirm = false;
        resetBtn.textContent = "Reset";
    }
    currentTime = -1;
    defaultTime = (parseInt(pomoInput.value) * 60) + parseInt(pomoInputSec.value);
    shortTime = (parseInt(shortInput.value) * 60) + parseInt(shortInputSec.value);
    longTime = (parseInt(longInput.value) * 60) + parseInt(longInputSec.value);
    if (noOfPomInput) {
        const val = Math.max(1, parseInt(noOfPomInput.value || '4'));
        pomsBeforeLong = val;
        localStorage.setItem("pomsBeforeLong", String(pomsBeforeLong));
        renderPomDots(pomsBeforeLong);
    }
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
        timerSound.preload = 'auto';
        try {
            timerSound.load();
        }
        catch { }
    }
    if (fontInput.files[0]) {
        const file = fontInput.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            const fontUrl = reader.result;
            // persist font DataURL so we can use it later (including in PiP)
            try {
                localStorage.setItem('customFontDataUrl', fontUrl);
            }
            catch { }
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
    imgCheckmark.style.display = "none";
    almCheckmark.style.display = "none";
    fontCheckmark.style.display = "none";
    imgInput.value = ""; // Clear the uploaded image file from the input field
    almSound.value = ""; // Clear the uploaded audio file
    fontInput.value = ""; // Clear the uploaded font file
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
document.querySelectorAll('#menuButtons button').forEach(button => {
    button.addEventListener('click', function () {
        imgCheckmark.style.display = "none";
        almCheckmark.style.display = "none";
        fontCheckmark.style.display = "none";
    });
});
// ================= Document Picture-in-Picture (Pop-out) =================
let pipWin = null;
async function openPiP() {
    playSound();
    // Toggle close if already open
    if (pipWin && !pipWin.closed) {
        pipWin.close();
        pipWin = null;
        return;
    }
    const anyWindow = window;
    if (!anyWindow.documentPictureInPicture || !anyWindow.documentPictureInPicture.requestWindow) {
        alert('Pop-out is not supported in this browser.');
        return;
    }
    const win = await anyWindow.documentPictureInPicture.requestWindow({
        width: 360,
        height: 160
    });
    pipWin = win;
    // Minimal UI inside PiP window
    const d = win.document;
    // Ensure Rubik font is available in the PiP document (separate document does not inherit main page fonts)
    try {
        const link = d.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Rubik&display=swap';
        d.head.appendChild(link);
    }
    catch { }
    d.body.style.margin = '0';
    d.body.style.display = 'flex';
    d.body.style.alignItems = 'center';
    d.body.style.justifyContent = 'center';
    d.body.style.width = '100%';
    d.body.style.height = '100vh';
    // Mirror the main page's background (gradient or image) into the PiP window
    const mainBg = getComputedStyle(document.body);
    const bgImage = mainBg.backgroundImage;
    const bgSize = mainBg.backgroundSize;
    const bgPos = mainBg.backgroundPosition;
    const bgRepeat = mainBg.backgroundRepeat;
    const bgColor = mainBg.backgroundColor;
    if (bgImage && bgImage !== 'none') {
        // Layer a semi-transparent black overlay over whatever the main page uses
        d.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), ${bgImage}`;
        if (bgSize)
            d.body.style.backgroundSize = bgSize;
        if (bgPos)
            d.body.style.backgroundPosition = bgPos;
        if (bgRepeat)
            d.body.style.backgroundRepeat = bgRepeat;
    }
    else {
        // Fallback to main background color with overlay
        d.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25))`;
        d.body.style.backgroundColor = bgColor || 'rgba(0,0,0,0.25)';
    }
    d.body.style.color = '#fff';
    const h1 = d.createElement('h1');
    h1.id = 'pipCountdown';
    h1.textContent = countdown.textContent || '';
    h1.style.fontSize = 'clamp(32px, 30vw, 80vh)';
    h1.style.margin = '0';
    h1.style.textAlign = 'center';
    h1.style.fontFamily = getComputedStyle(countdown).fontFamily || 'Rubik, sans-serif';
    d.body.appendChild(h1);
    // If Rubik finishes loading in the PiP window, ensure it is applied
    try {
        if (d.fonts && d.fonts.ready) {
            d.fonts.ready.then(() => {
                // Keep CustomFont precedence if it loads later
                if (!h1.style.fontFamily.includes('CustomFont')) {
                    h1.style.fontFamily = `Rubik, ${h1.style.fontFamily || 'sans-serif'}`;
                }
            }).catch(() => { });
        }
    }
    catch { }
    // If a custom font was uploaded, load it into the PiP window as well
    try {
        const storedFontDataUrl = localStorage.getItem('customFontDataUrl');
        if (storedFontDataUrl) {
            const pipFont = new FontFace('CustomFont', `url(${storedFontDataUrl})`);
            pipFont.load().then(() => {
                d.fonts.add(pipFont);
                h1.style.fontFamily = 'CustomFont, sans-serif';
            }).catch(() => {
                // ignore font loading issues silently
            });
        }
    }
    catch { }
    // Clean up when user closes the PiP window
    win.addEventListener('pagehide', () => {
        pipWin = null;
    });
    // Initial sync
    updatePiP();
}
// Mirror countdown text into the PiP window (if open)
function updatePiP() {
    if (!pipWin || pipWin.closed)
        return;
    const el = pipWin.document.getElementById('pipCountdown');
    if (el)
        el.textContent = countdown.textContent || '';
}
// Observe countdown text changes and mirror automatically
const countdownObserver = new MutationObserver(() => updatePiP());
countdownObserver.observe(countdown, { childList: true });
// Expose for inline onclick usage
window.openPiP = openPiP;
// ----- Pomodoro dots rendering helpers -----
function renderPomDots(total) {
    if (!pomsContainer)
        return;
    pomsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'pom';
        dot.style.transition = 'background-color 0.25s';
        pomsContainer.appendChild(dot);
    }
    updatePomFill();
}
function updatePomFill() {
    if (!pomsContainer)
        return;
    const dots = Array.from(pomsContainer.querySelectorAll('.pom'));
    // Always show at least 1 filled dot as the starting state
    const fillCount = Math.min(dots.length, 1 + Math.max(0, numOfPomodoros));
    dots.forEach((d, idx) => {
        d.style.backgroundColor = idx < fillCount ? 'white' : 'rgba(0, 0, 0, 0.25)';
    });
}
// comment bc github is stupid
