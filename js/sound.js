// sound.js
const soundCache = {};
const SETTINGS_KEY = 'audioSettings';

const soundFiles = [
  'sounds/attack.ogg',
  'sounds/defend.wav',
  'sounds/lose.wav',
  'sounds/win.wav'
];

// Audio settings management
function loadAudioSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return { muted: false, volume: 0.35 };
}

function saveAudioSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
}

function applyAudioSettings() {
  const settings = loadAudioSettings();
  const bgMusic = document.getElementById('bg-music');
  if (bgMusic) {
    bgMusic.volume = settings.volume;
    bgMusic.muted = settings.muted;
  }
  updateSettingsDisplay();
}

function updateSettingsDisplay() {
  const settings = loadAudioSettings();
  const dropdown = document.getElementById('settings-dropdown');
  if (dropdown) {
    const volumeInput = dropdown.querySelector('input[type="range"]');
    if (volumeInput) volumeInput.value = settings.volume;
    
    const muteBtn = dropdown.querySelector('.mute-toggle');
    if (muteBtn) muteBtn.textContent = settings.muted ? 'Unmute' : 'Mute';
  }
}

function createSettingsDropdown() {
  const settings = loadAudioSettings();
  const btn = document.getElementById('mute-btn');
  if (!btn) return;

  // Replace mute button with settings dropdown
  btn.id = 'settings-btn';
  btn.textContent = 'Settings';
  
  const dropdown = document.createElement('div');
  dropdown.id = 'settings-dropdown';
  dropdown.className = 'settings-dropdown';
  dropdown.style.display = 'none';
  dropdown.innerHTML = `
    <div class="settings-item">
      <button class="mute-toggle" onclick="toggleMute()">${settings.muted ? 'Unmute' : 'Mute'}</button>
    </div>
    <div class="settings-item">
      <label>Volume</label>
      <input type="range" min="0" max="1" step="0.01" value="${settings.volume}" 
             onchange="updateVolume(this.value)" style="width: 100px">
    </div>
  `;
  
  btn.parentNode.insertBefore(dropdown, btn.nextSibling);
  
  // Toggle dropdown on settings button click
  btn.onclick = (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  };
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn) {
      dropdown.style.display = 'none';
    }
  });
}

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
