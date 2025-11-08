// data.js
// Central game state and static data

// Centralized image paths
const IMG_PATHS = {
  inventory: "img/assets/inventory.png",
  crystal: "img/assets/100xp-crystal.png",
  sword: "img/assets/sword-magic.png",
  egg: "img/assets/egg.png",
  star: "img/assets/star.png",
  healthPot: "img/assets/health-pot.png",
  shop: "img/assets/shop.png",
  battle: "img/assets/battle.png",
  crate: "img/assets/crate.png",
  redClaws: "img/assets/red claws.png",
  defenseCharm: "img/assets/def-charm.png",
  greatHealth: "img/assets/greater-healing.png",
  xp500: "img/assets/500xp.png",
  expBoost: "img/assets/exp-boost.png",
  ancientTome: "img/assets/ancient-tome-of-wisdom.png",
  dragonsDiary: "img/assets/dragons-diary.png",
  magicSpellbook: "img/assets/magic-spellbook.png",
  goldenStamp: "img/assets/golden-stamp.png",
  magicToyBall: "img/assets/magic-toy-ball.png",
  moonlightFlower: "img/assets/moonlight-flower.png"
};

// Image mappings for familiars and enemies - defined first since they're used in gameState
const familiarImages = {
  shadowfangs: 'img/familiars/shadowfang.png',
  opalfelis: 'img/familiars/bigcat.png',
  dragon: 'img/familiars/dragon.png',
  finnakin: 'img/familiars/fennec.png',
  orbinus: 'img/familiars/fish.png',
  lucidae: 'img/familiars/unicorn.png',
  ursina: 'img/familiars/ursina.png',
  velarein: "img/familiars/deer.png",
  ellyphant: "img/familiars/ellyphant.png",
  lunari: "img/familiars/otter.png",
  hexena: "img/familiars/yena1.png",
  default: 'img/familiars/familiars.png'
};

const enemyImages = {
  goblin: 'img/enemies/goblin.png',
  slime: 'img/enemies/slime.png',
  golem: 'img/enemies/golem.png',
  blackslime: 'img/enemies/blackslime.png',
  blueslime: 'img/enemies/slimeblue.png',
  rockgolem: 'img/enemies/rockgolem.png',
   orc: 'img/enemies/orc.png',
  // harpy: 'img/enemies/firedog.jpg',
  // hydra: 'img/enemies/frog-mushroom-head.jpg',
  default: IMG_PATHS.battle
};

const materialIcons = {
  fireShard: '🔥',
  beastFur: '🦁',
  magicEssence: '✨',
  dragonScale: '🐉'
};
window.materialIcons = materialIcons;

