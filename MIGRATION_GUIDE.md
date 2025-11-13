# Pet Game Migration Guide

## 🎯 Project Overview

This project has been migrated from a vanilla HTML/CSS/JavaScript structure to a modern **React + TypeScript + Vite + Express + Tailwind CSS** monorepo. The conversion is gradual to preserve all existing functionality.

## 📁 Project Structure

```
petgame2-test/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── pages/            # React components (converted from .html)
│   │   │   ├── Home.tsx      # index.html → Home.tsx ✅
│   │   │   ├── Achievements.tsx  # achievements.html → Achievements.tsx ✅
│   │   │   └── ...           # TODO: Other pages
│   │   ├── lib/              # Shared utilities & legacy function exports
│   │   │   └── game.ts       # Game state & core functions (exposed to window)
│   │   ├── types/
│   │   │   └── window.d.ts   # TypeScript window type declarations
│   │   ├── styles/
│   │   │   └── tailwind.css  # Tailwind CSS imports
│   │   ├── App.tsx           # Router & route definitions
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Base styles
│   ├── public/
│   │   ├── img/              # Game assets (copied from root)
│   │   ├── sounds/           # Audio files (copied from root)
│   │   ├── style.css         # Original game styles (copied from root)
│   │   ├── index.html        # HTML template
│   │   └── favicon.ico
│   ├── vite.config.ts        # Vite config with Tailwind plugin
│   ├── tailwind.config.cjs   # Tailwind configuration
│   ├── postcss.config.cjs    # PostCSS with Tailwind
│   ├── tsconfig.json         # TypeScript config
│   └── package.json
│
├── server/                    # Express + Node.js backend
│   ├── src/
│   │   └── index.ts          # Express server entry point
│   ├── dist/                 # Compiled JS output (build)
│   ├── .env                  # Server environment variables
│   ├── tsconfig.json         # TypeScript config
│   └── package.json
│
├── backup/                    # Original HTML/CSS/JS (safety copy)
├── .gitignore
├── package.json             # Root monorepo scripts
└── README.md                # This file

```

## 🚀 Getting Started

### Install Dependencies
```bash
npm install  # Root level (installs concurrently & dependencies)
npm install --prefix client  # If needed, reinstall client deps
npm install --prefix server  # If needed, reinstall server deps
```

### Run Development Servers (Both at Once)
```bash
npm run dev
```

This will start:
- **Client**: Vite dev server on `http://localhost:5173`
- **Server**: Express API on `http://localhost:5000`

Both run simultaneously with hot-reload enabled.

### Build for Production
```bash
npm run build
```

Compiles client (React → dist) and server (TypeScript → dist).

### Start Production Build
```bash
npm start
```

Runs the compiled server on port 5000 (serve the client dist separately or via Vercel/Netlify).

## 📝 Migration Progress

### ✅ Completed
- [x] Root monorepo setup with `concurrently` and npm workspaces scripts
- [x] Client: Vite React + TypeScript scaffold
- [x] Client: Tailwind CSS v3 with Vite plugin (@tailwindcss/vite)
- [x] Server: Express + TypeScript + nodemon setup
- [x] Assets: img/, sounds/, style.css copied to client/public/
- [x] Pages converted: **Home.tsx** (index.html), **Achievements.tsx** (achievements.html)
- [x] Routing: React Router v6 in App.tsx
- [x] Legacy globals: Exposed in src/lib/game.ts (gameState, updateUI, claimDaily, toggleMute, clearSave, updateServerTime)

### 📋 TODO - Convert Remaining Pages

Convert these .html files to React components in `client/src/pages/` one at a time:

