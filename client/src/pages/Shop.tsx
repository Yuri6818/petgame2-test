import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBodyClass } from "../hooks/useBodyClass";

interface ShopItem {
  id: number;
  name: string;
  price: number;
  currency: "coins" | "dust";
  image: string;
  description: string;
  type: string;
  effect?: Record<string, unknown>;
}

const shopItems: ShopItem[] = [
  // Battle Items
  {
    id: 201,
    name: "Health Potion",
    price: 20,
    currency: "coins",
    image: "/img/assets/health-pot.png",
    description: "Restores 20 HP to your familiar during battle.",
    type: "consumable",
    effect: { type: "heal", amount: 20 },
  },
  {
    id: 202,
    name: "Magic Sword",
    price: 100,
    currency: "coins",
    image: "/img/assets/sword-magic.png",
    description: "Increases your familiar's attack by 10 for the next battle.",
    type: "consumable",
    effect: { type: "buff", stat: "attack", amount: 10, duration: 2 },
  },
  {
    id: 203,
    name: "Defense Charm",
    price: 75,
    currency: "coins",
    image: "/img/assets/def-charm.png",
    description: "Increases your familiar's defense by 8 for the next battle.",
    type: "consumable",
    effect: { type: "buff", stat: "defense", amount: 8, duration: 2 },
  },

  // Enhancement Items
  {
    id: 204,
    name: "Magic Crystal",
    price: 50,
    currency: "coins",
    image: "/img/assets/100xp-crystal.png",
    description: "Instantly grants 100 XP to your familiar.",
    type: "consumable",
    effect: { type: "xp", amount: 100 },
  },
  {
    id: 205,
    name: "Experience Boost",
    price: 30,
    currency: "coins",
    image: "/img/assets/exp-boost.png",
    description: "Doubles XP gained in the next battle.",
    type: "consumable",
    effect: { type: "buff", stat: "xpGain", amount: 2, duration: 1 },
  },

  // Special Items
  {
    id: 206,
    name: "Mystery Box",
    price: 5,
    currency: "dust",
    image: "/img/assets/crate.png",
    description: "Contains a random valuable item!",
    type: "consumable",
  },

  // Premium Items (cost dust)
  {
    id: 207,
    name: "Great Health Potion",
    price: 10,
    currency: "dust",
    image: "/img/assets/greater-healing.png",
    description: "Fully restores your familiar's HP!",
    type: "consumable",
    effect: { type: "heal", amount: "max" },
  },
  {
    id: 208,
    name: "500 XP Crystal",
    price: 15,
    currency: "dust",
    image: "/img/assets/500xp.png",
    description: "Grants 500 XP to your familiar!",
    type: "consumable",
    effect: { type: "xp", amount: 500 },
  },

  // Books (collectible items)
  {
    id: 301,
    name: "Ancient Tome of Wisdom",
    price: 25,
    currency: "coins",
    image: "/img/assets/ancient-tome-of-wisdom.png",
    description: "A mysterious book that grants wisdom to your familiar.",
    type: "book",
    effect: {
      type: "book",
      title: "Ancient Tome of Wisdom",
      description: "Your familiar gains wisdom from this ancient text.",
    },
  },
  {
    id: 302,
    name: "Dragon's Diary",
    price: 30,
    currency: "coins",
    image: "/img/assets/dragons-diary.png",
    description: "The personal journal of an ancient dragon.",
    type: "book",
    effect: {
      type: "book",
      title: "Dragon's Diary",
      description: "Your familiar learns about dragon history.",
    },
  },
  {
    id: 303,
    name: "Magic Spellbook",
    price: 35,
    currency: "coins",
    image: "/img/assets/magic-spellbook.png",
    description: "A book containing magical knowledge.",
    type: "book",
    effect: {
      type: "book",
      title: "Magic Spellbook",
      description: "Your familiar discovers magical secrets.",
    },
  },

  // Collectible Items
  {
    id: 401,
    name: "Golden Stamp",
    price: 20,
    currency: "coins",
    image: "/img/assets/golden-stamp.png",
    description: "A beautiful golden stamp for your familiar's collection.",
    type: "collectible",
    effect: {
      type: "collectible",
      category: "stamps",
      name: "Golden Stamp",
      description: "A rare golden stamp.",
    },
  },
  {
    id: 402,
    name: "Magic Toy Ball",
    price: 15,
    currency: "coins",
    image: "/img/assets/magic-toy-ball.png",
    description: "A magical toy that brings joy to familiars.",
    type: "collectible",
    effect: {
      type: "collectible",
      category: "toys",
      name: "Magic Toy Ball",
      description: "A glowing ball that never stops bouncing.",
    },
  },
  {
    id: 403,
    name: "Moonlight Flower",
    price: 18,
    currency: "coins",
    image: "/img/assets/moonlight-flower.png",
    description: "A rare flower that glows in moonlight.",
    type: "collectible",
    effect: {
      type: "collectible",
      category: "plants",
      name: "Moonlight Flower",
      description: "A delicate flower that emits soft moonlight.",
    },
  },
];

