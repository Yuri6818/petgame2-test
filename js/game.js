// game.js


/* ---------- Celebration effect (used by game/battle on wins, purchases) ---------- */
function celebrate() {
  try {
    // spawn a few orbs toward the coin counter
    spawnOrb(coinCountEl, 6);

    // simple confetti animation (no external CSS required)
    const colors = ['#e74c3c','#f1c40f','#2ecc71','#3498db','#9b59b6'];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      el.className = 'confetti';
      el.style.position = 'fixed';
      el.style.zIndex = 9999;
      el.style.left = (Math.random() * 100) + '%';
      el.style.top = '-10px';
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.background = colors[i % colors.length];
      el.style.opacity = '0.95';
      el.style.borderRadius = '2px';
      el.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      el.style.pointerEvents = 'none';
      document.body.appendChild(el);

      // animate downwards
      setTimeout(() => {
        el.style.transition = 'all 1800ms linear';
        el.style.top = (60 + Math.random() * 30) + '%';
        el.style.opacity = '0';
        el.style.transform = 'translateY(120px) rotate(' + (Math.random() * 720) + 'deg)';
      }, 20 + Math.random() * 240);

      setTimeout(() => el.remove(), 2000 + Math.random() * 500);
    }

    // Try to play a win sound, if available
    try { if (typeof playSound === 'function') playSound('sounds/win.wav'); } catch (e) {}
  } catch (e) { console.warn('celebrate() error', e); }
}

console.log("game.js loaded");

// Game Functions
function claimDaily() {
  const today = new Date().toDateString();
  if (gameState.lastDaily === today) {
    showNotification("Already claimed today!");
    return;
  }
  
  gameState.coins += 50;
  gameState.dust += 5;
  gameState.lastDaily = today;
  
  spawnOrb(coinCountEl, 2);
  showNotification("Daily bonus claimed! +50 coins, +5 dust");
  updateUI();
  saveGame();
}

function buyItem(itemId) {
  const item = shopItems.find(i => i.id === itemId);
  if (!item) return showNotification('Item not found');
  const cost = item.price;
  const currency = item.currency;

  if (gameState[currency] < cost) {
    showNotification(`Not enough ${currency}!`);
    return;
  }

  const confirmation = confirm(`Are you sure you want to buy ${item.name} for ${cost} ${currency}?`);

  if (confirmation) {
    gameState[currency] -= cost;

    if (item.name === 'Mystery Box') {
      buyMysteryBox();
    } else if (item.type === 'familiar') {
      const newFamiliar = createFamiliarFromItem(item, Date.now() + Math.floor(Math.random() * 1000));
      gameState.familiars.push(newFamiliar);
      renderFamiliars();
      showNotification(`You bought a new familiar: ${item.name}!`);
      celebrate();
    } else {
      // Add to inventory
      const existingItem = gameState.inventory.find(i => i.name === item.name);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
      } else {
        gameState.inventory.push({
          id: Date.now() + Math.floor(Math.random() * 1000),
          name: item.name,
          image: item.image,
          quantity: 1,
          type: item.type || 'consumable',
          description: item.description || ''
        });
      }
      renderInventory();
      showNotification(`Purchased ${item.name}!`);
    }

    spawnOrb(currency === 'coins' ? coinCountEl : dustCountEl);
    updateUI();
    saveGame();
  }
}

