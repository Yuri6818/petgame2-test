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
  // Support both legacy filenames (battle.html) and Vercel/clean URLs (/battle)
  const isBattlePage = /(?:\b|\/)battle(?:\.html)?(?:\b|\/)?$/.test(path) || path.includes('/battle');
  
  if (isBattlePage) {
    // Ensure saved game is loaded (defensive - loadGame is defined in main.js)
    try { if (typeof loadGame === 'function') loadGame(); } catch (e) { /* ignore */ }
    try { if (typeof updateUI === 'function') updateUI(); } catch (e) { /* ignore */ }

    // Check for familiar ID in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const familiarId = urlParams.get('familiar');

    if (familiarId) {
      // Convert to number if it's a string
      const id = parseInt(familiarId);
      // Defensive: ensure fam list available by loading game if empty
      if ((!(gameState && gameState.familiars && gameState.familiars.length > 0)) && typeof loadGame === 'function') {
        try { loadGame(); } catch (e) {}
      }
      if (!isNaN(id)) {
        startBattle(id);
      }
    }
  }
});

function startBattle(familiarId) {
  // Check if we're on the battle page - if not, navigate there first
  const path = window.location.pathname.toLowerCase();
  // Support both legacy filenames (battle.html) and Vercel/clean URLs (/battle)
  const isBattlePage = /(?:\b|\/)battle(?:\.html)?(?:\b|\/)?$/.test(path) || path.includes('/battle');
  
  if (!isBattlePage) {
    // Navigate to battle page and pass the familiar ID
    window.location.href = `battle.html?familiar=${familiarId}`;
    return;
  }

  const playerFamiliar = (gameState.familiars || []).find(f => Number(f.id) === Number(familiarId));
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
  
  // Get all usable items from inventory
  const usableItems = gameState.inventory.filter(item => {
    if (!item || item.quantity <= 0) return false;
    
    // Check if item has a valid effect
    if (!item.effect) return false;
    
    // Allow healing items, battle buffs and XP items
    return item.effect.type === 'heal' || 
           (item.effect.type === 'buff' && item.effect.duration) ||
           item.effect.type === 'xp';
  });
  
  // Render items with descriptions
  const itemsContainer = itemMenu.querySelector('.battle-items');
  itemsContainer.innerHTML = usableItems.map(item => `
    <div class="battle-item" onclick="useItemInBattle(${item.id})">
      <img src="${item.image || 'img/assets/crate.png'}" alt="${item.name}" style="width: 40px; height: 40px;">
      <div>
        <span>${item.name} (${item.quantity})</span><br>
        <small>${item.description || ''}</small>
      </div>
    </div>
  `).join('');
  
  if (usableItems.length === 0) {
    itemsContainer.innerHTML = '<p>No usable items in inventory!</p>';
  }
  
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

function useItemInBattle(itemId) {
  const item = gameState.inventory.find(i => i.id === itemId);
  if (!item || item.quantity <= 0) return;

  let used = false;
  const player = battleState.playerFamiliar;

  if (!player) {
    logBattle("No familiar selected for item use!");
    return;
  }

  if (item.effect) {
    switch (item.effect.type) {
      case 'heal':
        const healAmount = item.effect.amount === 'max' ? 
          (Number(player.hp) - Number(player.currentHp || 0)) : 
          item.effect.amount;
        
        if ((player.currentHp || 0) < player.hp) {
          player.currentHp = Math.min(Number(player.hp), Number(player.currentHp || 0) + healAmount);
          logBattle(`Used ${item.name}! ${player.name} recovered ${healAmount} HP!`);
          used = true;
        } else {
          logBattle(`${player.name} already has full HP!`);
          return;
        }
        break;

      case 'buff':
        if (item.effect.stat && item.effect.amount) {
          // Apply the buff
          const buffStat = item.effect.stat;
          const buffAmount = item.effect.amount;
          
          // Initialize buff storage
          player.buffs = player.buffs || {};
          player.originalStats = player.originalStats || {};
          
          // Store original stat if not already stored
          if (!(buffStat in player.originalStats)) {
            player.originalStats[buffStat] = player[buffStat] || 0;
          }
          
          // Apply the buff
          player[buffStat] = Number(player.originalStats[buffStat]) + buffAmount;
          player.buffs[buffStat] = {
            amount: buffAmount,
            turnsLeft: item.effect.duration || 1
          };
          
          logBattle(`Used ${item.name}! ${player.name}'s ${buffStat} increased by ${buffAmount}!`);
          used = true;
        }
        break;

      case 'xp':
        // XP items can be used in battle and give immediate XP
        if (player.id) {
          const familiar = gameState.familiars.find(f => f.id === player.id);
          if (familiar) {
            familiar.xp = (familiar.xp || 0) + item.effect.amount;
            logBattle(`${familiar.name} gained ${item.effect.amount} XP!`);
            levelUpFamiliar(familiar);
            used = true;
          }
        }
        break;
    }
  }

  if (used) {
    // Consume the item
    item.quantity--;
    if (item.quantity <= 0) {
      gameState.inventory = gameState.inventory.filter(i => i.id !== item.id);
    }
    saveGame();
    // Update inventory UI in case the player opened the item menu outside of battle
    try { if (typeof renderInventory === 'function') renderInventory(); } catch (e) {}
    hideItemMenu();
    renderBattle();
    // End turn
    battleState.turn = 'opponent';
    battleState.timeoutId = setTimeout(opponentTurn, 900);
  } else {
    logBattle(`Cannot use ${item.name} at this time.`);
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

  // Update buff durations
  if (player.buffs) {
    Object.keys(player.buffs).forEach(stat => {
      if (player.buffs[stat]) {
        player.buffs[stat].turnsLeft--;
        if (player.buffs[stat].turnsLeft <= 0) {
          // Remove the buff
          if (player.originalStats && player.originalStats[stat] !== undefined) {
            player[stat] = player.originalStats[stat];
            logBattle(`${player.name}'s ${stat} buff wore off!`);
          }
          delete player.buffs[stat];
        } else {
          // Log remaining duration if buff is still active
          logBattle(`${player.name}'s ${stat} buff: ${player.buffs[stat].turnsLeft} turns remaining`);
        }
      }
    });
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
  if (!attacker || !defender) return 1;

  let atk = Number(attacker?.attack) || 0;
  let def = Number(defender?.defense) || 0;

  // Apply buffs if the attacker has any
  if (attacker?.buffs?.attack) {
    atk += attacker.buffs.attack.amount;
  }

  // Apply buffs if the defender has any
  if (defender?.buffs?.defense) {
    def += defender.buffs.defense.amount;
  }

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
    let xpGained = Math.floor((battleState.opponentFamiliar.level || 1) * 10 + opponentTotal * 0.5);
    
    // Check for and apply XP boost
    if (gameState.player.buffs && gameState.player.buffs.xpBoost && gameState.player.buffs.xpBoost.duration > 0) {
      const boost = gameState.player.buffs.xpBoost;
      xpGained *= boost.amount;
      boost.duration--;
      logBattle(`Experience Boost active! Gained ${xpGained} XP!`);
      if (boost.duration <= 0) {
        delete gameState.player.buffs.xpBoost;
        logBattle('Experience Boost has worn off.');
      }
    }

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

      // Increase bond for winning the battle
      if (typeof increaseBond === 'function') {
        increaseBond(familiar, 5);
      }
      
      // Ensure changes are saved and displayed
      saveGame();
      renderFamiliars();
    }

    // Add material drops
    const battleRewards = addBattleRewards(battleState.opponentFamiliar.name);
    if (battleRewards && battleRewards.length > 0) {
      logBattle(`You found some materials!`);
      showRewardsPopup(battleRewards);
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
