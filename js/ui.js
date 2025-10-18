// ui.js
// DOM references
const coinCountEl = document.getElementById("coinCount");
const dustCountEl = document.getElementById("dustCount");
const playerLevelEl = document.getElementById("playerLevel");
const playerXPEl = document.getElementById("playerXP");
const serverTimeEl = document.getElementById("serverTime");
const notificationEl = document.getElementById("notification");
const hatchingOverlay = document.getElementById("hatching-overlay");
const bgMusicEl = document.getElementById('bg-music');

function updateUI() {
  if (coinCountEl) coinCountEl.textContent = gameState.coins ?? 0;
  if (dustCountEl) dustCountEl.textContent = gameState.dust ?? 0;
  if (playerLevelEl) playerLevelEl.textContent = gameState.level ?? 1;
  if (playerXPEl) playerXPEl.textContent = gameState.xp ?? 0;
  
  // Update active familiar display
  const activeFamiliarDisplay = document.getElementById('activeFamiliarDisplay');
  if (activeFamiliarDisplay) {
    const activeFamiliar = getActiveFamiliar();
    if (activeFamiliar) {
      activeFamiliarDisplay.textContent = `Active: ${activeFamiliar.name}`;
    } else {
      activeFamiliarDisplay.textContent = 'Active: None';
    }
  }
}

function updateServerTime() {
  if (!serverTimeEl) return;
  const now = new Date();
  serverTimeEl.textContent = now.toLocaleTimeString();
}

function showSection(sectionName) {
  if (!sectionName) return;
  document.body.className = sectionName;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const target = document.getElementById(sectionName);
  if (target) target.classList.add('active');

  const btn = document.getElementById(`btn-${sectionName}`);
  if (btn) btn.classList.add('active');
}

function showNotification(msg, duration = 2000) {
  if (!notificationEl) return;
  notificationEl.textContent = msg;
  notificationEl.classList.add('show');
  setTimeout(() => notificationEl.classList.remove('show'), duration);
}

function spawnOrb(targetEl, count = 1) {
  if (!targetEl) return;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const orb = document.createElement('div');
      orb.className = 'orb';
      orb.style.left = Math.random() * window.innerWidth + 'px';
      orb.style.top = Math.random() * window.innerHeight + 'px';
      document.body.appendChild(orb);
      setTimeout(() => {
        const rect = targetEl.getBoundingClientRect();
        orb.style.transition = 'all 900ms ease-out';
        orb.style.left = (rect.left + rect.width / 2) + 'px';
        orb.style.top = (rect.top + rect.height / 2) + 'px';
        orb.style.opacity = '0';
        orb.style.transform = 'scale(0.2)';
      }, 80);
      setTimeout(() => orb.remove(), 1200);
    }, i * 150);
  }
}

function showHatchingAnimation(cb) {
  if (!hatchingOverlay) { if (typeof cb === 'function') cb(); return; }
  hatchingOverlay.classList.remove('hidden');
  hatchingOverlay.innerHTML = '<div class="egg-container"><div class="egg wobble"></div></div>';
  setTimeout(() => {
    hatchingOverlay.classList.add('hidden');
    if (typeof cb === 'function') cb();
  }, 1800);
}

/* ---------- Image resolution helper ---------- */
function getImageSrc(item, fallbackType = 'familiar') {
  if (!item) return (fallbackType === 'enemy' ? enemyImages.default : familiarImages.default);
  if (item.image) return item.image;
  if (item.img) return item.img;
  const key = (item.species || item.name || '').toString().toLowerCase().replace(/\s+/g, '-');
  if (fallbackType === 'enemy' && window.enemyImages && window.enemyImages[key]) return window.enemyImages[key];
  if (window.familiarImages && window.familiarImages[key]) return window.familiarImages[key];
  return (fallbackType === 'enemy' ? enemyImages.default : familiarImages.default);
}

// Enhanced image loading with better error handling
function createImageElement(src, alt = '', className = '', onError = null) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  if (className) img.className = className;
  
  // Enhanced error handling
  img.onerror = function() {
    console.warn(`Failed to load image: ${src}`);
    if (onError) {
      onError(img);
    } else {
      // Default fallback behavior
      const fallbackSrc = src.includes('familiars') ? 'img/familiars/familiars.png' : 
                         src.includes('enemies') ? 'img/assets/battle.png' : 
                         'img/assets/crate.png';
      img.src = fallbackSrc;
      img.onerror = null; // Prevent infinite loop
    }
  };
  
  return img;
}

