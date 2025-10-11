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
  console.log('Loading sound effects...');
  
  // Clear existing cache
  Object.values(soundCache).forEach(audio => {
    try { audio.pause(); } catch (e) {}
  });
  Object.keys(soundCache).forEach(key => delete soundCache[key]);

  // Load all sound files
  soundFiles.forEach(soundFile => {
    try {
      console.log(`Loading sound: ${soundFile}`);
      const audio = new Audio(soundFile);
      audio.preload = 'auto';
      
      // Set initial volume based on settings
      const settings = loadAudioSettings();
      audio.volume = settings.volume;
      
      // Force preload
      audio.load();
      
      // Store in cache
      soundCache[soundFile] = audio;
      
      // Create a backup audio element for rapid replays
      const backupAudio = new Audio(soundFile);
      backupAudio.preload = 'auto';
      backupAudio.volume = settings.volume;
      backupAudio.load();
      soundCache[soundFile + '_backup'] = backupAudio;
      
      console.log(`Successfully loaded: ${soundFile}`);
    } catch (e) {
      console.warn(`Failed to load sound: ${soundFile}`, e);
    }
  });
  
  console.log('Sound loading complete.');
}

function playSound(soundFile) {
  try {
    console.log(`Attempting to play: ${soundFile}`);
    
    // Get current settings
    const settings = loadAudioSettings();
    if (settings.muted) {
      console.log('Sound muted, skipping playback');
      return;
    }
    
    // Try to get the sound from cache
    let audio = soundCache[soundFile];
    let backupAudio = soundCache[soundFile + '_backup'];
    
    // If either is missing, try to reload
    if (!audio || !backupAudio) {
      console.log(`Reloading missing sound: ${soundFile}`);
      audio = new Audio(soundFile);
      backupAudio = new Audio(soundFile);
      audio.preload = backupAudio.preload = 'auto';
      audio.volume = backupAudio.volume = settings.volume;
      audio.load();
      backupAudio.load();
      soundCache[soundFile] = audio;
      soundCache[soundFile + '_backup'] = backupAudio;
    }
    
    // Update volumes
    audio.volume = backupAudio.volume = settings.volume;
    
    // Try to play the main audio
    audio.currentTime = 0;
    const playPromise = audio.play();
    
    if (playPromise) {
      playPromise.catch(e => {
        console.warn(`Main audio failed, trying backup for: ${soundFile}`);
        // If main fails, try backup
        backupAudio.currentTime = 0;
        backupAudio.play().catch(e2 => {
          console.warn(`Both audio attempts failed for: ${soundFile}`);
          // If both fail, try to reload the sound
          delete soundCache[soundFile];
          delete soundCache[soundFile + '_backup'];
          loadSounds();
        });
      });
    }
  } catch (e) {
    console.warn(`Error playing sound: ${soundFile}`, e);
    // Try to recover by reloading sounds
    loadSounds();
  }
}