function buyMysteryBox() {
  const pool = shopItems.filter(i => i.id && i.id !== 205);
  if (!pool.length) {
    pool.push(...hatchableFamiliars);
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const randomItem = pool[randomIndex];
  if (!randomItem) {
    showNotification('The box was empty... try again later.');
    return;
  }

  if (randomItem.type === 'familiar' || (randomItem.hp && !randomItem.type)) {
    const newFamiliar = createFamiliarFromItem(randomItem, Date.now() + Math.floor(Math.random() * 1000));
    gameState.familiars.push(newFamiliar);
    renderFamiliars();
    saveGame();
    setTimeout(() => {
      showNotification(`You got a new familiar: ${newFamiliar.name} from the Mystery Box!`);
      celebrate();
    }, 80);
  } else {
    const existingItem = gameState.inventory.find(i => i.name === randomItem.name);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
      gameState.inventory.push({
        id: randomItem.id || Date.now() + Math.floor(Math.random() * 1000),
        name: randomItem.name || 'Mysterious Item',
        image: randomItem.image,
        quantity: 1,
        type: randomItem.type || 'consumable',
        description: randomItem.description || ''
      });
    }
    renderInventory();
    saveGame();
    setTimeout(() => {
      showNotification(`You got a ${randomItem.name} from the Mystery Box!`);
      celebrate();
    }, 80);
  }
}

function hatchEgg(itemId) {
  const egg = gameState.inventory.find(i => i.id === itemId);
  if (!egg || egg.type !== 'egg') return;

  showHatchingAnimation(() => {
    const newFamiliarInfo = hatchableFamiliars[Math.floor(Math.random() * hatchableFamiliars.length)];
    const newFamiliar = createFamiliarFromItem(newFamiliarInfo, Date.now() + Math.floor(Math.random() * 1000));
    gameState.familiars.push(newFamiliar);
    
    egg.quantity--;
    if (egg.quantity <= 0) {
      gameState.inventory = gameState.inventory.filter(i => i.id !== itemId);
    }

    renderFamiliars();
    renderInventory();
    showNotification(`You hatched a ${newFamiliar.name}!`);
    celebrate();
    saveGame();
  });
}

// Create familiar with safe defaults
function createFamiliarFromItem(item, newId) {
  const species = item.species || (item.name || 'familiar').toLowerCase().replace(/\s+/g, '');
  
  // Use familiarImages mapping if available, otherwise use default
  let imagePath = item.image || item.img;
  if (!imagePath && window.familiarImages && window.familiarImages[species]) {
    imagePath = window.familiarImages[species];
  } else if (!imagePath) {
    imagePath = window.familiarImages ? window.familiarImages.default : 'img/familiars/familiars.png';
  }
  
  return {
    id: newId,
    name: item.name || 'New Familiar',
    species: species,
    color: item.color || 'default',
    marking: item.marking || 'none',
    level: item.level || 1,
    xp: item.xp || 0,
    image: imagePath,
    hunger: item.hunger || 100,
    thirst: item.thirst || 100,
    happiness: item.happiness || 100,
    hp: Number(item.hp) || 60,
    attack: Number(item.attack) || 10,
    defense: Number(item.defense) || 10,
    speed: Number(item.speed) || 10
  };
}

function levelUp() {
  if (gameState.xp >= 100) {
    gameState.level++;
    gameState.xp -= 100;
    gameState.coins += gameState.level * 10;
    
    spawnOrb(playerLevelEl, 3);
    showNotification(`Level up! You're now level ${gameState.level}!`);
    celebrate();
    updateUI();
    saveGame();
  }
}

function getRequiredXP(level) {
  // Exponential XP requirement: 100 * 2^(level-1)
  return Math.floor(100 * Math.pow(2, level - 1));
}

function levelUpFamiliar(familiar) {
  const requiredXP = getRequiredXP(familiar.level);
  
  if (familiar.xp >= requiredXP) {
    // Max level check
    if (familiar.level >= 100) {
      familiar.xp = requiredXP; // Cap XP at the requirement for max level
      saveGame();
      return;
    }

    familiar.level++;
    familiar.xp -= requiredXP;
    
    // Increase stats with caps
    familiar.hp = Math.min(500, familiar.hp + 10);  // Cap HP at 500
    familiar.attack = Math.min(100, familiar.attack + 2);  // Cap attack at 100
    familiar.defense = Math.min(100, familiar.defense + 2);  // Cap defense at 100
    familiar.speed = Math.min(100, familiar.speed + 1);  // Cap speed at 100
    
    showNotification(`${familiar.name} leveled up to level ${familiar.level}! 🎉\nStats increased: HP +10, Attack +2, Defense +2, Speed +1\nNext level requires ${getRequiredXP(familiar.level)} XP`);
    celebrate();
    renderFamiliars();
    saveGame();
    
    // Check if there's still excess XP for another level
    if (familiar.xp >= getRequiredXP(familiar.level)) {
      levelUpFamiliar(familiar); // Recursively level up if more XP available
    }
  }
}

