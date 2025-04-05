let timer;
let timeLeft = 1500; // 25 minutes
let breakDuration = 300; // 5 minutes
let isBreakMode = false;
let running = false;
let soundOn = true;

const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const progressBar = document.getElementById('progress-bar');
const beep = document.getElementById('beep');

function updateTimerDisplay() {
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${mins}:${secs}`;
}

function updateProgressBar() {
  const total = isBreakMode ? breakDuration : 1500;
  const progress = Math.floor(((total - timeLeft) / total) * 25);
  const bar = '[' + '='.repeat(progress) + '-'.repeat(25 - progress) + ']';
  progressBar.textContent = bar;
}

function updateStatus(text) {
  statusDisplay.classList.remove('typewriter');
  void statusDisplay.offsetWidth; // force reflow
  statusDisplay.textContent = text;
  statusDisplay.classList.add('typewriter');
}

function startBreak() {
  isBreakMode = true;
  timeLeft = breakDuration;
  updateTimerDisplay();
  updateProgressBar();
  updateStatus('break time...');
  timer = setInterval(tick, 1000);
}

function startWork() {
  isBreakMode = false;
  timeLeft = 1500;
  updateTimerDisplay();
  updateProgressBar();
  updateStatus('focus...');
  timer = setInterval(tick, 1000);
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimerDisplay();
    updateProgressBar();
  } else {
    clearInterval(timer);
    if (soundOn) {
      beep.currentTime = 0;
      beep.play();
    }
    
    if (!isBreakMode) {
      startBreak();
    } else {
      running = false;
      updateStatus('session complete');
    }
  }
}

document.getElementById('start').addEventListener('click', () => {
  if (!running) {
    startWork();
    running = true;
  }
});

document.getElementById('reset').addEventListener('click', () => {
  clearInterval(timer);
  running = false;
  isBreakMode = false;
  timeLeft = 1500;
  updateTimerDisplay();
  updateProgressBar();
  updateStatus('idle');
});

document.getElementById('sound-toggle').addEventListener('click', () => {
  soundOn = !soundOn;
  document.getElementById('sound-toggle').textContent = `SOUND: ${soundOn ? 'ON' : 'OFF'}`;
});

// Break duration controls
function updateBreakDuration(minutes) {
  if (!running) {
    breakDuration = Math.max(60, Math.min(3600, breakDuration + (minutes * 60)));
    const breakMinutes = Math.floor(breakDuration / 60);
    document.getElementById('break-duration').textContent = breakMinutes;
    updateStatus(`break duration: ${breakMinutes}min`);
    if (isBreakMode) {
      timeLeft = breakDuration;
      updateTimerDisplay();
      updateProgressBar();
    }
  }
}

document.getElementById('break-decrease').addEventListener('click', () => updateBreakDuration(-1));
document.getElementById('break-increase').addEventListener('click', () => updateBreakDuration(1));

document.getElementById('break-input').addEventListener('change', (e) => {
  if (!running) {
    const newDuration = Math.max(1, Math.min(60, parseInt(e.target.value) || 5));
    breakDuration = newDuration * 60;
    e.target.value = newDuration;
    updateStatus(`break duration: ${newDuration}min`);
    if (isBreakMode) {
      timeLeft = breakDuration;
      updateTimerDisplay();
      updateProgressBar();
    }
  }
});

// Init display
updateTimerDisplay();
updateProgressBar();
