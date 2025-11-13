// Training system for familiar stat improvements
const TRAINING_COST = 10; // coins
const TRAINING_DURATION = 5000; // 5 seconds
const GREAT_SUCCESS_CHANCE = 0.2; // 20% chance for +2 instead of +1

function startTraining(stat) {
    const familiar = getActiveFamiliar();
    if (!familiar) {
        showNotification("You need to select an active familiar first!");
        return;
    }

    if (gameState.coins < TRAINING_COST) {
        showNotification("Not enough coins for training!");
        return;
    }

    // Get UI elements
    const container = document.querySelector(`.training-option:has(button[onclick*="${stat}"])`);
    const button = container.querySelector('.training-btn');
    const progressContainer = container.querySelector('.progress-container');
    const progressBar = progressContainer.querySelector('.progress-fill');

    // Disable button and show progress
    button.disabled = true;
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';

    // Animate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            completeTraining(stat, familiar);
            progressContainer.style.display = 'none';
            button.disabled = false;
        }
    }, TRAINING_DURATION / 50);

    // Play training sound
    playSound('sounds/defend.wav');

    // Deduct cost immediately
    gameState.coins -= TRAINING_COST;
    updateUI();
}

function completeTraining(stat, familiar) {
    const isGreatSuccess = Math.random() < GREAT_SUCCESS_CHANCE;
    const increase = isGreatSuccess ? 2 : 1;
    
    // Apply stat increase
    switch (stat) {
        case 'attack':
            familiar.attack = (familiar.attack || 0) + increase;
            break;
        case 'defense':
            familiar.defense = (familiar.defense || 0) + increase;
            break;
        case 'speed':
            familiar.speed = (familiar.speed || 0) + increase;
            break;
    }

    // Update familiar bond
    increaseBond(familiar, 5);
    
    // Show success message
    const message = isGreatSuccess 
        ? `Great success! ${familiar.name}'s ${stat} increased by ${increase}! ⚔️✨` 
        : `${familiar.name}'s ${stat} increased by ${increase}! ⚔️`;
    
    showNotification(message);
    
    // Play success sound
    playSound('sounds/win.wav');
    
    // Save changes
    saveGame();
    renderFamiliars();
}

function initializeTrainingArea() {
    const familiar = getActiveFamiliar();
    if (!familiar) {
        document.getElementById('active-familiar-display').innerHTML = '<p>Select an active familiar to begin training!</p>';
        return;
    }

    document.getElementById('active-familiar-display').innerHTML = `
        <div class="familiar-card active">
            <img src="${familiar.image}" alt="${familiar.name}" class="familiar-image">
            <h3>${familiar.name}</h3>
            <div class="familiar-stats">
                <p>⚔️ Attack: ${familiar.attack || 0}</p>
                <p>🛡️ Defense: ${familiar.defense || 0}</p>
                <p>⚡ Speed: ${familiar.speed || 0}</p>
                <p>❤️ Bond: ${familiar.bond || 0}</p>
            </div>
        </div>
    `;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeTrainingArea();
    updateUI();
});