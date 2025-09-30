// sound.js
const soundCache = {};

const soundFiles = [
  'sounds/attack.ogg',
  'sounds/defend.wav',
  'sounds/lose.wav',
  'sounds/win.wav'
];

function loadSounds() {
  soundFiles.forEach(soundFile => {
    const audio = new Audio(soundFile);
    audio.preload = 'auto';
    soundCache[soundFile] = audio;
  });
}

function playSound(soundFile) {
  if (soundCache[soundFile]) {
    soundCache[soundFile].currentTime = 0;
    soundCache[soundFile].play().catch(e => console.warn(`Could not play sound: ${soundFile}`, e));
  } else {
    console.warn(`Sound not found: ${soundFile}`);
  }
}
