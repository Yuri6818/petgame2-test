// game.js
// playSound: small wrapper that uses the WebAudio tone helper for common SFX
function playSound(soundFile) {
  try {
    if (typeof soundFile === 'string') {
      // For built-in SFX avoid network requests (prevents 404s when sounds/ is missing)
      if (soundFile.includes('attack')) {
        playTone(880, 0.06, 'sawtooth');
        return;
      }
      if (soundFile.includes('defend')) {
        playTone(440, 0.09, 'sine');
        return;
      }
      if (soundFile.includes('win')) {
        // two-tone victory
        playTone(880, 0.12, 'triangle');
        setTimeout(() => playTone(1100, 0.09, 'triangle'), 120);
        return;
      }
      if (soundFile.includes('lose')) {
        playTone(220, 0.25, 'sine');
        return;
      }
    }

    // Fallback: try to load the provided file (will fail silently if missing)
    const audio = new Audio(soundFile);
    audio.play().catch(() => {});
  } catch (e) {
    console.warn('Audio play failed', e);
  }
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
function startCatching() { startActivity('catching'); }
function startEnchanting() { startActivity('enchanting'); }

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
    catching: { coins: 10, dust: 5, xp: 20 },
    enchanting: { coins: 10, dust: 5, xp: 20 }
  };

  const reward = rewards[activityName];
  if (reward) gainXP(reward.xp);

  if (activityName === 'catching') {
    if (Math.random() < 0.5) {
      const randomItem = {
        name: `Wildling ${gameState.familiars.length + 1}`,
  image: enemyImages.default || 'img/pets.jpg',
        hp: 40,
        attack: 8,
        defense: 4,
        speed: 12
      };
      const randomFamiliar = createFamiliarFromItem(randomItem, Date.now() + Math.floor(Math.random() * 1000));
      gameState.familiars.push(randomFamiliar);
      renderFamiliars();
      showNotification(`You caught a new familiar!`);
      celebrate();
    } else {
      showNotification(`The familiar got away...`);
    }
  } else if (activityName === 'enchanting') {
    if (Math.random() < 0.5) {
      const randomItem = {
        name: `Sprite ${gameState.familiars.length + 1}`,
  image: familiarImages.cat || 'img/pets.jpg',
        hp: 60,
        attack: 12,
        defense: 8,
        speed: 25
      };
      const randomFamiliar = createFamiliarFromItem(randomItem, Date.now() + Math.floor(Math.random() * 1000));
      gameState.familiars.push(randomFamiliar);
      renderFamiliars();
      showNotification(`You enchanted a new familiar!`);
      celebrate();
    } else {
      showNotification(`The familiar resisted the enchantment...`);
    }
  } else {
    if (reward) {
      gameState.coins += reward.coins;
      gameState.dust += reward.dust;
      spawnOrb(coinCountEl);
      showNotification(`${activityName.charAt(0).toUpperCase() + activityName.slice(1)} complete! +${reward.coins} coins, +${reward.dust} dust, +${reward.xp} XP`);
    }
  }

  saveGame();
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
