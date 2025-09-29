// data.js
// Central game state and static data

// Game State
let gameState = {
  player: {
    class: 'Knight'
  },
  coins: 150,
  dust: 25,
  level: 1,
  xp: 0,
  lastDaily: null,
  familiars: [
    // Example familiars (images are placeholders; drop your images into assets/familiars and update paths)
  { id: 1, name: "Grumblenook", species: "grumblenook", color: "moss-green", marking: "none", level: 2, xp: 0, image: "img/pets.jpg", hunger: 95, thirst: 90, happiness: 92, hp: 60, attack: 12, defense: 6, speed: 25 },
  { id: 2, name: "Silver Dragon", species: "dragon", color: "silver", marking: "runic", level: 8, xp: 0, image: "img/dragon.png", hunger: 70, thirst: 60, happiness: 80, hp: 120, attack: 25, defense: 15, speed: 10 },
  { id: 3, name: "Thistle", species: "hippogriff", color: "brown", marking: "striped", level: 6, xp: 0, image: "img/griffin.jpg", hunger: 80, thirst: 70, happiness: 85, hp: 110, attack: 22, defense: 14, speed: 13 }
  ],
  inventory: [
  { id: 101, name: "Health Potion", image: "img/inventory.jpg", quantity: 3, type: 'consumable', description: 'Restores familiar happiness and slightly heals.' },
  { id: 102, name: "Magic Crystal", image: "img/inventory.jpg", quantity: 1, type: 'consumable', description: 'Grants bonus XP when used.' }
  ],
  activities: {
    foraging: { active: false, progress: 0 },
    mining: { active: false, progress: 0 },
    fishing: { active: false, progress: 0 },
    catching: { active: false, progress: 0 }
  }
};

// Shop items: prefer `image` paths over emoji. Drop images into assets/shop
const shopItems = [
  { id: 201, name: "Health Potion", price: 20, currency: "coins", image: "img/inventory.jpg", description: "Restores 20 health to all familiars.", type: "consumable" },
  { id: 202, name: "Magic Sword", price: 100, currency: "coins", image: "img/inventory.jpg", description: "Increases your familiar's attack by 10 for the next battle.", type: "consumable" },
  { id: 203, name: "Rare Familiar Egg", price: 15, currency: "dust", image: "img/inventory.jpg", type: "egg", description: "A rare egg that can be hatched into a powerful familiar." },
  { id: 204, name: "Experience Boost", price: 30, currency: "coins", image: "img/inventory.jpg", description: "Doubles the XP gained for the next 3 activities.", type: "consumable" },
  { id: 205, name: "Mystery Box", price: 5, currency: "dust", image: "img/inventory.jpg", description: "Contains a random item from the shop." },
  // A familiar purchasable directly
  { id: 301, type: "familiar", name: "Griffin", price: 50, currency: "dust", image: "img/griffin.jpg", hp: 110, attack: 22, defense: 12, speed: 18, description: "A majestic creature." }
];

// Image mappings (fallbacks) — you can drop images in these folders and update keys
const familiarImages = {
  wolf: 'img/wolf.jpg',
  cat: 'img/cat.png',
  dragon: 'img/dragon.png',
  griffin: 'img/griffin.jpg',
  hippogriff: 'img/griffin.jpg',
  grumblenook: 'img/pets.jpg',
  default: 'img/pets.jpg'
};

const enemyImages = {
  goblin: 'img/goblin.png',
  slime: 'img/slime.png',
  golem: 'img/golem.png',
  warg: 'img/batcat.jpg',
  raven: 'img/black-cat.jpg',
  boar: 'img/crystal-pig.jpg',
  spider: 'img/cute-deserrt-thing.jpg',
  harpy: 'img/firedog.jpg',
  orc: 'img/orc.png',
  hydra: 'img/frog-mushroom-head.jpg',
  default: 'img/pets.jpg'
};

// Expose image maps globally
window.familiarImages = familiarImages;
window.enemyImages = enemyImages;

// Hatchable familiars (used by eggs/mystery boxes)
const hatchableFamiliars = [
  { name: "Zephyr", image: familiarImages.griffin, hp: 100, attack: 20, defense: 10, speed: 25 },
  { name: 'Pip', image: familiarImages.cat, hp: 60, attack: 8, defense: 6, speed: 30 },
  { name: 'Smokey', image: familiarImages.dragon, hp: 110, attack: 23, defense: 12, speed: 12 },
  { name: 'Fang', image: familiarImages.wolf, hp: 90, attack: 18, defense: 12, speed: 15 }
];

// Opponents for battles (images use enemyImages mapping or direct paths)
const opponents = [
  { id: 1, name: "Goblin Scavenger", level: 3, image: enemyImages.goblin, hp: 50, attack: 10, defense: 5, speed: 10 },
  { id: 2, name: "Slime", level: 5, image: enemyImages.slime, hp: 70, attack: 12, defense: 10, speed: 5 },
  { id: 3, name: "Golem", level: 7, image: enemyImages.golem, hp: 150, attack: 18, defense: 20, speed: 3 },
  { id: 4, name: "Warg", level: 4, image: enemyImages.warg, hp: 80, attack: 14, defense: 8, speed: 12 },
  { id: 5, name: "Raven", level: 6, image: enemyImages.raven, hp: 90, attack: 16, defense: 9, speed: 18 },
  { id: 6, name: "Wild Boar", level: 5, image: enemyImages.boar, hp: 90, attack: 15, defense: 10, speed: 8 },
  { id: 7, name: "Giant Spider", level: 6, image: enemyImages.spider, hp: 100, attack: 18, defense: 12, speed: 10 },
  { id: 8, name: "Harpy", level: 7, image: enemyImages.harpy, hp: 110, attack: 20, defense: 8, speed: 15 },
  { id: 9, name: "Orc Warlord", level: 8, image: enemyImages.orc, hp: 130, attack: 22, defense: 15, speed: 5 },
  { id: 10, name: "Hydra", level: 10, image: enemyImages.hydra, hp: 200, attack: 25, defense: 18, speed: 7 }
];
