import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBodyClass } from "../hooks/useBodyClass";

interface InventoryItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  type: string;
  description: string;
  effect?: Record<string, unknown>;
}

const defaultInventory: InventoryItem[] = [
  {
    id: 101,
    name: "Health Potion",
    image: "/img/assets/health-pot.png",
    quantity: 3,
    type: "consumable",
    description: "Restores 20 HP to your familiar during battle.",
    effect: { type: "heal", amount: 20 },
  },
  {
    id: 102,
    name: "Magic Crystal",
    image: "/img/assets/100xp-crystal.png",
    quantity: 1,
    type: "consumable",
    description: "Instantly grants 100 XP to your familiar.",
    effect: { type: "xp", amount: 100 },
  },
  {
    id: 103,
    name: "Defense Charm",
    image: "/img/assets/def-charm.png",
    quantity: 1,
    type: "consumable",
    description: "Increases your familiar's defense by 8 for the next battle.",
    effect: { type: "buff", stat: "defense", amount: 8, duration: 1 },
  },
];

export default function Inventory() {
  useBodyClass();
  const [coins] = useState(150);
  const [dust] = useState(25);
  const [level] = useState(1);
  const [xp] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>(defaultInventory);

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

  const handleUse = (itemId: number) => {
    setInventory((inv) =>
      inv
        .map((item) =>
          item.id === itemId && item.quantity > 0
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0 || item.id !== itemId)
    );
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
          <Link to="/inventory" id="btn-inventory" className="nav-btn active">
            <img
              src="/img/assets/crate.png"
              className="nav-icon"
              alt="Inventory"
            />{" "}
            Inventory
          </Link>
          <Link to="/shop" id="btn-shop" className="nav-btn">
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

      <div className="section active" id="inventory">
        <h2>📦 Your Inventory</h2>
        <p>Items and treasures you've collected on your journey.</p>
        <div className="grid">
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <div key={item.id} className="card item-card">
                <div className="card-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "64px", height: "64px" }}
                    onError={(e) =>
                      (e.currentTarget.src = "/img/assets/shop.png")
                    }
                  />
                </div>
                <h3>{item.name}</h3>
                {item.description && <p>{item.description}</p>}
                <p>Qty: {item.quantity}</p>
                <button className="btn" onClick={() => handleUse(item.id)}>
                  Use
                </button>
              </div>
            ))
          ) : (
            <p style={{ gridColumn: "1 / -1" }}>Your inventory is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}
