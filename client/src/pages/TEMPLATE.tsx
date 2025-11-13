import { Link } from 'react-router-dom'
import { useBodyClass } from '../hooks/useBodyClass'

/**
 * Template for converting HTML pages to React
 * Copy this file, rename to your page name (e.g., Shop.tsx)
 * Then:
 * 1. Replace "PAGENAME" with your page name
 * 2. Copy HTML content from the original file
 * 3. Replace class= with className=
 * 4. Replace href="page.html" with <Link to="/page">
 * 5. Add to App.tsx routes
 * 6. Test with npm run dev
 */

export default function PAGENAME() {
  // This sets the body.pagename class for the correct background image
  useBodyClass()

  return (
    <div className="container">
      {/* Header - Keep this structure */}
      <div className="header">
        <h1>Page Title Here</h1>
        
        <div className="nav">
          <Link to="/" className="nav-btn">
            <img src="/img/assets/house.png" className="nav-icon" alt="Home" /> Home
          </Link>
          <Link to="/familiars" className="nav-btn">
            <img src="/img/familiars/familiars.png" className="nav-icon" alt="Familiars" /> Familiars
          </Link>
          <Link to="/inventory" className="nav-btn">
            <img src="/img/assets/crate.png" className="nav-icon" alt="Inventory" /> Inventory
          </Link>
          <Link to="/shop" className="nav-btn">
            <img src="/img/assets/shopicon.png" className="nav-icon" alt="Shop" /> Shop
          </Link>
          <Link to="/activities" className="nav-btn">
            <img src="/img/assets/target.png" className="nav-icon" alt="Activities" /> Activities
          </Link>
          <Link to="/adopt" className="nav-btn">
            <img src="/img/assets/adopt-sign1.png" className="nav-icon" alt="Adopt" /> Adopt
          </Link>
          <Link to="/pound" className="nav-btn">
            <img src="/img/assets/pound-sign.png" className="nav-icon" alt="Pound" /> Pound
          </Link>
          <Link to="/battle" className="nav-btn" hidden>
            <img src="/img/assets/battle.png" className="nav-icon" alt="Battle" /> Battle
          </Link>
          <Link to="/training" className="nav-btn">
            <img src="/img/assets/training-page.png" className="nav-icon" alt="Training" /> Training
          </Link>
          <Link to="/crafting" className="nav-btn">
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
          <div className="status-item">
            ⭐ XP: <span id="playerXP">0</span>/100
          </div>
          <button className="nav-btn" onClick={() => window.toggleMute?.()}>
            Mute
          </button>
          <button className="nav-btn" onClick={() => window.clearSave?.()}>
            Clear Save
          </button>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="section active" id="page-id">
        <h2>Page Heading</h2>
        
        {/* Paste your HTML content here, replacing class= with className= */}
        {/* Keep all IDs and original classes for now */}
        
      </div>
    </div>
  )
}
