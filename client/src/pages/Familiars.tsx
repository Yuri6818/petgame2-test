import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBodyClass } from "../hooks/useBodyClass";

interface Familiar {
  id: number;
  name: string;
  species: string;
  color: string;
  marking: string;
  level: number;
  xp: number;
  image: string;
  hunger: number;
  thirst: number;
  happiness: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  library: unknown[];
  collectibles: { stamps: unknown[]; toys: unknown[]; plants: unknown[] };
}

const defaultFamiliars: Familiar[] = [
  {
    id: 1,
    name: "Unicorn",
    species: "unicorn",
    color: "moss-green",
    marking: "none",
    level: 2,
    xp: 0,
    image: "/img/familiars/unicorn.png",
    hunger: 95,
    thirst: 90,
    happiness: 92,
    hp: 60,
    attack: 12,
    defense: 10,
    speed: 25,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
  {
    id: 2,
    name: "Silver Dragon",
    species: "dragon",
    color: "silver",
    marking: "runic",
    level: 8,
    xp: 0,
    image: "/img/familiars/dragon.png",
    hunger: 70,
    thirst: 60,
    happiness: 80,
    hp: 120,
    attack: 25,
    defense: 15,
    speed: 10,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
  {
    id: 3,
    name: "Ursina",
    species: "bear",
    color: "brown",
    marking: "striped",
    level: 6,
    xp: 0,
    image: "/img/familiars/ursina.png",
    hunger: 80,
    thirst: 70,
    happiness: 85,
    hp: 110,
    attack: 22,
    defense: 14,
    speed: 13,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
  {
    id: 4,
    name: "Shadowfang",
    species: "wolf",
    color: "black",
    marking: "none",
    level: 5,
    xp: 0,
    image: "/img/familiars/shadowfang.png",
    hunger: 85,
    thirst: 75,
    happiness: 82,
    hp: 100,
    attack: 18,
    defense: 12,
    speed: 15,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
  {
    id: 5,
    name: "Luna",
    species: "cat",
    color: "white",
    marking: "spotted",
    level: 4,
    xp: 0,
    image: "/img/familiars/bigcat.png",
    hunger: 90,
    thirst: 80,
    happiness: 88,
    hp: 80,
    attack: 14,
    defense: 10,
    speed: 20,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
  {
    id: 6,
    name: "Fennec",
    species: "fennec",
    color: "orange",
    marking: "none",
    level: 3,
    xp: 0,
    image: "/img/familiars/fennec.png",
    hunger: 92,
    thirst: 85,
    happiness: 90,
    hp: 70,
    attack: 13,
    defense: 11,
    speed: 22,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
  {
    id: 7,
    name: "Bubbles",
    species: "fish",
    color: "blue",
    marking: "striped",
    level: 1,
    xp: 0,
    image: "/img/familiars/fish.png",
    hunger: 100,
    thirst: 100,
    happiness: 95,
    hp: 60,
    attack: 12,
    defense: 11,
    speed: 30,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
  {
    id: 8,
    name: "Ellyphant",
    species: "ellyphant",
    color: "pink",
    marking: "polka-dotted",
    level: 7,
    xp: 0,
    image: "/img/familiars/ellyphant.png",
    hunger: 75,
    thirst: 65,
    happiness: 83,
    hp: 130,
    attack: 20,
    defense: 18,
    speed: 8,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
  {
    id: 9,
    name: "Yenna",
    species: "hyena",
    color: "golden",
    marking: "none",
    level: 4,
    xp: 0,
    image: "/img/familiars/yena1.png",
    hunger: 88,
    thirst: 78,
    happiness: 87,
    hp: 999,
    attack: 20,
    defense: 30,
    speed: 20,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
  {
    id: 10,
    name: "Otto",
    species: "otter",
    color: "brown",
    marking: "spotted",
    level: 2,
    xp: 0,
    image: "/img/familiars/otter.png",
    hunger: 95,
    thirst: 90,
    happiness: 91,
    hp: 75,
    attack: 14,
    defense: 10,
    speed: 20,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
  {
    id: 11,
    name: "Deer",
    species: "deer",
    color: "brown",
    marking: "spotted",
    level: 1,
    xp: 0,
    image: "/img/familiars/deer.png",
    hunger: 100,
    thirst: 100,
    happiness: 95,
    hp: 80,
    attack: 13,
    defense: 10,
    speed: 20,
    library: [],
    collectibles: { stamps: [], toys: [], plants: [] },
  },
];

export default function Familiars() {
  useBodyClass();
  const [coins] = useState(150);
  const [dust] = useState(25);
  const [level] = useState(1);
  const [xp] = useState(0);
  const [familiars, setFamiliars] = useState<Familiar[]>(defaultFamiliars);
  const [activeFamiliarId, setActiveFamiliarId] = useState<number | null>(
    familiars[0]?.id || null
  );

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

  const handleSetActive = (famId: number) => {
    setActiveFamiliarId(famId);
  };

  const handleFeed = (famId: number) => {
    setFamiliars((fams) =>
      fams.map((f) =>
        f.id === famId ? { ...f, hunger: Math.min(100, f.hunger + 20) } : f
      )
    );
  };

  const handleWater = (famId: number) => {
    setFamiliars((fams) =>
      fams.map((f) =>
        f.id === famId ? { ...f, thirst: Math.min(100, f.thirst + 20) } : f
      )
    );
  };

  const handlePlay = (famId: number) => {
    setFamiliars((fams) =>
      fams.map((f) =>
        f.id === famId
          ? { ...f, happiness: Math.min(100, f.happiness + 15) }
          : f
      )
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
          <Link to="/familiars" id="btn-familiars" className="nav-btn active">
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
          <div
            className="status-item"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "6px",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#ffd700" }}>
              ⭐ XP: <span id="playerXP">{xp}</span>
            </div>
            <div
              className="progress-bar"
              style={{
                width: "180px",
                height: "12px",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                id="playerXPBar"
                className="progress-fill"
                style={{ width: "0%" }}
              ></div>
            </div>
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

      {/* Familiars Section */}
      <div className="section active" id="familiars">
        <h2>🐾 Your Familiars</h2>
        <p>Manage and interact with your loyal familiars.</p>
        <div className="grid">
          {familiars.map((familiar) => (
            <div
              key={familiar.id}
              className="card familiar-card"
              style={{
                border:
                  activeFamiliarId === familiar.id
                    ? "3px solid #ffd700"
                    : "1px solid #ccc",
                boxShadow:
                  activeFamiliarId === familiar.id
                    ? "0 0 15px rgba(255, 215, 0, 0.5)"
                    : "none",
              }}
            >
              <div className="card-image">
                <img
                  src={familiar.image}
                  alt={familiar.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  onError={(e) =>
                    (e.currentTarget.src = "/img/familiars/familiars.png")
                  }
                />
              </div>
              <h3 className="fam-name">{familiar.name}</h3>
              <p className="fam-level">
                Level {familiar.level} ({familiar.species})
              </p>

              {/* XP Bar */}
              <div style={{ marginTop: "8px", textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#c8bda1",
                    marginBottom: "4px",
                  }}
                >
                  XP: {familiar.xp} / {100}
                </div>
                <div className="progress-bar" style={{ height: "10px" }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(100, (familiar.xp / 100) * 100)}%`,
                      height: "100%",
                    }}
                  ></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div
                className="fam-stats-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "8px",
                  marginTop: "12px",
                  fontSize: "12px",
                }}
              >
                <div className="stat">❤️ {familiar.happiness}%</div>
                <div className="stat">⚔️ {familiar.attack}</div>
                <div className="stat">🍖 {familiar.hunger}%</div>
                <div className="stat">🛡️ {familiar.defense}</div>
                <div className="stat">💧 {familiar.thirst}%</div>
                <div className="stat">⚡ {familiar.speed}</div>
              </div>

              {/* Action Buttons */}
              <div
                className="familiar-actions"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <button
                  className="btn"
                  onClick={() => handlePlay(familiar.id)}
                  style={{ fontSize: "12px", padding: "6px" }}
                >
                  Play
                </button>
                <button
                  className="btn"
                  onClick={() => handleFeed(familiar.id)}
                  style={{ fontSize: "12px", padding: "6px" }}
                >
                  Feed
                </button>
                <button
                  className="btn"
                  onClick={() => handleWater(familiar.id)}
                  style={{ fontSize: "12px", padding: "6px" }}
                >
                  Water
                </button>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: "12px", padding: "6px" }}
                >
                  Battle
                </button>
              </div>

              <div
                className="familiar-actions"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <button
                  className="btn"
                  onClick={() => handleSetActive(familiar.id)}
                  style={{ fontSize: "12px", padding: "6px" }}
                >
                  {activeFamiliarId === familiar.id ? "⭐ Active" : "Activate"}
                </button>
                <button
                  className="btn"
                  style={{ fontSize: "12px", padding: "6px" }}
                >
                  Rename
                </button>
                <button
                  className="btn"
                  style={{ fontSize: "12px", padding: "6px" }}
                >
                  Pound
                </button>
              </div>

              {/* Collection Info */}
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#c8bda1",
                  textAlign: "center",
                }}
              >
                📚 {familiar.library.length} | 🎫{" "}
                {familiar.collectibles.stamps.length} | 🧸{" "}
                {familiar.collectibles.toys.length} | 🌸{" "}
                {familiar.collectibles.plants.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