function gainXP(amount) {
  gameState.xp += amount;
  if (gameState.xp >= 100) {
    levelUp();
  }
  updateUI();
}

// Activity functions
function startActivity(activityName) {
  if (activityName === 'catch') activityName = 'catching';
  if (!gameState.activities[activityName]) {
    showNotification(`Invalid activity: ${activityName}`);
    return;
  }
  const activity = gameState.activities[activityName];
  if (activity.active) return;
  
  activity.active = true;
  activity.progress = 0;
  
  const btn = document.getElementById(`${activityName}Btn`);
  const progressBar = document.getElementById(`${activityName}Progress`);
  
  if (btn) {
    btn.disabled = true;
    btn.textContent = `${activityName.charAt(0).toUpperCase() + activityName.slice(1)}...`;
  }
  
  const interval = setInterval(() => {
    activity.progress += 10;
    if (progressBar) progressBar.style.width = activity.progress + '%';
    
    if (activity.progress >= 100) {
      clearInterval(interval);
      completeActivity(activityName);
    }
  }, 300);
}

function startForaging() { startActivity('foraging'); }
function startMining() { startActivity('mining'); }
function startFishing() { startActivity('fishing'); }

function completeActivity(activityName) {
  const activity = gameState.activities[activityName];
  activity.active = false;
  activity.progress = 0;

  const btn = document.getElementById(`${activityName}Btn`);
  const progressBar = document.getElementById(`${activityName}Progress`);

  if (btn) {
    btn.disabled = false;
    btn.textContent = `Start ${activityName.charAt(0).toUpperCase() + activityName.slice(1)}`;
  }
  if (progressBar) progressBar.style.width = '0%';

  const rewards = {
    foraging: { coins: 15, dust: 2, xp: 10 },
    mining: { coins: 25, dust: 1, xp: 15 },
    fishing: { coins: 20, dust: 3, xp: 12 },
  };

  const reward = rewards[activityName];
  if (reward) {
    gainXP(reward.xp);
    gameState.coins += reward.coins;
    gameState.dust += reward.dust;
    spawnOrb(coinCountEl);
    showNotification(`${activityName.charAt(0).toUpperCase() + activityName.slice(1)} complete! +${reward.coins} coins, +${reward.dust} dust, +${reward.xp} XP`);
  }

  saveGame();
}

function adoptFamiliar() {
  if (gameState.familiars.length >= 20) {
    showNotification("You have too many familiars! Consider sending one to the pound.");
    return;
  }

  const name = document.getElementById('adopt-name').value.trim();
  const species = document.getElementById('adopt-species').value;

  if (!name) {
    showNotification("Your new familiar needs a name!");
    return;
  }

  const newFamiliar = createFamiliarFromItem({ name, species }, Date.now());
  gameState.familiars.push(newFamiliar);

  showNotification(`You adopted ${name} the ${species}!`);
  renderFamiliars();
  saveGame();
  celebrate();
}

function sendToPound(familiarId) {
  const cost = 50;
  if (gameState.coins < cost) {
    showNotification(`You need 50 coins to send a familiar to the pound.`);
    return;
  }

  if (!confirm(`Are you sure you want to send this familiar to the pound for 50 coins? This is permanent.`)) {
    return;
  }

  const familiarIndex = gameState.familiars.findIndex(f => f.id === familiarId);
  if (familiarIndex === -1) {
    showNotification("Familiar not found.");
    return;
  }

  const [familiar] = gameState.familiars.splice(familiarIndex, 1);
  gameState.pound.push(familiar);
  gameState.coins -= cost;

  showNotification(`${familiar.name} has been sent to the pound.`);
  updateUI();
  renderFamiliars();
  renderPoundPage();
  saveGame();
}

