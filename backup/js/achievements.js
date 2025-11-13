// achievements.js
const achievements = {
    // Familiar Achievements
    firstFamiliar: {
        title: 'A New Friend',
        description: 'Adopt your first familiar',
        icon: '🐾'
    },
    fiveFamiliars: {
        title: 'Familiar Collector',
        description: 'Own 5 different familiars',
        icon: '👑'
    },
    maxLevel: {
        title: 'Level Master',
        description: 'Get a familiar to level 10',
        icon: '⭐'
    },

    // Battle Achievements
    firstBattle: {
        title: 'Battle Initiate',
        description: 'Win your first battle',
        icon: '⚔️'
    },
    tenBattles: {
        title: 'Battle Champion',
        description: 'Win 10 battles',
        icon: '🏆'
    },

    // Wealth Achievements
    richPlayer: {
        title: 'Fortune Finder',
        description: 'Accumulate 1000 coins',
        icon: '💰'
    },
    dustCollector: {
        title: 'Dust Gatherer',
        description: 'Accumulate 100 dust',
        icon: '✨'
    },

    // Level Achievements
    reachLevel5: {
        title: 'Rising Star',
        description: 'Reach player level 5',
        icon: '🌟'
    },
    reachLevel10: {
        title: 'Elite Trainer',
        description: 'Reach player level 10',
        icon: '👑'
    },

    // Activity Achievements
    allActivities: {
        title: 'Jack of All Trades',
        description: 'Try each activity once',
        icon: '🎯'
    },
    fiftyActivities: {
        title: 'Dedicated Player',
        description: 'Complete 50 activities',
        icon: '🌟'
    }
};

// Function to check if achievement should be unlocked
function checkAchievement(id) {
    if (!gameState.achievements) {
        gameState.achievements = {};
    }

    // Don't check if already achieved
    if (gameState.achievements[id]) return false;

    let achieved = false;
    
    switch(id) {
        case 'firstFamiliar':
            achieved = gameState.familiars && gameState.familiars.length > 0;
            break;
        case 'fiveFamiliars':
            achieved = gameState.familiars && gameState.familiars.length >= 5;
            break;
        case 'maxLevel':
            achieved = gameState.familiars && gameState.familiars.some(f => f.level >= 10);
            break;
        case 'richPlayer':
            achieved = gameState.coins >= 1000;
            break;
        case 'dustCollector':
            achieved = gameState.dust >= 100;
            break;
        case 'reachLevel5':
            achieved = gameState.level >= 5;
            break;
        case 'reachLevel10':
            achieved = gameState.level >= 10;
            break;
    }

    if (achieved) {
        gameState.achievements[id] = {
            date: new Date().toISOString(),
            unlocked: true
        };
        showAchievementPopup(id);
        saveGame();
    }

    return achieved;
}

// Function to check all achievements
function checkAllAchievements() {
    Object.keys(achievements).forEach(checkAchievement);
}

// Function to show achievement popup
function showAchievementPopup(achievementId) {
    const achievement = achievements[achievementId];
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
            <div class="achievement-title">Achievement Unlocked!</div>
            <div class="achievement-name">${achievement.title}</div>
        </div>
    `;
    document.body.appendChild(popup);

    // Add animations
    setTimeout(() => {
        popup.classList.add('show');
        playSound('sounds/win.wav');
    }, 100);

    // Remove popup after animation
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}

// Function to render achievements page
function renderAchievementsPage() {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    // Initialize achievements if needed
    if (!gameState.achievements) {
        gameState.achievements = {};
    }

    let html = '<div class="achievements-grid">';
    
    Object.entries(achievements).forEach(([id, achievement]) => {
        const isUnlocked = gameState.achievements[id]?.unlocked;
        html += `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                    ${!isUnlocked ? getAchievementProgress(id) : '<div class="achievement-date">Completed</div>'}
                </div>
                ${isUnlocked ? '<div class="achievement-complete">✓</div>' : ''}
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Function to get achievement progress
function getAchievementProgress(id) {
    let progress = '';
    switch(id) {
        case 'firstFamiliar':
            if (!gameState.familiars || gameState.familiars.length === 0) {
                progress = 'Adopt your first familiar from the pound';
            }
            break;
        case 'fiveFamiliars':
            const familiarCount = gameState.familiars ? gameState.familiars.length : 0;
            progress = `Progress: ${familiarCount}/5 familiars`;
            break;
        case 'maxLevel':
            const highestLevel = gameState.familiars ? 
                Math.max(...gameState.familiars.map(f => f.level), 0) : 0;
            progress = `Highest familiar level: ${highestLevel}/10`;
            break;
        case 'richPlayer':
            progress = `Progress: ${gameState.coins || 0}/1000 coins`;
            break;
        case 'dustCollector':
            progress = `Progress: ${gameState.dust || 0}/100 dust`;
            break;
        case 'reachLevel5':
            progress = `Current level: ${gameState.level || 1}/5`;
            break;
        case 'reachLevel10':
            progress = `Current level: ${gameState.level || 1}/10`;
            break;
        case 'allActivities':
            const activities = ['foraging', 'mining', 'fishing', 'catching'];
            const completedTypes = Object.keys(gameState.completedActivityTypes || {}).length;
            progress = `Activities tried: ${completedTypes}/${activities.length}`;
            break;
        case 'fiftyActivities':
            const totalActivities = gameState.activitiesCompleted || 0;
            progress = `Total activities: ${totalActivities}/50`;
            break;
    }
    return progress ? `<div class="achievement-progress">${progress}</div>` : '';
}

// Add to game's existing update cycle
const originalUpdateUI = window.updateUI;
window.updateUI = function() {
    if (originalUpdateUI) originalUpdateUI();
    checkAllAchievements();
};