// A lightweight worker that keeps accurate time based on an absolute deadline
// and posts a tick whenever the whole remaining seconds value changes.

let intervalId = null;
let deadlineMs = 0;
let lastRemaining = null;

function clearTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  lastRemaining = null;
}

function start(deadline) {
  clearTimer();
  deadlineMs = deadline;

  // Check frequently but cheaply; compute remaining based on Date.now() so
  // it stays accurate even if the tab is throttled or the system sleeps.
  intervalId = setInterval(() => {
    const now = Date.now();
    let remaining = Math.ceil((deadlineMs - now) / 1000);
    if (remaining < 0) remaining = 0;

    if (remaining !== lastRemaining) {
      lastRemaining = remaining;
      postMessage({ type: 'tick', remaining });
    }

    if (remaining === 0) {
      postMessage({ type: 'done' });
      clearTimer();
    }
  }, 200);
}

onmessage = (e) => {
  const { type } = e.data || {};
  switch (type) {
    case 'start':
      // Expect e.data.deadlineMs (epoch ms)
      start(e.data.deadlineMs);
      break;
    case 'stop':
      clearTimer();
      break;
    case 'ping':
      postMessage({ type: 'pong' });
      break;
  }
};
