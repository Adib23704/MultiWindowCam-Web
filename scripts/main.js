const restart = document.querySelector('.restart');
const video = document.querySelector('video');
const timers = [];

function screenList() {
  return Object.entries(window.localStorage)
    .filter(([key]) => key.startsWith('scID_'))
    .map(([key, value]) => [key, JSON.parse(value)]);
}

function uniqueScreenID() {
  const existingScreens = Object.keys(window.localStorage)
    .filter((key) => key.startsWith('scID_'))
    .map((key) => parseInt(key.replace('scID_', '')))
    .sort((a, b) => a - b);
  return existingScreens.at(-1) + 1 || 1;
}

const screenId = `scID_${uniqueScreenID()}`;

function screenPositions() {
  const windowDetails = {
    screenX: window.screenX,
    screenY: window.screenY,
    screenWidth: window.screen.availWidth,
    screenHeight: window.screen.availHeight,
    width: window.outerWidth,
    height: window.innerHeight,
    updated: Date.now(),
  };
  window.localStorage.setItem(screenId, JSON.stringify(windowDetails));
}

function restartCam() {
  timers.forEach((timer) => window.clearInterval(timer));
  window.localStorage.clear();
  setTimeout(() => window.location.reload(), Math.random() * 1000);
}

function resetCam() {
  localStorage.removeItem(screenId);
}

function removeCam() {
  const screens = screenList();
  for (const [key, screen] of screens) {
    if (Date.now() - screen.updated > 1000) {
      localStorage.removeItem(key);
    }
  }
}

function main() {
  timers.push(setInterval(screenPositions, 10));
  timers.push(setInterval(removeCam, 100));
}

restart?.addEventListener('click', restartCam);
window.addEventListener('beforeunload', resetCam);

function CameraInit() {
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    if (!video) return;
    video.width = window.screen.availWidth;
    video.height = window.screen.availHeight;
    video.srcObject = stream;
    video.play();
  });
}

main();
CameraInit();