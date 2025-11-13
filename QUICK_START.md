# 🎮 Quick Start Guide

## ⚡ Get Started in 30 Seconds

### 1. Start Both Servers
```bash
npm run dev
```

You'll see:
```
✓ Client ready on http://localhost:5173
✓ Server running on port 5000
```

### 2. Open Browser
Visit: **http://localhost:5173**

You'll see:
- ✅ Home page (converted from index.html)
- ✅ Navigation to Achievements page
- ✅ All your game assets and styles

### 3. Test the Setup
- Click **Achievements** link to test routing
- Click **Mute/Clear Save** buttons to test legacy functions
- Try **Claim Bonus** to test game logic

---

## 📋 What You Can Do Now

### Run Development Servers
```bash
npm run dev              # Both client + server
cd client && npm run dev # Client only
cd server && npm run dev # Server only
```

### Build for Production
```bash
npm run build            # Compiles both
npm start                # Runs server
```

### Convert More Pages
See `MIGRATION_GUIDE.md` for step-by-step instructions on converting the remaining 10 pages.

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `client/src/App.tsx` | Add new routes here |
| `client/src/pages/Home.tsx` | Example React component |
| `client/src/lib/game.ts` | Legacy function exports |
| `server/src/index.ts` | Add API endpoints here |
| `package.json` | Root monorepo scripts |
| `MIGRATION_GUIDE.md` | Detailed conversion guide |
| `SETUP_COMPLETE.md` | Full setup details |

---

## 🚨 Something Wrong?

### Client won't load
```bash
cd client && npm install && npm run dev
```

### Server crashes
```bash
cd server && npm install && npm run dev
```

### Port in use
```bash
# Kill process
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## ✅ You're Ready!

Everything is set up and working. Now:
1. Run `npm run dev`
2. Visit http://localhost:5173
3. Follow `MIGRATION_GUIDE.md` to convert remaining pages

Enjoy building! 🚀