/* ---------- Render familiars (clean layout, rename support) ---------- */
function renderFamiliars() {
  const container = document.getElementById('familiarContainer');
  if (!container) return;
  container.innerHTML = '';

  (gameState.familiars || []).forEach(fam => {
    const key = (fam.species || fam.name || 'familiar').toString().toLowerCase().replace(/\s+/g, '-');
    const imgSrc = getImageSrc(fam, 'familiar');
  const placeholder = (familiarImages && familiarImages.default) || 'img/familiars/familiars.png';

    const div = document.createElement('div');
    div.className = 'card familiar-card';
    div.dataset.familiarId = fam.id;

    // Stats layout: left = needs, right = core stats
    const cardImageDiv = document.createElement('div');
    cardImageDiv.className = 'card-image';
    
    const img = createImageElement(imgSrc, fam.name, 'familiar-thumb', (errorImg) => {
      errorImg.src = placeholder;
    });
    
    cardImageDiv.appendChild(img);
    
    div.appendChild(cardImageDiv);
    
    // Add name and level
    const nameEl = document.createElement('h3');
    nameEl.className = 'fam-name';
    nameEl.textContent = fam.name || 'Unnamed';
    div.appendChild(nameEl);
    
    const levelEl = document.createElement('p');
    levelEl.className = 'fam-level';
    levelEl.textContent = `Level ${fam.level || 1} ${fam.species ? '(' + fam.species + ')' : ''}`;
    div.appendChild(levelEl);
    
    // Add stats grid
    const statsGrid = document.createElement('div');
    statsGrid.className = 'fam-stats-grid';
    statsGrid.innerHTML = `
      <div class="stat"><span>❤️</span> <span>${fam.happiness ?? 0}%</span></div>
      <div class="stat"><span>⚔️</span> <span>${fam.attack ?? 0}</span></div>
      <div class="stat"><span>🍖</span> <span>${fam.hunger ?? 0}%</span></div>
      <div class="stat"><span>🛡️</span> <span>${fam.defense ?? 0}</span></div>
      <div class="stat"><span>💧</span> <span>${fam.thirst ?? 0}%</span></div>
      <div class="stat"><span>⚡</span> <span>${fam.speed ?? 0}</span></div>
    `;
    div.appendChild(statsGrid);
    
    // Add action buttons
    const actionsDiv1 = document.createElement('div');
    actionsDiv1.className = 'familiar-actions';
    actionsDiv1.innerHTML = `
      <button class="btn" onclick="interactFamiliar(${fam.id}, 'play')">Play</button>
      <button class="btn" onclick="interactFamiliar(${fam.id}, 'feed')">Feed</button>
      <button class="btn" onclick="interactFamiliar(${fam.id}, 'water')">Water</button>
      <button class="btn btn-primary" onclick="startBattle(${fam.id})">Battle</button>
    `;
    div.appendChild(actionsDiv1);
    
    const actionsDiv2 = document.createElement('div');
    actionsDiv2.className = 'familiar-actions';
    
    // Check if this is the active familiar
    const isActive = gameState.activeFamiliarId === fam.id;
    const activeText = isActive ? '⭐ Active Pet' : 'Set Active';
    
    actionsDiv2.innerHTML = `
      <button class="btn" onclick="setActiveFamiliar(${fam.id})">${activeText}</button>
      <button class="btn" onclick="renameFamiliar(${fam.id})">Rename</button>
      <button class="btn" onclick="sendToPound(${fam.id})">Send to Pound</button>
    `;
    div.appendChild(actionsDiv2);
    
    // Add visual indicator for active familiar
    if (isActive) {
      div.style.border = '3px solid #ffd700';
      div.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
    }
    
    // Add library and collection info
    const libraryCount = fam.library ? fam.library.length : 0;
    const stampCount = fam.collectibles ? fam.collectibles.stamps.length : 0;
    const toyCount = fam.collectibles ? fam.collectibles.toys.length : 0;
    const plantCount = fam.collectibles ? fam.collectibles.plants.length : 0;
    
    const collectionDiv = document.createElement('div');
    collectionDiv.style.cssText = 'margin-top: 10px; font-size: 12px; color: #c8bda1;';
    collectionDiv.innerHTML = `
      📚 Books: ${libraryCount} | 🎫 Stamps: ${stampCount} | 🧸 Toys: ${toyCount} | 🌸 Plants: ${plantCount}
    `;
    div.appendChild(collectionDiv);

    container.appendChild(div);
  });
}

