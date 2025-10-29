// familiar.js - Handles familiar bonding and interaction systems

// Bond thresholds and rewards
const BOND_THRESHOLDS = {
    25: { xp: 5, coins: 10, message: "seems to trust you more" },
    50: { xp: 10, coins: 25, message: "has grown quite attached to you" },
    100: { xp: 25, coins: 50, message: "has formed an unbreakable bond with you" }
};

function increaseBond(familiar, amount) {
    if (!familiar.bond) familiar.bond = 0;
    
    const oldBond = familiar.bond;
    familiar.bond = Math.min(100, familiar.bond + amount);
    
    // Check for crossing thresholds
    Object.entries(BOND_THRESHOLDS).forEach(([threshold, rewards]) => {
        if (oldBond < threshold && familiar.bond >= threshold) {
            // Award rewards
            if (rewards.xp) gainXP(rewards.xp);
            if (rewards.coins) gameState.coins += rewards.coins;
            
            // Show message
            showNotification(`${familiar.name} ${rewards.message}! ❤️`);
            celebrate();
        }
    });
    
    saveGame();
    return familiar.bond;
}

function renderFamiliarBond(familiar) {
    if (!familiar.bond) familiar.bond = 0;
    
    return `
        <div class="bond-meter">
            <div class="bond-fill" style="width: ${familiar.bond}%"></div>
            <span class="bond-text">❤️ Bond: ${familiar.bond}/100</span>
        </div>
    `;
}

// Add bond increase to various existing interactions
const originalInteractFamiliar = window.interactFamiliar || function(){};
window.interactFamiliar = function(familiarId) {
    const result = originalInteractFamiliar(familiarId);
    const familiar = gameState.familiars.find(f => f.id === familiarId);
    if (familiar) {
        increaseBond(familiar, 1);
    }
    return result;
};

// Expose functions globally
window.increaseBond = increaseBond;
window.renderFamiliarBond = renderFamiliarBond;