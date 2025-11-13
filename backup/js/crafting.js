// Materials and Crafting System
const RARITY_COLORS = {
    common: '#a0a0a0',
    rare: '#4169e1',
    epic: '#9932cc'
};

// Material definitions
const materials = {
    fireShard: {
        id: 'fireShard',
        name: 'Fire Shard',
        rarity: 'common',
        description: 'A warm crystal shard with flickering flames inside'
    },
    beastFur: {
        id: 'beastFur',
        name: 'Beast Fur',
        rarity: 'common',
        description: 'Soft and durable fur from wild creatures'
    },
    magicEssence: {
        id: 'magicEssence',
        name: 'Magic Essence',
        rarity: 'rare',
        description: 'Pure magical energy crystallized into a usable form'
    },
    dragonScale: {
        id: 'dragonScale',
        name: 'Dragon Scale',
        rarity: 'epic',
        description: 'An iridescent scale from a mighty dragon'
    }
};

// Recipe definitions
const recipes = {
    firePotion: {
        id: 'firePotion',
        name: 'Fire Potion',
        description: 'Increases your familiar\'s fire attacks',
        image: 'img/assets/crate.png',
        requiredMaterials: {
            fireShard: 2,
            magicEssence: 1
        },
        result: {
            type: 'consumable',
            effect: 'increaseDamage',
            value: 1.5,
            duration: 3
        }
    },
    beastArmor: {
        id: 'beastArmor',
        name: 'Beast Armor',
        description: 'Protective armor made from beast fur',
        image: 'img/assets/crate.png',
        requiredMaterials: {
            beastFur: 3,
            magicEssence: 1
        },
        result: {
            type: 'equipment',
            slot: 'armor',
            defense: 5
        }
    },
    dragonweave: {
        id: 'dragonweave',
        name: 'Dragonweave Cloak',
        description: 'A powerful cloak woven with dragon scales',
        image: 'img/assets/crate.png',
        requiredMaterials: {
            dragonScale: 1,
            beastFur: 2,
            magicEssence: 2
        },
        result: {
            type: 'equipment',
            slot: 'cloak',
            defense: 8,
            magicResist: 5
        },
        levelRequired: 5
    }
};

window.materials = materials;
window.recipes = recipes;

// Player's material inventory (will be stored in game save)
let materialInventory = {};

// Initialize materials inventory
function initializeMaterials() {
    if (!gameState.materials) {
        gameState.materials = {};
        Object.keys(materials).forEach(id => {
            gameState.materials[id] = 0;
        });
        saveGame();
    }
    materialInventory = gameState.materials;
    updateCraftingUI();
}

// Add materials to inventory (e.g., from battle rewards)
function addMaterial(materialId, amount) {
    if (!materialInventory[materialId]) {
        materialInventory[materialId] = 0;
    }
    materialInventory[materialId] += amount;
    gameState.materials = materialInventory;
    saveGame();
    updateCraftingUI();
    showNotification(`Obtained ${amount}x ${materials[materialId].name}!`);
}

// Check if player has enough materials for a recipe
function canCraftRecipe(recipe) {
    return Object.entries(recipe.requiredMaterials).every(([materialId, required]) => {
        return (materialInventory[materialId] || 0) >= required;
    }) && (!recipe.levelRequired || gameState.level >= recipe.levelRequired);
}

// Attempt to craft an item
function craftItem(recipeId) {
    const recipe = recipes[recipeId];
    if (!recipe) return false;

    if (!canCraftRecipe(recipe)) {
        showNotification('Not enough materials or level too low!');
        return false;
    }

    // Consume materials
    Object.entries(recipe.requiredMaterials).forEach(([materialId, amount]) => {
        materialInventory[materialId] -= amount;
    });

    // Add crafted item to inventory
    if (!gameState.inventory) {
        gameState.inventory = [];
    }

    const existingItem = gameState.inventory.find(i => i.name === recipe.name);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
        gameState.inventory.push({
            id: `${recipe.id}_${Date.now()}`,
            name: recipe.name,
            image: recipe.image,
            quantity: 1,
            type: recipe.result.type,
            description: recipe.description,
            effect: recipe.result
        });
    }

    gameState.materials = materialInventory;
    saveGame();
    updateCraftingUI();
    if (typeof renderInventory === 'function') {
        renderInventory();
    }
    playSound('craft');
    showCraftedItemPopup(recipe);
    return true;
}