/* ---------- Inventory & Shop ---------- */
function renderInventory() {
  const container = document.getElementById('inventoryContainer');
  if (!container) return;
  container.innerHTML = '';
  const inv = gameState.inventory || [];
  if (!inv.length) { container.innerHTML = '<p>Your inventory is empty.</p>'; return; }

  inv.forEach(item => {
    console.log("Rendering inventory item with image:", item.image);
    const div = document.createElement('div');
    div.className = 'card item-card';
    
    const cardImageDiv = document.createElement('div');
    cardImageDiv.className = 'card-image';
    
    if (item.image) {
      const img = createImageElement(item.image, item.name, '', (errorImg) => {
        errorImg.src = IMG_PATHS.shop;
      });
      img.style.width = '64px';
      img.style.height = '64px';
      cardImageDiv.appendChild(img);
    }
    
    div.appendChild(cardImageDiv);
    
    const nameEl = document.createElement('h3');
    nameEl.textContent = item.name;
    div.appendChild(nameEl);
    
    if (item.description) {
      const descEl = document.createElement('p');
      descEl.textContent = item.description;
      div.appendChild(descEl);
    }
    
    const qtyEl = document.createElement('p');
    qtyEl.textContent = `Qty: ${item.quantity || 0}`;
    div.appendChild(qtyEl);
    
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = item.type === 'egg' ? 'Hatch' : 'Use';
    btn.onclick = () => item.type === 'egg' ? hatchEgg(item.id) : useItem(item.id);
    div.appendChild(btn);
    
    container.appendChild(div);
  });
}

function renderShop() {
  const container = document.getElementById('shopContainer');
  if (!container) return;
  container.innerHTML = '';
  shopItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'card shop-card';
    const canAfford = (gameState[item.currency] || 0) >= item.price;
    
    const cardImageDiv = document.createElement('div');
    cardImageDiv.className = 'card-image';
    
    if (item.image) {
      const img = createImageElement(item.image, item.name, '', (errorImg) => {
        errorImg.src = IMG_PATHS.shop;
      });
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.borderRadius = '12px';
      cardImageDiv.appendChild(img);
    }
    
    div.appendChild(cardImageDiv);
    
    const nameEl = document.createElement('h3');
    nameEl.textContent = item.name;
    div.appendChild(nameEl);
    
    if (item.description) {
      const descEl = document.createElement('p');
      descEl.textContent = item.description;
      div.appendChild(descEl);
    }
    
    const priceEl = document.createElement('div');
    priceEl.className = 'price';
    priceEl.innerHTML = `<strong>${item.currency === 'coins' ? 'Coins' : 'Dust'}:</strong> ${item.price}`;
    div.appendChild(priceEl);
    
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'Buy';
    btn.disabled = !canAfford;
    btn.onclick = () => buyItem(item.id);
    div.appendChild(btn);
    
    container.appendChild(div);
  });
}

function renderAdoptPage() {
  const container = document.getElementById('adopt');
  if (!container) return;
  // Basic form for adoption
  container.innerHTML = `
    <div class="grid">
      <input type="text" id="adopt-name" placeholder="Familiar Name" />
      <select id="adopt-species">
        <option value="cat">Cat</option>
        <option value="wolf">Wolf</option>
        <option value="dragon">Dragon</option>
      </select>
      <button class="btn" onclick="adoptFamiliar()">Adopt</button>
    </div>
  `;
}

function renderPoundPage() {
  const container = document.getElementById('pound');
  if (!container) return;
  container.innerHTML = '<div class="grid" id="poundContainer"></div>';
  const poundContainer = document.getElementById('poundContainer');
  if (!poundContainer) return;
  poundContainer.innerHTML = '';

  if (!gameState.pound || gameState.pound.length === 0) {
    poundContainer.innerHTML = '<p>The pound is currently empty.</p>';
    return;
  }

  gameState.pound.forEach(fam => {
    const imgSrc = getImageSrc(fam, 'familiar');
    const placeholder = familiarImages.default;
    const div = document.createElement('div');
    div.className = 'card familiar-card';
    div.innerHTML = `
      <div class="card-image">
        <img src="${imgSrc}" alt="${fam.name}" class="familiar-thumb" onerror="this.onerror=null;this.src='${placeholder}'">
      </div>
      <h3>${fam.name}</h3>
      <p>Level ${fam.level}</p>
      <button class="btn" onclick="adoptFromPound(${fam.id})">Adopt (100 Coins)</button>
    `;
    poundContainer.appendChild(div);
  });
}

function renderAllSections() {
  renderFamiliars();
  renderInventory();
  renderShop();
  renderAdoptPage();
  renderPoundPage();
}


/* ---------- Visual effects: slash ---------- */
function showSlash(targetEl, imagePath = IMG_PATHS.redClaws) {
  if (!targetEl) return;
  const img = document.createElement('img');
  img.src = imagePath;
  img.className = 'slash-effect';
  img.style.position = 'absolute';
  img.style.left = '10%';
  img.style.top = '5%';
  img.style.width = '220px';
  img.style.pointerEvents = 'none';
  targetEl.appendChild(img);
  setTimeout(() => img.remove(), 420);
}