// Game State
let gameState = {
  player: {
    class: 'Knight',
    buffs: {}
  },
  coins: 150,
  dust: 25,
  level: 1,
  xp: 0,
  lastDaily: null,
  activeFamiliarId: null, // Track which familiar is currently active
  materials: {}, // Materials inventory
  equipment: [], // Crafted equipment
  consumables: {}, // Crafted consumables
  familiars: [
    // Example familiars (images are placeholders; drop your images into assets/familiars and update paths)
  { id: 1, name: "Unicorn", species: "unicorn", color: "moss-green", marking: "none", level: 2, xp: 0, image: "img/familiars/unicorn.png", hunger: 95, thirst: 90, happiness: 92, hp: 60, attack: 12, defense: 10, speed: 25, library: [], collectibles: { stamps: [], toys: [], plants: [] } },
  { id: 2, name: "Silver Dragon", species: "dragon", color: "silver", marking: "runic", level: 8, xp: 0, image: "img/familiars/dragon.png", hunger: 70, thirst: 60, happiness: 80, hp: 120, attack: 25, defense: 15, speed: 10, library: [], collectibles: { stamps: [], toys: [], plants: [] } },
  { id: 3, name: "Ursina", species: "bear", color: "brown", marking: "striped", level: 6, xp: 0, image: "img/familiars/ursina.png", hunger: 80, thirst: 70, happiness: 85, hp: 110, attack: 22, defense: 14, speed: 13, library: [], collectibles: { stamps: [], toys: [], plants: [] } },
  { id: 4, name: "Shadowfang", species: "wolf", color: "black", marking: "none", level: 5, xp: 0, image: "img/familiars/shadowfang.png", hunger: 85, thirst: 75, happiness: 82, hp: 100, attack: 18, defense: 12, speed: 15, library: [], collectibles: { stamps: [], toys: [], plants: [] } },
  { id: 5, name: "Luna", species: "cat", color: "white", marking: "spotted", level: 4, xp: 0, image: "img/familiars/bigcat.png", hunger: 90, thirst: 80, happiness: 88, hp: 80, attack: 14, defense: 10, speed: 20, library: [], collectibles: { stamps: [], toys: [], plants: [] } },
  { id: 6, name: "Fennec", species: "fennec", color: "orange", marking: "none", level: 3, xp: 0, image: "img/familiars/fennec.png", hunger: 92, thirst: 85, happiness: 90, hp: 70, attack: 13, defense: 11, speed: 22, library: [], collectibles: { stamps: [], toys: [], plants: [] } },
  { id: 7, name: "Bubbles", species: "fish", color: "blue", marking: "striped", level: 1, xp: 0, image: "img/familiars/fish.png", hunger: 100, thirst: 100, happiness: 95, hp: 60, attack: 12, defense: 11, speed: 30, library: [], collectibles: { stamps: [], toys: [], plants: [] } },
  { id: 8, name: "Ellyphant", species: "ellyphant", color: "pink", marking: "polka-dotted", level: 7, xp: 0, image: "img/familiars/ellyphant.png", hunger: 75, thirst: 65, happiness: 83, hp: 130, attack: 20, defense: 18, speed: 8, library: [], collectibles: { stamps: [], toys: [], plants: [] } },
  { id: 9, name: "Yenna", species: "hyena", color: "golden", marking: "none", level: 4, xp: 0, image: "img/familiars/yena1.png", hunger: 88, thirst: 78, happiness: 87, hp: 999, attack: 20, defense: 30, speed: 20, library: [], collectibles: { stamps: [], toys: [], plants: [] } },
  { id: 10, name: "Otto", species: "otter", color: "brown", marking: "spotted", level: 2, xp: 0, image: "img/familiars/otter.png", hunger: 95, thirst: 90, happiness: 91, hp: 75, attack: 14, defense: 10, speed: 20, library: [], collectibles: { stamps: [], toys: [], plants: [] } },
  { id: 11, name: "Deer", species: "deer", color: "brown", marking: "spotted", level: 1, xp: 0, image: "img/familiars/deer.png", hunger: 100, thirst: 100, happiness: 95, hp: 80, attack: 13, defense: 10, speed: 20, library: [], collectibles: { stamps: [], toys: [], plants: [] } }
  ],
  pound: [],
  inventory: [
  // Starting Battle Items
  { id: 101, name: "Health Potion", image: IMG_PATHS.healthPot, quantity: 3, type: 'consumable', description: 'Restores 20 HP to your familiar during battle.', effect: { type: "heal", amount: 20 } },
  { id: 102, name: "Magic Crystal", image: IMG_PATHS.crystal, quantity: 1, type: 'consumable', description: 'Instantly grants 100 XP to your familiar.', effect: { type: "xp", amount: 100 } },
  { id: 103, name: "Defense Charm", image: IMG_PATHS.defenseCharm, quantity: 1, type: 'consumable', description: 'Increases your familiar\'s defense by 8 for the next battle.', effect: { type: "buff", stat: "defense", amount: 8, duration: 1 } }
  ],
  activities: {
    foraging: { active: false, progress: 0 },
    mining: { active: false, progress: 0 },
    fishing: { active: false, progress: 0 },
    catching: { active: false, progress: 0 }
  }
};

