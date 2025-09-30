// main.js
// Initialize Game
function init() {
  document.body.className = 'home'; // Set initial background
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

      // Don't load familiars from save, to force using the ones from data.js
      delete savedGameState.familiars;

      // Ensure activities keys exist
      const requiredActivities = ['foraging','mining','fishing','catching','enchanting'];
      if (!savedGameState.activities) savedGameState.activities = {};
      requiredActivities.forEach(a => {
        if (!Object.prototype.hasOwnProperty.call(savedGameState.activities, a)) {
          savedGameState.activities[a] = { active: false, progress: 0 };
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
const bgMusic = document.getElementById('bg-music');
let musicMuted = false;

function initMusic() {
  if (!bgMusic) return;
  bgMusic.loop = true;
  bgMusic.volume = 0.35;
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
  if (!bgMusic) return;
  musicMuted = !musicMuted;
  bgMusic.muted = musicMuted;
  const btn = document.getElementById('mute-btn');
  if (btn) btn.textContent = musicMuted ? 'Unmute' : 'Mute';
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
