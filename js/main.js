// main.js
// Initialize Game
function init() {
  // Don't override body class - let each page set its own background
  // document.body.className = 'home'; // Removed - let HTML files set their own body class
  loadSounds();
  loadGame();
  updateUI();
  updateServerTime();
  setInterval(updateServerTime, 1000);
  renderAllSections();
  initMusic();
}

// Save/Load Game
function saveGame() {
  try {
    localStorage.setItem("familiarGameSave", JSON.stringify(gameState));
  } catch (e) {
    console.warn('Save failed', e);
  }
}

function loadGame() {
  let saved = localStorage.getItem("familiarGameSave");
  let isNewSave = true;

  if (!saved) {
    saved = localStorage.getItem("petGameSave");
    isNewSave = false;
  }

  if (saved) {
    try {
      let savedGameState = JSON.parse(saved);

      // One-time migration from old save
      if (!isNewSave) {
        if (savedGameState.pets) {
          savedGameState.familiars = savedGameState.pets;
          delete savedGameState.pets;
        }
        if (savedGameState.activities && savedGameState.activities.catching) {
          savedGameState.activities.enchanting = savedGameState.activities.catching;
          delete savedGameState.activities.catching;
        }
      }

      // Ensure activities keys exist
      const requiredActivities = ['foraging','mining','fishing','catching','enchanting'];
      if (!savedGameState.activities) savedGameState.activities = {};
      // Activity durations in milliseconds
      const activityDurations = {
        foraging: 3000,  // 30 seconds
        mining: 4500,    // 45 seconds
        fishing: 6000,   // 1 minute
        catching: 3000,  // 30 seconds
        enchanting: 4500 // 45 seconds
      };

      requiredActivities.forEach(a => {
        if (!Object.prototype.hasOwnProperty.call(savedGameState.activities, a)) {
          savedGameState.activities[a] = { 
            active: false, 
            progress: 0,
            duration: activityDurations[a] 
          };
        } else {
          // Ensure duration is set for existing activities
          savedGameState.activities[a].duration = activityDurations[a];
          // Clean up any stalled activities
          if (savedGameState.activities[a].active) {
            const now = Date.now();
            if (!savedGameState.activities[a].endTime || now >= savedGameState.activities[a].endTime) {
              savedGameState.activities[a].active = false;
              savedGameState.activities[a].progress = 0;
              delete savedGameState.activities[a].startTime;
              delete savedGameState.activities[a].endTime;
              if (savedGameState.activities[a].intervalId) {
                clearInterval(savedGameState.activities[a].intervalId);
                delete savedGameState.activities[a].intervalId;
              }
            }
          }
        }
      });

      gameState = { ...gameState, ...savedGameState };
    } catch (e) {
      console.warn('Failed to parse save data', e);
    }
  }
}

// Initialize game when page loads
// Background music handling (loop across pages)
function initMusic() {
  const bgMusic = document.getElementById('bg-music');
  if (!bgMusic) return;
  
  bgMusic.loop = true;
  
  // Apply saved settings
  applyAudioSettings();
  
  // Create settings dropdown
  createSettingsDropdown();
  
  // Try to play
  bgMusic.play().catch(() => {
    const startOnce = () => {
      bgMusic.play().catch(()=>{});
      window.removeEventListener('pointerdown', startOnce);
      window.removeEventListener('keydown', startOnce);
    };
    window.addEventListener('pointerdown', startOnce, { once: true });
    window.addEventListener('keydown', startOnce, { once: true });
  });
}

function toggleMute() {
  const settings = loadAudioSettings();
  settings.muted = !settings.muted;
  saveAudioSettings(settings);
  applyAudioSettings();
}

function updateVolume(value) {
  const settings = loadAudioSettings();
  settings.volume = parseFloat(value);
  saveAudioSettings(settings);
  applyAudioSettings();
}

function clearSave() {
  localStorage.removeItem("familiarGameSave");
  localStorage.removeItem("petGameSave");
  location.reload();
}

// Try to resume audio context on user gesture (for WebAudio)
document.addEventListener('pointerdown', () => {
  if (typeof AudioContext !== 'undefined' && window._audioCtx && window._audioCtx.state === 'suspended') {
    window._audioCtx.resume().catch(()=>{});
  }
}, { once: true });

init();
