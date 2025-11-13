import { Link } from 'react-router-dom'
import { useBodyClass } from '../hooks/useBodyClass'

export default function Home() {
  useBodyClass()

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>
          <img
            src="/img/assets/fabledfamiliarsbannersmall.png"
            alt="Scroll Icon"
            style={{ height: '3em', verticalAlign: 'middle', marginRight: '0em' }}
          />
        </h1>
        <div className="timer" id="serverTime"></div>

        <div className="nav">
          <Link to="/" id="btn-home" className="nav-btn active">
            <img src="/img/assets/house.png" className="nav-icon" alt="Home" /> Home
          </Link>
          <Link to="/familiars" id="btn-familiars" className="nav-btn">
            <img src="/img/familiars/familiars.png" className="nav-icon" alt="Familiars" /> Familiars
          </Link>
          <Link to="/inventory" id="btn-inventory" className="nav-btn">
            <img src="/img/assets/crate.png" className="nav-icon" alt="Inventory" /> Inventory
          </Link>
          <Link to="/shop" id="btn-shop" className="nav-btn">
            <img src="/img/assets/shopicon.png" className="nav-icon" alt="Shop" /> Shop
          </Link>
          <Link to="/activities" id="btn-activities" className="nav-btn">
            <img src="/img/assets/target.png" className="nav-icon" alt="Activities" /> Activities
          </Link>
          <Link to="/adopt" id="btn-adopt" className="nav-btn">
            <img src="/img/assets/adopt-sign1.png" className="nav-icon" alt="Adopt" /> Adopt
          </Link>
          <Link to="/pound" id="btn-pound" className="nav-btn">
            <img src="/img/assets/pound-sign.png" className="nav-icon" alt="Pound" /> Pound
          </Link>
          <Link to="/battle" id="btn-battle" className="nav-btn" hidden>
            <img src="/img/assets/battle.png" className="nav-icon" alt="Battle" /> Battle
          </Link>
          <Link to="/training" id="btn-training" className="nav-btn">
            <img src="/img/assets/training-page.png" className="nav-icon" alt="Training" /> Training
          </Link>
          <Link to="/crafting" id="btn-crafting" className="nav-btn">
            <img src="/img/assets/crystal.jpg" className="nav-icon" alt="Crafting" /> Crafting
          </Link>
        </div>

        <div className="status-bar">
          <div className="status-item">
            <img src="/img/assets/coins.png" className="status-icon" alt="Coins" /> Coins:{' '}
            <span id="coinCount">150</span>
          </div>
          <div className="status-item">
            <img src="/img/assets/dust.png" className="status-icon" alt="Dust" /> Dust:{' '}
            <span id="dustCount">25</span>
          </div>
          <div className="status-item">
            <img src="/img/assets/training-page.png" className="status-icon" alt="Level" /> Level:{' '}
            <span id="playerLevel">1</span>
          </div>
          <div className="status-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <div style={{ fontWeight: 'bold', color: '#ffd700' }}>
              ⭐ XP: <span id="playerXP">0</span>
            </div>
            <div className="progress-bar" style={{ width: '180px', height: '12px', borderRadius: '4px', overflow: 'hidden' }}>
              <div id="playerXPBar" className="progress-fill" style={{ width: '0%' }}></div>
            </div>
          </div>
          <div className="status-item" id="activeFamiliarDisplay" style={{ background: 'rgba(255, 215, 0, 0.1)', padding: '8px 15px', border: '1px solid rgba(255, 215, 0, 0.3)', color: '#ffd700', fontWeight: 'bold' }}>
            Active: None
          </div>
          <button id="mute-btn" className="nav-btn" onClick={() => window.toggleMute?.()}>
            Mute
          </button>
          <button id="clear-save-btn" className="nav-btn" onClick={() => window.clearSave?.()}>
            Clear Save
          </button>
        </div>
      </div>

      {/* Home Section */}
      <div className="section active" id="home">
        <h2>🏠 Welcome Home!</h2>
        <p>Welcome, Keeper, to the realm of Aethelburg! Pledge your allegiance and begin your adventure.</p>

        <div className="grid">
          <div className="card">
            <div className="card-image">
              <img src="/img/assets/coins.png" className="card-icon" alt="Daily Bonus" />
            </div>
            <h3>Daily Bonus</h3>
            <p>Claim your daily rewards!</p>
            <button className="btn" onClick={() => window.claimDaily?.()}>
              Claim Bonus
            </button>
          </div>

          <div className="card">
            <div className="card-image">📰</div>
            <h3>Latest News</h3>
            <p>New familiars and items available in the shop!</p>
          </div>

          <Link to="/achievements" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card-image">🏆</div>
            <h3>Achievements</h3>
            <p>Track your progress and unlock rewards</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