| HTML File | Component | Route | Status |
|-----------|-----------|-------|--------|
| **index.html** | Home.tsx | `/` | ✅ Done |
| **achievements.html** | Achievements.tsx | `/achievements` | ✅ Done |
| activities.html | Activities.tsx | `/activities` | ⏳ TODO |
| adopt.html | Adopt.tsx | `/adopt` | ⏳ TODO |
| battle.html | Battle.tsx | `/battle` | ⏳ TODO |
| crafting.html | Crafting.tsx | `/crafting` | ⏳ TODO |
| familiars.html | Familiars.tsx | `/familiars` | ⏳ TODO |
| inventory.html | Inventory.tsx | `/inventory` | ⏳ TODO |
| pound.html | Pound.tsx | `/pound` | ⏳ TODO |
| rest.html | Rest.tsx | `/rest` | ⏳ TODO |
| shop.html | Shop.tsx | `/shop` | ⏳ TODO |
| training.html | Training.tsx | `/training` | ⏳ TODO |

### 📋 TODO - Migrate JavaScript Files to TypeScript

Move and refactor legacy JS files into `client/src/lib/` as TypeScript modules:

| File | Purpose | Exposed Functions | Status |
|------|---------|-------------------|--------|
| **game.js** | Core game logic | gameState, updateUI, claimDaily, toggleMute, clearSave | ✅ Stubbed in game.ts |
| data.js | Game data/constants | — | ⏳ TODO |
| ui.js | UI update functions | — | ⏳ TODO |
| sound.js | Audio management | — | ⏳ TODO |
| battle.js | Battle mechanics | — | ⏳ TODO |
| achievements.js | Achievement system | — | ⏳ TODO |
| familiar.js | Familiar/pet logic | — | ⏳ TODO |
| training.js | Training mechanics | — | ⏳ TODO |
| lucky.js | Lucky mechanics | — | ⏳ TODO |
| rest.js | Rest/sleep mechanics | — | ⏳ TODO |
| crafting.js | Crafting system | — | ⏳ TODO |

## 🔄 How to Migrate a Page

### Step 1: Create Component
```bash
# Create a new file in client/src/pages/
# Example: client/src/pages/Shop.tsx
```

### Step 2: Copy HTML Structure
1. Open the original `shop.html` file
2. Copy the HTML content from the `<body>` into a React function component
3. Replace `class=` with `className=`
4. Replace `href="page.html"` with `<Link to="/page">`
5. Keep all IDs and existing classes for now (styles are inherited from `/style.css`)

### Step 3: Example Template
```tsx
import { Link } from 'react-router-dom'
import { useBodyClass } from '../hooks/useBodyClass'

export default function Shop() {
  // This sets the body.shop class for the correct background image
  useBodyClass()

  return (
    <div className="container">
      <div className="header">
        <h1>🏪 Shop</h1>
        <div className="nav">
          <Link to="/" className="nav-btn">Home</Link>
          {/* Add other nav links */}
        </div>
        {/* Status bar, etc. */}
      </div>

      <div className="section active" id="shop">
        <h2>Welcome to the Shop</h2>
        {/* Page content here */}
      </div>
    </div>
  )
}
```

### Step 4: Add Route
In `client/src/App.tsx`, add:
```tsx
import Shop from './pages/Shop'

<Route path="/shop" element={<Shop />} />
```

### Step 5: Test
```bash
npm run dev
# Navigate to http://localhost:5173/shop
# You should see the correct background image load
```

### Step 6: Update Links (Optional)
Once all pages are React, you can:
- Remove inline event handlers (`onclick=`) and use React `onClick` props
- Gradually refactor classes to Tailwind utilities
- Move component-specific logic to React hooks

## 🎨 Background Images & Body Classes

**Important:** All pages now use a custom React hook `useBodyClass()` to set the correct body class for background images. The hook automatically:
- Detects the current route
- Sets `body.home`, `body.shop`, `body.battle`, etc.
- Loads the matching background image from the CSS

**Remember to include this in every page component:**
```tsx
import { useBodyClass } from '../hooks/useBodyClass'

export default function YourPage() {
  useBodyClass()  // ← Add this line!
  
  return (
    // Your JSX here
  )
}
```

### Tailwind CSS Usage

### Current Setup
- **Tailwind v3** with Vite plugin (@tailwindcss/vite)
- PostCSS configured for CSS transformation
- `client/src/styles/tailwind.css` imports base → components → utilities

### Using Tailwind
The existing `style.css` is imported globally, so all original classes still work. You can gradually replace them with Tailwind:

