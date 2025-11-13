// This file exposes legacy game functions to the window for compatibility
// As the app migrates to React, these will be moved into proper module imports

// Placeholder for game state
export const gameState: Record<string, unknown> = {
  coins: 150,
  dust: 25,
  playerLevel: 1,
  playerXP: 0,
  familiars: [],
  inventory: [],
  activities: {},
  achievements: {},
};

// Placeholder functions - replace with actual implementations
export function updateUI() {
  console.log("updateUI called");
  const coinEl = document.getElementById("coinCount");
  const dustEl = document.getElementById("dustCount");
  const levelEl = document.getElementById("playerLevel");
  const xpEl = document.getElementById("playerXP");

  if (coinEl)
    coinEl.textContent = (gameState.coins as number)?.toString() || "150";
  if (dustEl)
    dustEl.textContent = (gameState.dust as number)?.toString() || "25";
  if (levelEl)
    levelEl.textContent = (gameState.playerLevel as number)?.toString() || "1";
  if (xpEl)
    xpEl.textContent = (gameState.playerXP as number)?.toString() || "0";
}

export function claimDaily() {
  console.log("claimDaily called");
  gameState.coins = ((gameState.coins as number) || 150) + 50;
  updateUI();
}

export function toggleMute() {
  console.log("toggleMute called");
  const music = document.getElementById("bg-music") as HTMLAudioElement;
  if (music) {
    music.muted = !music.muted;
  }
}

export function clearSave() {
  if (confirm("Are you sure you want to clear your save?")) {
    localStorage.removeItem("familiarGameSave");
    location.reload();
  }
}

export function updateServerTime() {
  const el = document.getElementById("serverTime");
  if (el) {
    const now = new Date();
    el.textContent = now.toLocaleTimeString();
  }
}

// Expose to window for legacy script compatibility
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.gameState = gameState;
  w.updateUI = updateUI;
  w.claimDaily = claimDaily;
  w.toggleMute = toggleMute;
  w.clearSave = clearSave;
  w.updateServerTime = updateServerTime;
}