function adoptFromPound(familiarId) {
  const cost = 100;
  if (gameState.coins < cost) {
    showNotification(`You need 100 coins to adopt from the pound.`);
    return;
  }

  if (gameState.familiars.length >= 20) {
    showNotification("You have too many familiars!");
    return;
  }

  const familiarIndex = gameState.pound.findIndex(f => f.id === familiarId);
  if (familiarIndex === -1) {
    showNotification("Familiar not found in the pound.");
    return;
  }

  if (!confirm(`Are you sure you want to adopt this familiar for 100 coins?`)) {
    return;
  }

  const [familiar] = gameState.pound.splice(familiarIndex, 1);
  gameState.familiars.push(familiar);
  gameState.coins -= cost;

  showNotification(`You have adopted ${familiar.name}!`);
  updateUI();
  renderFamiliars();
  renderPoundPage();
  saveGame();
  celebrate();
}

function interactFamiliar(familiarId, interactionType) {
  const familiar = (gameState.familiars || []).find(f => f.id === familiarId);
  if (!familiar) return showNotification('Familiar not found');

  switch (interactionType) {
    case 'play':
      familiar.happiness = Math.min(100, (familiar.happiness || 0) + 10);
      familiar.hunger = Math.max(0, (familiar.hunger || 0) - 5);
      gainXP(5);
      showNotification(`${familiar.name} is happy! +5 XP`);
      familiarAnimation(familiarId);
      break;
    case 'feed':
      familiar.hunger = Math.min(100, (familiar.hunger || 0) + 20);
      familiar.thirst = Math.max(0, (familiar.thirst || 0) - 10);
      gainXP(2);
      showNotification(`${familiar.name} is full! +2 XP`);
      break;
    case 'water':
      familiar.thirst = Math.min(100, (familiar.thirst || 0) + 20);
      gainXP(2);
      showNotification(`${familiar.name} is hydrated! +2 XP`);
      break;
  }

  renderFamiliars();
  saveGame();
}

function showFamiliarSelectionDialog(item, callback) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  // Create modal content
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: rgba(42, 14, 58, 0.95);
    border: 2px solid #ffd700;
    padding: 20px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    color: #fff;
  `;

  dialog.innerHTML = `
    <h3>Select a familiar to use ${item.name} on:</h3>
    <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
      ${gameState.familiars.map(familiar => `
        <div class="familiar-choice" style="
          border: 1px solid #ffd700;
          padding: 10px;
          cursor: pointer;
          text-align: center;
          transition: all 0.3s ease;
        " onclick="selectFamiliarForItem(${familiar.id}, ${item.id})">
          <img src="${getImageSrc(familiar)}" style="width: 64px; height: 64px; border-radius: 50%;" alt="${familiar.name}">
          <h4>${familiar.name}</h4>
          <p>Level ${familiar.level} ${familiar.species}</p>
        </div>
      `).join('')}
    </div>
    <button onclick="closeFamiliarSelectionDialog()" style="
      margin-top: 20px;
      padding: 10px 20px;
      background: #2a0e3a;
      color: #ffd700;
      border: 1px solid #ffd700;
      cursor: pointer;
    ">Cancel</button>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  window.familiarSelectionCallback = callback;
  window.familiarSelectionDialog = overlay;
}

function closeFamiliarSelectionDialog() {
  if (window.familiarSelectionDialog) {
    window.familiarSelectionDialog.remove();
    delete window.familiarSelectionDialog;
    delete window.familiarSelectionCallback;
  }
}

function selectFamiliarForItem(familiarId, itemId) {
  if (window.familiarSelectionCallback) {
    window.familiarSelectionCallback(familiarId);
    closeFamiliarSelectionDialog();
  }
}

