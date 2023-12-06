const restart = document.querySelector('.restart');
const video = document.querySelector('video');
const timers = [];
const screenId = `scID_${generateScreenID()}`;

function screenList() {
  return Object.entries(window.localStorage)
    .filter(([key]) => key.startsWith('scID_'))
    .map(([key, value]) => [key, JSON.parse(value)]);
}

function generateScreenID() {
  const existingScreens = Object.keys(window.localStorage)
    .filter((key) => key.startsWith('scID_'))
    .map((key) => parseInt(key.replace('scID_', '')))
    .sort((a, b) => a - b);
  return existingScreens.at(-1) + 1 || 1;
}

function screenPosition() {
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

function removeScreen() {
  const screens = screenList();
  for (const [key, screen] of screens) {
    if (Date.now() - screen.updated > 1000) {
      localStorage.removeItem(key);
    }
  }
}

function camSplitter() {
  video?.setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
  const screens = screenList();
  screens.map(([key, screen], i) => {
    const x = screen.screenX + screen.width / 2;
    const y = screen.screenY + screen.height / 2;
    return [key, { ...screen, x, y }];
  });
}

function main() {
  initialize();
  timers.push(setInterval(screenPosition, 10));
  timers.push(setInterval(removeScreen, 100));
  timers.push(setInterval(camSplitter, 10));
}

restart?.addEventListener('click', restartCam);
window.addEventListener('beforeunload', () => {
  localStorage.removeItem(screenId);
});

function initialize() {
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    if (!video) return;
    video.width = window.screen.availWidth;
    video.height = window.screen.availHeight;
    video.srcObject = stream;
    video.play();
  });
}

main();