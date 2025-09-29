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

/* ---------- Render familiars (clean layout, rename support) ---------- */
function renderFamiliars() {
  const container = document.getElementById('familiarContainer');
  if (!container) return;
  container.innerHTML = '';

  (gameState.familiars || []).forEach(fam => {
    const key = (fam.species || fam.name || 'familiar').toString().toLowerCase().replace(/\s+/g, '-');
    const imgSrc = getImageSrc(fam, 'familiar');
  const placeholder = (familiarImages && familiarImages.default) || 'img/pets.jpg';

    const div = document.createElement('div');
    div.className = 'card pet-card';
    div.dataset.familiarId = fam.id;

    // Stats layout: left = needs, right = core stats
    div.innerHTML = `
      <div class="card-image">
        <img src="${imgSrc}" alt="${fam.name}" class="familiar-thumb"
             onerror="this.onerror=null;this.src='${placeholder}'">
      </div>
      <h3 class="fam-name">${fam.name || 'Unnamed'}</h3>
      <p class="fam-level">Level ${fam.level || 1} ${fam.species ? '(' + fam.species + ')' : ''}</p>

      <div class="fam-stats-row">
        <div class="fam-needs">
          <div class="stat"><span class="stat-label">❤️</span> <span>${fam.happiness ?? 0}%</span></div>
          <div class="stat"><span class="stat-label">🍖</span> <span>${fam.hunger ?? 0}%</span></div>
          <div class="stat"><span class="stat-label">💧</span> <span>${fam.thirst ?? 0}%</span></div>
        </div>
        <div class="fam-core">
          <div class="stat"><span class="stat-label">⚔️</span> <span>${fam.attack ?? 0}</span></div>
          <div class="stat"><span class="stat-label">🛡️</span> <span>${fam.defense ?? 0}</span></div>
          <div class="stat"><span class="stat-label">💨</span> <span>${fam.speed ?? 0}</span></div>
        </div>
      </div>

      <div class="pet-actions">
        <button class="btn" onclick="interactFamiliar(${fam.id}, 'play')">Play</button>
        <button class="btn" onclick="interactFamiliar(${fam.id}, 'feed')">Feed</button>
        <button class="btn" onclick="interactFamiliar(${fam.id}, 'water')">Water</button>
        <button class="btn btn-primary" onclick="startBattle(${fam.id})">Battle</button>
      </div>

      <div class="pet-actions">
        <button class="btn" onclick="renameFamiliar(${fam.id})">Rename</button>
      </div>
    `;

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
    const div = document.createElement('div');
    div.className = 'card item-card';
  const img = item.image ? `<img src="${item.image}" alt="${item.name}" style="width:64px;height:64px;" onerror="this.onerror=null;this.src='img/shop.jpg'">` : '';
    let btnHtml = item.type === 'egg' ? `<button class="btn" onclick="hatchEgg(${item.id})">Hatch</button>` : `<button class="btn" onclick="useItem(${item.id})">Use</button>`;
    div.innerHTML = `
      <div class="card-image">${img}</div>
      <h3>${item.name}</h3>
      <p>${item.description || ''}</p>
      <p>Qty: ${item.quantity || 0}</p>
      ${btnHtml}
    `;
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
  const imgHtml = item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100px;height:100px;border-radius:12px;" onerror="this.onerror=null;this.src='img/shop.jpg'">` : '';
    div.innerHTML = `
      <div class="card-image">${imgHtml}</div>
      <h3>${item.name}</h3>
      <p>${item.description || ''}</p>
      <div class="price"><strong>${item.currency === 'coins' ? 'Coins' : 'Dust'}:</strong> ${item.price}</div>
      <button class="btn" ${!canAfford ? 'disabled' : ''} onclick="buyItem(${item.id})">Buy</button>
    `;
    container.appendChild(div);
  });
}

function renderAllSections() {
  renderFamiliars();
  renderInventory();
  renderShop();
}

/* ---------- Visual effects: slash ---------- */
function showSlash(targetEl, imagePath = 'img/red claws.png') {
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

/* ---------- Small tone helper (keeps oscillator separate from file SFX) ---------- */
let _audioCtx = null;
function playTone(freq = 440, dur = 0.08, type = 'sine') {
  try {
    if (!_audioCtx || _audioCtx.state === 'closed') _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _audioCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.01);
    o.start();
    setTimeout(() => { try { g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur); } catch(e){} }, dur*1000);
    setTimeout(() => { try { o.stop(); } catch(e){} }, dur*1000 + 80);
  } catch(e) { console.warn('Audio ctx error', e); }
}
    
