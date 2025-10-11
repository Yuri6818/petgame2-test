// battle.js
let battleState = {
  playerFamiliar: null,
  opponentFamiliar: null,
  turn: 'player',
  log: [],
  timeoutId: null,
  itemMenuOpen: false
};

// Initialize battle if we're on the battle page and have a familiar ID in the URL
window.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();
  const isBattlePage = path.includes("battle.html");
  
  if (isBattlePage) {
    // Check for familiar ID in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const familiarId = urlParams.get('familiar');
    
    if (familiarId && gameState.familiars.length > 0) {
      // Convert to number if it's a string
      const id = parseInt(familiarId);
      if (!isNaN(id)) {
        startBattle(id);
      }
    }
  }
});

function startBattle(familiarId) {
  // Check if we're on the battle page - if not, navigate there first
  const path = window.location.pathname.toLowerCase();
  const isBattlePage = path.includes("battle.html");
  
  if (!isBattlePage) {
    // Navigate to battle page and pass the familiar ID
    window.location.href = `battle.html?familiar=${familiarId}`;
    return;
  }

  const playerFamiliar = gameState.familiars.find(f => f.id === familiarId);
  if (!playerFamiliar) {
    showNotification('Selected familiar not found for battle.');
    return;
  }
  const opponentFamiliar = opponents[Math.floor(Math.random() * opponents.length)];

  battleState.playerFamiliar = { ...playerFamiliar, currentHp: Number(playerFamiliar.hp) || 50, id: playerFamiliar.id };
  battleState.opponentFamiliar = { ...opponentFamiliar, currentHp: Number(opponentFamiliar.hp) || 50 };
  battleState.log = [];

  showSection('battle');
  renderBattle();
  logBattle(`A wild ${opponentFamiliar.name} appeared!`);
  // ensure actions visible
  const battleActionsEl = document.getElementById('battle-actions');
  if (battleActionsEl) battleActionsEl.style.display = 'flex';
}

function renderBattle() {
  const playerFamiliarEl = document.getElementById('player-familiar');
  const opponentFamiliarEl = document.getElementById('opponent-familiar');

  const player = battleState.playerFamiliar || {};
  const opponent = battleState.opponentFamiliar || {};

  const playerImg = getImageSrc(player);
  const opponentImg = getImageSrc(opponent);

  const playerHp = Number(player.hp) || 1;
  const opponentHp = Number(opponent.hp) || 1;
  const playerCurrent = Number(player.currentHp) || 0;
  const opponentCurrent = Number(opponent.currentHp) || 0;

  const playerHealthPercent = Math.max(0, Math.min(100, (playerCurrent / playerHp) * 100));
  const opponentHealthPercent = Math.max(0, Math.min(100, (opponentCurrent / opponentHp) * 100));

  if (playerFamiliarEl) {
    playerFamiliarEl.innerHTML = `
      <h3>${player.name || 'Unknown'}</h3>
  <img src="${playerImg}" onerror="this.onerror=null;this.src='img/familiars/familiars.png'">
      <p>HP: ${playerCurrent} / ${playerHp}</p>
      <div class="health-bar"><div class="health-bar-fill" style="width: ${playerHealthPercent}%;"></div></div>
    `;
  }

  if (opponentFamiliarEl) {
    opponentFamiliarEl.innerHTML = `
      <h3>${opponent.name || 'Unknown'}</h3>
  <img src="${opponentImg}" alt="${opponent.name || 'opponent'}" onerror="this.onerror=null;this.src='img/familiars/familiars.png'">
      <p>HP: ${opponentCurrent} / ${opponentHp}</p>
      <div class="health-bar"><div class="health-bar-fill" style="width: ${opponentHealthPercent}%;"></div></div>
    `;
  }
}

function logBattle(message) {
  const battleLogEl = document.getElementById('battle-log');
  if (!battleLogEl) return;
  const ts = new Date().toLocaleTimeString();
  const entry = `[${ts}] ${message}`;
  const p = document.createElement('div');
  p.textContent = entry;
  battleLogEl.appendChild(p);
  battleLogEl.scrollTop = battleLogEl.scrollHeight;
}

function showItemMenu() {
  const itemMenu = document.getElementById('item-menu');
  const battleActions = document.getElementById('battle-actions');
  
  // Get consumable items from inventory
  const consumables = gameState.inventory.filter(item => 
    item.type === 'consumable' && item.quantity > 0
  );
  
  // Render items
  const itemsContainer = itemMenu.querySelector('.battle-items');
  itemsContainer.innerHTML = consumables.map(item => `
    <div class="battle-item" onclick="useItem(${item.id})">
      <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px;">
      <span>${item.name} (${item.quantity})</span>
    </div>
  `).join('');
  
  battleActions.style.display = 'none';
  itemMenu.style.display = 'block';
  battleState.itemMenuOpen = true;
}

function hideItemMenu() {
  const itemMenu = document.getElementById('item-menu');
  const battleActions = document.getElementById('battle-actions');
  
  itemMenu.style.display = 'none';
  battleActions.style.display = 'flex';
  battleState.itemMenuOpen = false;
}

