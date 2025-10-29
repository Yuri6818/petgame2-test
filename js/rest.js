// Rest area system for familiar relaxation and healing
const REST_MESSAGES = [
    "Your familiar hums softly by the fire...",
    "A gentle breeze rustles through the rest area...",
    "Your familiar seems very relaxed...",
    "The peaceful atmosphere is soothing...",
    "Your familiar looks content and peaceful...",
];

let restInterval = null;
let messageInterval = null;

function initializeRestArea() {
    const familiar = getActiveFamiliar();
    if (!familiar) {
        showNotification("You need to select an active familiar first!");
        return;
    }

    // Update UI
    const container = document.getElementById('rest-container');
    container.innerHTML = `
        <div class="rest-area">
            <img src="${familiar.image}" alt="${familiar.name}" class="familiar-image resting">
            <p class="rest-message">${REST_MESSAGES[0]}</p>
            <div class="rest-stats">
                <p>❤️ HP: <span id="rest-hp">${familiar.currentHp || familiar.hp}/${familiar.hp}</span></p>
                <p>💕 Bond: <span id="rest-bond">${familiar.bond || 0}/100</span></p>
            </div>
            <button onclick="exitRestArea()" class="rest-btn">Wake Up</button>
        </div>
    `;

    // Start healing and message rotation
    startResting(familiar);
}

function startResting(familiar) {
    if (restInterval) clearInterval(restInterval);
    if (messageInterval) clearInterval(messageInterval);

    // Rotate rest messages
    let messageIndex = 0;
    messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % REST_MESSAGES.length;
        const messageEl = document.querySelector('.rest-message');
        if (messageEl) {
            messageEl.textContent = REST_MESSAGES[messageIndex];
        }
    }, 5000);

    // Heal and increase bond over time
    restInterval = setInterval(() => {
        // Heal 1 HP every 3 seconds if needed
        if (!familiar.currentHp) familiar.currentHp = familiar.hp;
        if (familiar.currentHp < familiar.hp) {
            familiar.currentHp++;
            updateRestStats(familiar);
        }

        // Small chance to increase bond while resting
        if (Math.random() < 0.1) { // 10% chance every 3 seconds
            increaseBond(familiar, 1);
            updateRestStats(familiar);
        }

        saveGame();
    }, 3000);

    // Play ambient sound
    playSound('sounds/defend.wav');
}

function updateRestStats(familiar) {
    const hpEl = document.getElementById('rest-hp');
    const bondEl = document.getElementById('rest-bond');
    
    if (hpEl) hpEl.textContent = `${familiar.currentHp}/${familiar.hp}`;
    if (bondEl) bondEl.textContent = `${familiar.bond || 0}/100`;
}

function exitRestArea() {
    if (restInterval) {
        clearInterval(restInterval);
        restInterval = null;
    }
    if (messageInterval) {
        clearInterval(messageInterval);
        messageInterval = null;
    }

    const container = document.getElementById('rest-container');
    container.innerHTML = `
        <button onclick="initializeRestArea()" class="rest-btn">Enter Rest Area</button>
    `;

    const familiar = getActiveFamiliar();
    if (familiar) {
        showNotification(`${familiar.name} looks well-rested! ✨`);
    }

    saveGame();
}

// Clean up intervals when leaving page
window.addEventListener('beforeunload', () => {
    if (restInterval) clearInterval(restInterval);
    if (messageInterval) clearInterval(messageInterval);
});