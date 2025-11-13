import { Link } from "react-router-dom";
import { useBodyClass } from "../hooks/useBodyClass";

export default function Training() {
  useBodyClass();

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
          <Link to="/training" id="btn-training" className="nav-btn active">
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
            Coins: <span id="coinCount">150</span>
          </div>
          <div className="status-item">
            <img
              src="/img/assets/dust.png"
              className="status-icon"
              alt="Dust"
            />{" "}
            Dust: <span id="dustCount">25</span>
          </div>
          <div className="status-item">
            <img
              src="/img/assets/training-page.png"
              className="status-icon"
              alt="Level"
            />{" "}
            Level: <span id="playerLevel">1</span>
          </div>
          <div className="status-item">
            ⭐ XP: <span id="playerXP">0</span>/100
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

      <div className="section active" id="training">
        <h2>🏋️ Training Grounds</h2>
        <p>Train your familiars to increase their stats and abilities.</p>
        <div className="grid" id="trainingContainer"></div>
      </div>
    </div>
  );
}
