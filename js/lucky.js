// Lucky charm daily spin functionality
const REWARDS = [
    { type: 'coins', amount: 50, chance: 30, icon: '🪙' },
    { type: 'coins', amount: 100, chance: 15, icon: '🪙' },
    { type: 'dust', amount: 5, chance: 20, icon: '✨' },
    { type: 'dust', amount: 10, chance: 10, icon: '✨' },
    { type: 'xp', amount: 50, chance: 15, icon: '📚' },
    { type: 'healing', amount: 20, chance: 5, icon: '❤️' },
    { type: 'mystery', amount: 1, chance: 5, icon: '🎁' }
];

let isSpinning = false;

function spinLuckyCharm() {
    if (isSpinning) return;

    const today = new Date().toDateString();
    if (gameState.lastSpinDate === today) {
        showNotification("You've already used your Lucky Charm today! Come back tomorrow! ✨");
        return;
    }

    const wheel = document.getElementById('lucky-wheel');
    if (!wheel) {
        showNotification("Lucky Charm wheel not found!");
        return;
    }

    isSpinning = true;
    
    // Play spin sound
    if (typeof playSound === 'function') {
        playSound('sounds/win.wav');
    }

    // Visual spinning effect
    wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    const rotations = 5 + Math.random() * 3; // 5-8 full rotations
    wheel.style.transform = `rotate(${rotations * 360}deg)`;

    // Determine reward based on chances
    const reward = determineReward();

    // Complete spin after animation
    setTimeout(() => {
        applyReward(reward);
        isSpinning = false;
        gameState.lastSpinDate = today;
        try { _safeSave(); } catch (e) { try { if (typeof saveGame === 'function') saveGame(); } catch(e){} }
    }, 4000);
}

function determineReward() {
    const totalChance = REWARDS.reduce((sum, reward) => sum + reward.chance, 0);
    let random = Math.random() * totalChance;
    
    for (const reward of REWARDS) {
        if (random < reward.chance) {
            return reward;
        }
        random -= reward.chance;
    }
    
    return REWARDS[0]; // Fallback to first reward
}

function applyReward(reward) {
    let message = '';

    switch (reward.type) {
        case 'coins':
            gameState.coins += reward.amount;
            message = `You won ${reward.amount} coins! ${reward.icon}`;
            break;
        
        case 'dust':
            gameState.dust += reward.amount;
            message = `You won ${reward.amount} magical dust! ${reward.icon}`;
            break;
        
        case 'xp':
            const familiar = getActiveFamiliar();
            if (familiar) {
                familiar.xp = (familiar.xp || 0) + reward.amount;
                message = `${familiar.name} gained ${reward.amount} XP! ${reward.icon}`;
                levelUpFamiliar(familiar);
            } else {
                gameState.coins += 50;
                message = `No active familiar - received 50 coins instead! 🪙`;
            }
            break;
        
        case 'healing':
            const healFamiliar = getActiveFamiliar();
            if (healFamiliar) {
                const healAmount = Math.min(reward.amount, healFamiliar.hp - (healFamiliar.currentHp || 0));
                healFamiliar.currentHp = (healFamiliar.currentHp || 0) + healAmount;
                message = `${healFamiliar.name} recovered ${healAmount} HP! ${reward.icon}`;
            } else {
                gameState.coins += 50;
                message = `No active familiar - received 50 coins instead! 🪙`;
            }
            break;
        
        case 'mystery':
            gameState.coins += 75;
            message = `Mystery prize turned into 75 coins! 🪙`;
            break;
    }

    showNotification(message);
    celebrate();
    updateUI();
}

function createLuckyWheel() {
    const wheel = document.createElement('div');
    wheel.id = 'lucky-wheel';
    wheel.style.cssText = `
        width: 200px;
        height: 200px;
        background: linear-gradient(45deg, #2a0e3a, #4a1e6a);
        border: 3px solid #ffd700;
        border-radius: 50%;
        position: relative;
        margin: 20px auto;
        cursor: pointer;
        transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
    `;

    // Add reward sections
    REWARDS.forEach((reward, index) => {
        const section = document.createElement('div');
        section.style.cssText = `
            position: absolute;
            width: 50%;
            height: 2px;
            background: #ffd700;
            top: 50%;
            left: 50%;
            transform-origin: left;
            transform: rotate(${(index * 360) / REWARDS.length}deg);
        `;
        
        const icon = document.createElement('div');
        icon.style.cssText = `
            position: absolute;
            left: 70%;
            top: -10px;
            transform: translateX(-50%);
            font-size: 20px;
        `;
        icon.textContent = reward.icon;
        
        section.appendChild(icon);
        wheel.appendChild(section);
    });

    // Add spin button
    const spinButton = document.createElement('button');
    spinButton.textContent = 'Spin!';
    spinButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ffd700;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        cursor: pointer;
        font-weight: bold;
        color: #2a0e3a;
        z-index: 1;
    `;
    spinButton.onclick = spinLuckyCharm;

    wheel.appendChild(spinButton);
    return wheel;
}

// Export functions globally
window.spinLuckyCharm = spinLuckyCharm;
window.createLuckyWheel = createLuckyWheel;

// Auto-initialize the wheel when the page loads (append into container if present)
document.addEventListener('DOMContentLoaded', () => {
    try {
        const container = document.getElementById('lucky-wheel-container') || document.getElementById('lucky-container');
        if (container && typeof createLuckyWheel === 'function') {
            const wheel = createLuckyWheel();
            // clear existing content and append
            container.innerHTML = '';
            container.appendChild(wheel);
        }
    } catch (e) {
        console.warn('Lucky wheel init error', e);
    }
});

// Safe save helper used after awarding rewards
function _safeSave() {
    try {
        if (typeof saveGame === 'function') return saveGame();
        if (window.game && typeof window.game.save === 'function') return window.game.save();
        if (window.gameState) localStorage.setItem('familiarGameSave', JSON.stringify(window.gameState));
    } catch (e) {
        console.warn('Could not save game state after lucky spin', e);
    }
}