function useItem(itemId) {
  const item = gameState.inventory.find(i => i.id === itemId);
  if (!item || item.quantity <= 0) return;

  let used = false;
  const player = battleState.playerFamiliar;

  if (item.name.toLowerCase().includes('health potion')) {
    // Health potion heals for 20 HP
    const healAmount = 20;
    const maxHp = Number(player.hp);
    const currentHp = Number(player.currentHp);
    
    if (currentHp < maxHp) {
      player.currentHp = Math.min(maxHp, currentHp + healAmount);
      logBattle(`Used ${item.name}! ${player.name} recovered ${healAmount} HP!`);
      used = true;
    } else {
      logBattle(`${player.name} already has full HP!`);
      return; // Don't consume the item if HP is full
    }
  }

  if (used) {
    // Consume the item
    item.quantity--;
    saveGame();
    hideItemMenu();
    renderBattle();
    // End turn
    battleState.turn = 'opponent';
    battleState.timeoutId = setTimeout(opponentTurn, 900);
  }
}

function battleAction(action) {
  if (battleState.turn === 'player') {
    if (action === 'items') {
      showItemMenu();
    } else {
      playerTurn(action);
    }
  }
}

function playerTurn(action) {
  const player = battleState.playerFamiliar;
  const opponent = battleState.opponentFamiliar;

  if (!player) {
    console.error("Error: 'player' is null. Cannot act.");
    return;
  }

  player.isDefending = false;

  switch (action) {
    case 'attack':
      playSound('sounds/attack.ogg');
      const damage = calculateDamage(player, opponent);
      opponent.currentHp = Math.max(0, opponent.currentHp - damage);
      logBattle(`${player.name} attacks ${opponent.name} for ${damage} damage!`);
      // visual hit + slash effect on opponent element
      const oppEl = document.getElementById('opponent-familiar');
      if (oppEl) {
        oppEl.classList.add('hit', 'shake');
  showSlash(oppEl);
        setTimeout(() => oppEl.classList.remove('hit', 'shake'), 500);
      }
      break;
    case 'defend':
      playSound('sounds/defend.wav');
      player.isDefending = true;
      logBattle(`${player.name} is defending!`);
      break;
    case 'run':
      logBattle(`You fled from the battle!`);
      endBattle('run');
      return;
  }

  renderBattle();
  battleState.turn = 'opponent';
  battleState.timeoutId = setTimeout(opponentTurn, 900);
  checkWinner();
}

function opponentTurn() {
  const player = battleState.playerFamiliar;
  const opponent = battleState.opponentFamiliar;

  if (!player || !opponent) {
    console.error("Player or opponent familiar is null. Cannot proceed with the turn.");
    return;
  }

  playSound('sounds/attack.ogg');
  const damage = calculateDamage(opponent, player);
  player.currentHp = Math.max(0, player.currentHp - damage);
  logBattle(`${opponent.name} attacks ${player.name} for ${damage} damage!`);
  const playerEl = document.getElementById('player-familiar');
  if (playerEl) {
    playerEl.classList.add('hit', 'shake');
  showSlash(playerEl);
    setTimeout(() => playerEl.classList.remove('hit', 'shake'), 500);
  }

  renderBattle();
  battleState.turn = 'player';
  checkWinner();
}

function calculateDamage(attacker, defender) {
  const atk = Number(attacker?.attack) || 0;
  let def = Number(defender?.defense) || 0;
  if (defender && defender.isDefending) {
    def *= 1.5;
  }
  const raw = atk - def;
  const damage = Math.max(1, Math.round(raw || 1));
  return damage;
}

function checkWinner() {
  const player = battleState.playerFamiliar;
  const opponent = battleState.opponentFamiliar;

  if (!player || !opponent) return;

  if (player.currentHp <= 0) {
    endBattle('lose');
  } else if (opponent.currentHp <= 0) {
    endBattle('win');
  }
}

function endBattle(result) {
  if (battleState.timeoutId) {
    clearTimeout(battleState.timeoutId);
  }

  const battleActionsEl = document.getElementById('battle-actions');
  if (battleActionsEl) battleActionsEl.style.display = 'none';

  if (result === 'win') {
    playSound('sounds/win.wav');
    logBattle(`You defeated ${battleState.opponentFamiliar.name}!`);
    
    // Calculate XP based on opponent's level and stats
    const opponentTotal = (battleState.opponentFamiliar.attack || 0) + 
                         (battleState.opponentFamiliar.defense || 0) + 
                         (battleState.opponentFamiliar.speed || 0);
    const xpGained = Math.floor((battleState.opponentFamiliar.level || 1) * 10 + opponentTotal * 0.5);
    
    // Award XP to player
    gainXP(xpGained);
    
    // Find and update the familiar
    const familiar = gameState.familiars.find(f => f.id === battleState.playerFamiliar.id);
    if (familiar) {
      // Award familiar XP
      familiar.xp = (familiar.xp || 0) + xpGained;
      logBattle(`${familiar.name} gained ${xpGained} XP!`);
      
      // Try to level up (might level multiple times if enough XP)
      levelUpFamiliar(familiar);
      
      // Ensure changes are saved and displayed
      saveGame();
      renderFamiliars();
    }

    showNotification(`You and your familiar gained ${xpGained} XP!`);
    celebrate();
  } else if (result === 'lose') {
    playSound('sounds/lose.wav');
    logBattle(`You were defeated by ${battleState.opponentFamiliar.name}...`);
    showNotification(`You lost the battle...`);
  } else if (result === 'run') {
    showNotification('You escaped the battle.');
  }

  // reset state
  battleState = {
    playerFamiliar: null,
    opponentFamiliar: null,
    turn: 'player',
    log: [],
    timeoutId: null
  };

  setTimeout(() => {
    // Navigate to familiars page instead of just changing section
    window.location.href = 'familiars.html';
  }, 1400);
}
