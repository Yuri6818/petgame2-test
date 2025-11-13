// Game state type definition
interface GameState {
  coins: number;
  dust: number;
  playerLevel: number;
  playerXP: number;
  familiars: Array<Record<string, unknown>>;
  inventory: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

declare global {
  interface Window {
    toggleMute?: () => void;
    clearSave?: () => void;
    claimDaily?: () => void;
    updateUI?: () => void;
    gameState?: GameState;
    [key: string]: unknown;
  }
}

export {};