const shopItems = [
  // Battle Items
  { id: 201, name: "Health Potion", price: 20, currency: "coins", image: IMG_PATHS.healthPot, description: "Restores 20 HP to your familiar during battle.", type: "consumable", effect: { type: "heal", amount: 20 } },
  { id: 202, name: "Magic Sword", price: 100, currency: "coins", image: IMG_PATHS.sword, description: "Increases your familiar's attack by 10 for the next battle.", type: "consumable", effect: { type: "buff", stat: "attack", amount: 10, duration: 2 } },
  { id: 203, name: "Defense Charm", price: 75, currency: "coins", image: IMG_PATHS.defenseCharm, description: "Increases your familiar's defense by 8 for the next battle.", type: "consumable", effect: { type: "buff", stat: "defense", amount: 8, duration: 2 } },
  
  // Enhancement Items
  { id: 204, name: "Magic Crystal", price: 50, currency: "coins", image: IMG_PATHS.crystal, description: "Instantly grants 100 XP to your familiar.", type: "consumable", effect: { type: "xp", amount: 100 } },
  { id: 205, name: "Experience Boost", price: 30, currency: "coins", image: IMG_PATHS.expBoost, description: "Doubles XP gained in the next battle.", type: "consumable", effect: { type: "buff", stat: "xpGain", amount: 2, duration: 1 } },
  
  // Special Items
  { id: 206, name: "Mystery Box", price: 5, currency: "dust", image: IMG_PATHS.crate, description: "Contains a random valuable item!", type: "consumable" },
  
  // Premium Items (cost dust)
  { id: 207, name: "Great Health Potion", price: 10, currency: "dust", image: IMG_PATHS.greatHealth, description: "Fully restores your familiar's HP!", type: "consumable", effect: { type: "heal", amount: "max" } },
  { id: 208, name: "500 XP Crystal", price: 15, currency: "dust", image: IMG_PATHS.xp500, description: "Grants 500 XP to your familiar!", type: "consumable", effect: { type: "xp", amount: 500 } },
  
  // Books (collectible items)
  { id: 301, name: "Ancient Tome of Wisdom", price: 25, currency: "coins", image: IMG_PATHS.ancientTome, description: "A mysterious book that grants wisdom to your familiar.", type: "book", effect: { type: "book", title: "Ancient Tome of Wisdom", description: "Your familiar gains wisdom from this ancient text." } },
  { id: 302, name: "Dragon's Diary", price: 30, currency: "coins", image: IMG_PATHS.dragonsDiary, description: "The personal journal of an ancient dragon.", type: "book", effect: { type: "book", title: "Dragon's Diary", description: "Your familiar learns about dragon history." } },
  { id: 303, name: "Magic Spellbook", price: 35, currency: "coins", image: IMG_PATHS.magicSpellbook, description: "A book containing magical knowledge.", type: "book", effect: { type: "book", title: "Magic Spellbook", description: "Your familiar discovers magical secrets." } },
  
  // Collectible Items
  { id: 401, name: "Golden Stamp", price: 20, currency: "coins", image: IMG_PATHS.goldenStamp, description: "A beautiful golden stamp for your familiar's collection.", type: "collectible", effect: { type: "collectible", category: "stamps", name: "Golden Stamp", description: "A rare golden stamp." } },
  { id: 402, name: "Magic Toy Ball", price: 15, currency: "coins", image: IMG_PATHS.magicToyBall, description: "A magical toy that brings joy to familiars.", type: "collectible", effect: { type: "collectible", category: "toys", name: "Magic Toy Ball", description: "A glowing ball that never stops bouncing." } },
  { id: 403, name: "Moonlight Flower", price: 18, currency: "coins", image: IMG_PATHS.moonlightFlower, description: "A rare flower that glows in moonlight.", type: "collectible", effect: { type: "collectible", category: "plants", name: "Moonlight Flower", description: "A delicate flower that emits soft moonlight." } }
];

// Expose image maps globally
// Expose all needed variables globally
window.familiarImages = familiarImages;
window.enemyImages = enemyImages;
window.IMG_PATHS = IMG_PATHS;
window.gameState = gameState;  // Make sure gameState is available to other modules

// Hatchable familiars (used by eggs/mystery boxes)
// const hatchableFamiliars = [
//   { name: "Zephyr", image: familiarImages.shadowfang, hp: 100, attack: 20, defense: 10, speed: 25 },
//   { name: 'Pip', image: familiarImages.fish, hp: 60, attack: 8, defense: 6, speed: 30 },
//   { name: 'Smokey', image: familiarImages.dragon, hp: 110, attack: 23, defense: 12, speed: 12 },
//   { name: 'Fang', image: familiarImages.wolf, hp: 90, attack: 18, defense: 12, speed: 15 }
// ];

// Opponents for battles (images use enemyImages mapping or direct paths)
const opponents = [
  { id: 1, name: "Goblin Scavenger", level: 3, image: enemyImages.goblin, hp: 70, attack: 10, defense: 5, speed: 10 },
  { id: 2, name: "Slime", level: 5, image: enemyImages.slime, hp: 50, attack: 12, defense: 10, speed: 5 },
  { id: 3, name: "Golem", level: 7, image: enemyImages.golem, hp: 120, attack: 18, defense: 20, speed: 3 },
  { id: 4, name: "Black Slime", level: 4, image: enemyImages.blackslime, hp: 50, attack: 14, defense: 8, speed: 12 },
  { id: 5, name: "Blue Slime", level: 6, image: enemyImages.blueslime, hp: 50, attack: 16, defense: 9, speed: 18 },
  { id: 6, name: "Rock Golem", level: 5, image: enemyImages.rockgolem, hp: 120, attack: 15, defense: 10, speed: 8 },
  { id: 9, name: "Orc Warlord", level: 8, image: enemyImages.orc, hp: 80, attack: 22, defense: 15, speed: 5 }
  // { id: 7, name: "Giant Spider", level: 6, image: enemyImages.spider, hp: 100, attack: 18, defense: 12, speed: 10 },
  // { id: 8, name: "Harpy", level: 7, image: enemyImages.harpy, hp: 110, attack: 20, defense: 8, speed: 15 },
  // { id: 10, name: "Hydra", level: 10, image: enemyImages.hydra, hp: 200, attack: 25, defense: 18, speed: 7 }
];