export default function Shop() {
  useBodyClass();
  const [coins, setCoins] = useState(150);
  const [dust, setDust] = useState(25);
  const [level] = useState(1);
  const [xp] = useState(0);

  useEffect(() => {
    // Update timer
    const timer = setInterval(() => {
      const now = new Date();
      const serverTimeEl = document.getElementById("serverTime");
      if (serverTimeEl) {
        serverTimeEl.textContent = now.toLocaleTimeString();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBuy = (item: ShopItem) => {
    const canAfford = (item.currency === "coins" ? coins : dust) >= item.price;
    if (canAfford) {
      if (item.currency === "coins") {
        setCoins(coins - item.price);
      } else {
        setDust(dust - item.price);
      }
      alert(`Bought ${item.name}!`);
    } else {
      alert(`Not enough ${item.currency}!`);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>
          <img
            src="/img/assets/fabledfamiliarsbannersmall.png"
            alt="Scroll Icon"
            style={{
              height: "3em",
              verticalAlign: "middle",
              marginRight: "0em",
            }}
          />
        </h1>
        <div className="timer" id="serverTime"></div>

        <div className="nav">
          <Link to="/" id="btn-home" className="nav-btn">
            <img src="/img/assets/house.png" className="nav-icon" alt="Home" />{" "}
            Home
          </Link>
          <Link to="/familiars" id="btn-familiars" className="nav-btn">
            <img
              src="/img/familiars/familiars.png"
              className="nav-icon"
              alt="Familiars"
            />{" "}
            Familiars
          </Link>
          <Link to="/inventory" id="btn-inventory" className="nav-btn">
            <img
              src="/img/assets/crate.png"
              className="nav-icon"
              alt="Inventory"
            />{" "}
            Inventory
          </Link>
          <Link to="/shop" id="btn-shop" className="nav-btn active">
            <img
              src="/img/assets/shopicon.png"
              className="nav-icon"
              alt="Shop"
            />{" "}
            Shop
          </Link>
          <Link to="/activities" id="btn-activities" className="nav-btn">
            <img
              src="/img/assets/target.png"
              className="nav-icon"
              alt="Activities"
            />{" "}
            Activities
          </Link>
          <Link to="/adopt" id="btn-adopt" className="nav-btn">
            <img
              src="/img/assets/adopt-sign1.png"
              className="nav-icon"
              alt="Adopt"
            />{" "}
            Adopt
          </Link>
          <Link to="/pound" id="btn-pound" className="nav-btn">
            <img
              src="/img/assets/pound-sign.png"
              className="nav-icon"
              alt="Pound"
            />{" "}
            Pound
          </Link>
          <Link
            to="/battle"
            id="btn-battle"
            className="nav-btn"
            style={{ display: "none" }}
          >
            <img
              src="/img/assets/battle.png"
              className="nav-icon"
              alt="Battle"
            />{" "}
            Battle
          </Link>
          <Link to="/training" id="btn-training" className="nav-btn">
            <img
              src="/img/assets/training-page.png"
              className="nav-icon"
              alt="Training"
            />{" "}
            Training
          </Link>
        </div>

        <div className="status-bar">
          <div className="status-item">
            <img
              src="/img/assets/coins.png"
              className="status-icon"
              alt="Coins"
            />{" "}
            Coins: <span id="coinCount">{coins}</span>
          </div>
          <div className="status-item">
            <img
              src="/img/assets/dust.png"
              className="status-icon"
              alt="Dust"
            />{" "}
            Dust: <span id="dustCount">{dust}</span>
          </div>
          <div className="status-item">
            <img
              src="/img/assets/training-page.png"
              className="status-icon"
              alt="Level"
            />{" "}
            Level: <span id="playerLevel">{level}</span>
          </div>
          <div className="status-item">
            ⭐ XP: <span id="playerXP">{xp}</span>/100
          </div>
          <button
            id="mute-btn"
            className="nav-btn"
            onClick={() => window.toggleMute?.()}
          >
            Mute
          </button>
          <button
            id="clear-save-btn"
            className="nav-btn"
            onClick={() => window.clearSave?.()}
          >
            Clear Save
          </button>
        </div>
      </div>

      {/* Shop Section */}
      <div className="section active" id="shop">
        <h2>🛒 Mystical Shop</h2>
        <p>Purchase items and familiars to enhance your adventure!</p>
        <div className="grid">
          {shopItems.map((item) => {
            const canAfford =
              (item.currency === "coins" ? coins : dust) >= item.price;
            return (
              <div key={item.id} className="card shop-card">
                <div className="card-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "12px",
                    }}
                    onError={(e) =>
                      (e.currentTarget.src = "/img/assets/shop.png")
                    }
                  />
                </div>
                <h3>{item.name}</h3>
                {item.description && <p>{item.description}</p>}
                <div className="price">
                  <strong>
                    {item.currency === "coins" ? "Coins" : "Dust"}:
                  </strong>{" "}
                  {item.price}
                </div>
                <button
                  className="btn"
                  disabled={!canAfford}
                  onClick={() => handleBuy(item)}
                >
                  Buy
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
