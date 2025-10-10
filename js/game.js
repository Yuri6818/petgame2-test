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
  return {
    id: newId,
    name: item.name || 'New Familiar',
    species: item.species || (item.name || 'familiar').toLowerCase().replace(/\s+/g, ''),
    color: item.color || 'default',
    marking: item.marking || 'none',
    level: item.level || 1,
    xp: item.xp || 0,
  image: item.image || item.img || `img/${(item.name || 'familiar').toLowerCase().replace(/\s+/g,'_')}.png`,
    hunger: item.hunger || 100,
    thirst: item.thirst || 100,
    happiness: item.happiness || 100,
    hp: Number(item.hp) || 50,
    attack: Number(item.attack) || 10,
    defense: Number(item.defense) || 5,
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

function levelUpFamiliar(familiar) {
  if (familiar.xp >= 100) {
    familiar.level++;
    familiar.xp -= 100;
    familiar.hp += 10;
    familiar.attack += 2;
    familiar.defense += 2;
    familiar.speed += 1;
    showNotification(`${familiar.name} leveled up to level ${familiar.level}!`);
    celebrate();
    renderFamiliars();
    saveGame();
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

function useItem(itemId) {
  const item = gameState.inventory.find(i => i.id === itemId);
  if (!item) return;

  if (item.type === 'egg') {
    hatchEgg(itemId);
    return;
  }
  
  if (item.name && item.name.toLowerCase().includes('potion')) {
    gameState.familiars.forEach(familiar => {
      familiar.happiness = Math.min(100, (familiar.happiness || 0) + 20);
    });
    showNotification('All familiars feel refreshed!');
  } else if (item.name && item.name.toLowerCase().includes('crystal')) {
    gainXP(25);
    showNotification('The crystal grants you wisdom! +25 XP');
  }
  
  item.quantity--;
  if (item.quantity <= 0) {
    gameState.inventory = gameState.inventory.filter(i => i.id !== itemId);
  }
  
  renderInventory();
  renderFamiliars();
  saveGame();
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