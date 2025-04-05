let timer;
let timeLeft = 1500; // 25 minutes
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
  const total = 1500;
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

function tick() {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
      updateProgressBar();
    } else {
      clearInterval(timer);
      running = false;
      updateStatus('done');
  
      if (soundOn) {
        beep.currentTime = 0;
        beep.play();
      }
    }
  }  

document.getElementById('start').addEventListener('click', () => {
  if (!running) {
    timer = setInterval(tick, 1000);
    running = true;
    updateStatus('focus...');
  }
});

document.getElementById('reset').addEventListener('click', () => {
  clearInterval(timer);
  running = false;
  timeLeft = 1500;
  updateTimerDisplay();
  updateProgressBar();
  updateStatus('idle');
});

document.getElementById('sound-toggle').addEventListener('click', () => {
  soundOn = !soundOn;
  document.getElementById('sound-toggle').textContent = `SOUND: ${soundOn ? 'ON' : 'OFF'}`;
});

// Init display
updateTimerDisplay();
updateProgressBar();