// Update the crafting UI
function updateCraftingUI() {
    const container = document.getElementById('craftingContainer');
    if (!container) return;

    container.innerHTML = '';

    // Materials section
    const materialsSection = document.createElement('div');
    materialsSection.className = 'crafting-section';
    materialsSection.innerHTML = '<h3>Materials</h3>';
    
    const materialsGrid = document.createElement('div');
    materialsGrid.className = 'materials-grid';
    
    Object.values(materials).forEach(material => {
        const amount = materialInventory[material.id] || 0;
        const materialEl = document.createElement('div');
        materialEl.className = 'material-item';
        materialEl.style.borderColor = RARITY_COLORS[material.rarity];
        materialEl.innerHTML = `
            <h4>${material.name}</h4>
            <p class="amount">Owned: ${amount}</p>
            <p class="rarity">${material.rarity}</p>
            <p class="description">${material.description}</p>
        `;
        materialsGrid.appendChild(materialEl);
    });
    
    materialsSection.appendChild(materialsGrid);
    container.appendChild(materialsSection);

    // Recipes section
    const recipesSection = document.createElement('div');
    recipesSection.className = 'crafting-section';
    recipesSection.innerHTML = '<h3>Available Recipes</h3>';
    
    const recipesGrid = document.createElement('div');
    recipesGrid.className = 'recipes-grid';
    
    Object.values(recipes).forEach(recipe => {
        const canCraft = canCraftRecipe(recipe);
        const recipeEl = document.createElement('div');
        recipeEl.className = `recipe-item ${canCraft ? 'can-craft' : ''}`;
        
        let materialsHtml = '';
        Object.entries(recipe.requiredMaterials).forEach(([materialId, amount]) => {
            const owned = materialInventory[materialId] || 0;
            const material = materials[materialId];
            materialsHtml += `
                <div class="recipe-material ${owned >= amount ? 'has-enough' : ''}">
                    ${material.name}: ${owned}/${amount}
                </div>
            `;
        });

        recipeEl.innerHTML = `
            <h4>${recipe.name}</h4>
            <p class="description">${recipe.description}</p>
            <div class="required-materials">
                ${materialsHtml}
            </div>
            ${recipe.levelRequired ? `<p class="level-req">Level ${recipe.levelRequired} Required</p>` : ''}
            <button class="craft-btn" ${!canCraft ? 'disabled' : ''} onclick="craftItem('${recipe.id}')">
                Craft
            </button>
        `;
        
        recipesGrid.appendChild(recipeEl);
    });
    
    recipesSection.appendChild(recipesGrid);
    container.appendChild(recipesSection);
}

// Add battle rewards (to be called after winning a battle)
function addBattleRewards(enemyLevel) {
    const rewards = [];
    const rarityChances = {
        common: 0.7,
        rare: 0.25,
        epic: 0.05
    };

    // Generate 1-3 material rewards based on enemy level
    const numRewards = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numRewards; i++) {
        const roll = Math.random();
        let rarity;
        
        if (roll < rarityChances.common) rarity = 'common';
        else if (roll < rarityChances.common + rarityChances.rare) rarity = 'rare';
        else rarity = 'epic';

        // Filter materials by rarity and randomly select one
        const possibleMaterials = Object.values(materials).filter(m => m.rarity === rarity);
        if (possibleMaterials.length > 0) {
            const material = possibleMaterials[Math.floor(Math.random() * possibleMaterials.length)];
            const amount = rarity === 'epic' ? 1 : rarity === 'rare' ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 1;
            
            rewards.push({ materialId: material.id, amount });
            addMaterial(material.id, amount);
        }
    }

    return rewards;
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initializeMaterials);

// Add to game's save/load system
const originalLoadGame = window.loadGame;
window.loadGame = function() {
    originalLoadGame();
    if (gameState.materials) {
        materialInventory = gameState.materials;
        updateCraftingUI();
    }
};