function useItem(itemId, targetFamiliarId) {
  const item = gameState.inventory.find(i => i.id === itemId);
  if (!item) return;

  if (item.type === 'egg') {
    hatchEgg(itemId);
    return;
  }

  // Check if we're in battle
  const inBattle = window.battleState && battleState.playerFamiliar;
  
  // If we're not in battle and no target is specified, show familiar selection for certain items
  if (!inBattle && !targetFamiliarId && (item.effect.type === 'heal' || item.effect.type === 'xp')) {
    showFamiliarSelectionDialog(item, (selectedFamiliarId) => {
      useItem(itemId, selectedFamiliarId);
    });
    return;
  }

  const targetFamiliar = inBattle ? battleState.playerFamiliar : 
    (targetFamiliarId ? gameState.familiars.find(f => f.id === targetFamiliarId) : gameState.familiars[0]);

  if (!targetFamiliar) {
    showNotification('No familiar available to use this item on!');
    return;
  }

  let itemUsed = false;

  if (item.effect) {
    switch (item.effect.type) {
      case 'heal':
        // Healing can be used in or out of battle
        const maxHp = Number(targetFamiliar.hp);
        const currentHp = Number(targetFamiliar.currentHp || targetFamiliar.hp);
        const healAmount = item.effect.amount === 'max' ? 
          maxHp - currentHp : item.effect.amount;

        if (currentHp < maxHp) {
          targetFamiliar.currentHp = Math.min(maxHp, currentHp + healAmount);
          showNotification(`${targetFamiliar.name} recovered ${healAmount} HP!`);
          itemUsed = true;
        } else {
          showNotification(`${targetFamiliar.name} already has full HP!`);
          return;
        }
        break;

      case 'buff':
        // Buffs can only be used in battle
        if (!inBattle) {
          showNotification('This item can only be used in battle!');
          return;
        }

        if (!targetFamiliar.buffs) targetFamiliar.buffs = {};
        if (!targetFamiliar.originalStats) targetFamiliar.originalStats = {};

        const buffStat = item.effect.stat;
        const buffAmount = item.effect.amount;

        // Store original stat if not already stored
        if (!(buffStat in targetFamiliar.originalStats)) {
          targetFamiliar.originalStats[buffStat] = targetFamiliar[buffStat] || 0;
        }

        // Apply or refresh the buff
        targetFamiliar[buffStat] = Number(targetFamiliar.originalStats[buffStat]) + buffAmount;
        targetFamiliar.buffs[buffStat] = {
          amount: buffAmount,
          turnsLeft: item.effect.duration || 1
        };

        showNotification(`${targetFamiliar.name}'s ${buffStat} increased by ${buffAmount}!`);
        itemUsed = true;
        break;

      case 'xp':
        // XP items can be used anytime
        if (targetFamiliar.id) {
          const familiar = gameState.familiars.find(f => f.id === targetFamiliar.id);
          if (familiar) {
            familiar.xp = (familiar.xp || 0) + item.effect.amount;
            showNotification(`${familiar.name} gained ${item.effect.amount} XP!`);
            levelUpFamiliar(familiar);
            itemUsed = true;
          }
        }
        break;
    }
  }

  if (itemUsed) {
    item.quantity--;
    if (item.quantity <= 0) {
      gameState.inventory = gameState.inventory.filter(i => i.id !== itemId);
    }

    if (inBattle) {
      renderBattle();
    } else {
      renderInventory();
      renderFamiliars();
    }
    saveGame();
  }
}

// Rename support (simple prompt + save)
function renameFamiliar(id) {
  const fam = (gameState.familiars || []).find(f => f.id === id);
  if (!fam) return showNotification('Familiar not found');
  const name = prompt('Enter a new name for your familiar:', fam.name || '');
  if (name && name.trim()) {
    fam.name = name.trim();
    renderFamiliars();
    saveGame();
  }
}