**Before (original style.css):**
```html
<div class="card">
```

**After (Tailwind, optional):**
```tsx
<div className="bg-slate-900 border-2 border-amber-500 p-5 rounded-sm">
```

### When to Apply Tailwind
- Add new components (use Tailwind utilities)
- Refactor old components (gradually migrate classes)
- Don't rush — focus on functionality first

## 🔌 Exposing Legacy Functions

When migrating JS files, export functions and attach them to `window` for temporary compatibility:

**Example (src/lib/game.ts):**
```ts
export function myFunction() {
  // Implementation
}

if (typeof window !== 'undefined') {
  (window as any).myFunction = myFunction
}
```

Then call from React or inline handlers:
```tsx
<button onClick={() => (window as any).myFunction()}>Click</button>
```

Once all code is in React, remove the `window` exports and import directly:
```tsx
import { myFunction } from '../lib/game'

<button onClick={myFunction}>Click</button>
```

## 📦 Dependencies

### Client Dependencies
- **react**, react-dom — UI framework
- **react-router-dom** — Client-side routing
- **typescript** — Type safety
- **vite** — Build tool & dev server
- **tailwindcss**, @tailwindcss/vite — Styling
- **axios** — HTTP requests (optional, for API calls)
- **zustand** — State management (optional, for complex state)
- **framer-motion** — Animations (optional)
- @supabase/supabase-js — Database/auth (optional)

### Server Dependencies
- **express** — Web framework
- **cors** — CORS handling
- **dotenv** — Environment variables
- **typescript**, **ts-node** — TypeScript support
- **nodemon** — Auto-reload in dev

## 🌐 API Integration

### Current Server
The server has a basic `/api/health` endpoint. To add more:

**server/src/index.ts:**
```ts
app.get('/api/familiars', (req, res) => {
  res.json({ familiars: [] })
})

app.post('/api/familiars', (req, res) => {
  // Handle creation
  res.json({ id: 1 })
})
```

### Calling from React
```tsx
import axios from 'axios'

const { data } = await axios.get('/api/familiars')
```

## ⚙️ Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=development
```

### Client (Optional - .env.local in client/)
```
VITE_API_URL=http://localhost:5000
```

Access in React:
```ts
const apiUrl = import.meta.env.VITE_API_URL
```

## 🧹 Cleanup Notes

### Original Files (Safe in backup/)
All original `.html`, `.css`, and `.js` files are backed up in `backup/` folder. The root directory still contains:
- `index.html`, `familiars.html`, etc. (can be deleted once verified in React)
- `js/` folder (can be deleted once logic is migrated)
- `img/`, `sounds/`, `style.css` (already copied to client/public/)

### When Safe to Delete
Once you've converted a page to React and verified it works:
```bash
rm index.html  # After Home.tsx is working
rm achievements.html  # After Achievements.tsx is working
# etc.
```

All assets are safe to remove from root once in client/public/.

## 🚨 Troubleshooting

### Client won't start
```bash
cd client
npm install
npm run dev
```

### Server crashes on start
```bash
cd server
npm install
npm run dev  # Check error output
```

### Port already in use
- Client (5173): `lsof -i :5173` → kill process
- Server (5000): `lsof -i :5000` → kill process

### Import errors in React components
- Check file paths (use relative paths from component)
- Ensure `.tsx` extension on TypeScript files
- Import statements example: `import Component from '../pages/Component'`

### Styles not showing
1. Check `style.css` is copied to `client/public/`
2. Verify import in `main.tsx`: `import '/style.css'`
3. Check browser DevTools → Network tab for CSS file

## 📚 Resources

- [React Docs](https://react.dev)
- [React Router v6](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)

## ✨ Next Steps

1. **Test the current setup** — Visit http://localhost:5173 and verify Home/Achievements pages load
2. **Convert remaining pages** — Follow the template above for each .html file
3. **Migrate JavaScript logic** — Move functions from js/ files to client/src/lib/ as TypeScript
4. **Set up API routes** — Add backend endpoints as needed
5. **Deploy** — Vercel (frontend) + Render/Railway (backend)

---

**Good luck!** 🎮✨
