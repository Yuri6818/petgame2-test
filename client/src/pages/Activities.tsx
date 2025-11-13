import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBodyClass } from "../hooks/useBodyClass";

interface Activity {
  id: string;
  name: string;
  icon: string;
  description: string;
  reward: string;
  duration: number;
}

const activities: Activity[] = [
  {
    id: "foraging",
    name: "Foraging",
    icon: "🍄",
    description: "Search for food and herbs in the forest",
    reward: "Materials",
    duration: 60,
  },
  {
    id: "mining",
    name: "Mining",
    icon: "⛏️",
    description: "Extract valuable minerals from caves",
    reward: "Crystals",
    duration: 120,
  },
  {
    id: "fishing",
    name: "Fishing",
    icon: "🎣",
    description: "Fish in the nearby streams",
    reward: "Fish & Shells",
    duration: 90,
  },
  {
    id: "catching",
    name: "Catching",
    icon: "🦋",
    description: "Hunt for rare creatures and insects",
    reward: "Collectibles",
    duration: 75,
  },
];

export default function Activities() {
  useBodyClass();
  const [coins] = useState(150);
  const [dust] = useState(25);
  const [level] = useState(1);
  const [xp] = useState(0);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

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

  useEffect(() => {
    if (!activeActivity || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setActiveActivity(null);
          alert("Activity completed! Check your inventory.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeActivity, timeLeft]);

  const startActivity = (activityId: string) => {
    const activity = activities.find((a) => a.id === activityId);
    if (activity) {
      setActiveActivity(activityId);
      setTimeLeft(activity.duration);
    }
  };

  const getActivityStatus = (activityId: string) => {
    if (activeActivity === activityId) {
      return `In progress... ${Math.floor(timeLeft / 60)}:${String(
        timeLeft % 60
      ).padStart(2, "0")}`;
    }
    return "Start";
  };

  return (
    <div className="container">
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
          <Link to="/shop" id="btn-shop" className="nav-btn">
            <img
              src="/img/assets/shopicon.png"
              className="nav-icon"
              alt="Shop"
            />{" "}
            Shop
          </Link>
          <Link to="/activities" id="btn-activities" className="nav-btn active">
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

      <div className="section active" id="activities">
        <h2>🎯 Activities</h2>
        <p>Engage in various activities to earn rewards and experience.</p>
        <div className="grid">
          {activities.map((activity) => (
            <div key={activity.id} className="card activity-card">
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                {activity.icon}
              </div>
              <h3>{activity.name}</h3>
              <p>{activity.description}</p>
              <div
                style={{
                  fontSize: "14px",
                  color: "#ffd700",
                  marginBottom: "8px",
                }}
              >
                Reward: {activity.reward}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#c8bda1",
                  marginBottom: "12px",
                }}
              >
                Duration: {Math.floor(activity.duration / 60)}m{" "}
                {activity.duration % 60}s
              </div>
              <button
                className="btn"
                disabled={
                  activeActivity !== null && activeActivity !== activity.id
                }
                onClick={() => startActivity(activity.id)}
              >
                {getActivityStatus(activity.id)}
              </button>
              {activeActivity === activity.id && (
                <div style={{ marginTop: "12px", width: "100%" }}>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          ((activity.duration - timeLeft) / activity.duration) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
