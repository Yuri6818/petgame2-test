# 🎯 Quick Page Conversion Checklist

Use this checklist for each page you convert.

## Template
Copy this file: `client/src/pages/TEMPLATE.tsx`

## Steps (5 minutes per page)

### 1. Create Component File
```bash
cp client/src/pages/TEMPLATE.tsx client/src/pages/YourPage.tsx
```

### 2. Edit Component
- [ ] Replace `PAGENAME` with your page name (e.g., `Shop`)
- [ ] Replace heading with page title
- [ ] Copy HTML content from original `page.html` file
- [ ] Replace all `class=` with `className=`
- [ ] Replace `href="page.html"` with React Link components
- [ ] Check all image paths use `/img/...` format
- [ ] Verify useBodyClass() is at top of component

### 3. Add Route
Edit `client/src/App.tsx`:
```tsx
import YourPage from './pages/YourPage'

// Inside <Routes>
<Route path="/your-path" element={<YourPage />} />
```

### 4. Test
```bash
npm run dev
# Visit http://localhost:5173/your-path
# Check:
# ✓ Page loads
# ✓ Background image shows
# ✓ Navigation links work
# ✓ Styles look correct
```

### 5. Cleanup
- [ ] Delete checked items above
- [ ] Commit changes to git
- [ ] Move to next page

---

## Pages To Convert (In Order)

### ✅ Done
- [x] Home (index.html)
- [x] Achievements (achievements.html)

### ⏳ TODO
- [ ] Activities (activities.html) → Route: `/activities`
- [ ] Adopt (adopt.html) → Route: `/adopt`
- [ ] Battle (battle.html) → Route: `/battle`
- [ ] Crafting (crafting.html) → Route: `/crafting`
- [ ] Familiars (familiars.html) → Route: `/familiars`
- [ ] Inventory (inventory.html) → Route: `/inventory`
- [ ] Pound (pound.html) → Route: `/pound`
- [ ] Rest (rest.html) → Route: `/rest`
- [ ] Shop (shop.html) → Route: `/shop`
- [ ] Training (training.html) → Route: `/training`

---

## Quick Fixes If Something Breaks

### Page doesn't load
```bash
npm run dev  # Check browser console for errors
```

### Background image not showing
- [ ] Check useBodyClass() is called
- [ ] Verify image path is `/img/assets/image.png`
- [ ] Check browser Network tab - is CSS loading?

### Styles not applied
- [ ] Verify all `class=` changed to `className=`
- [ ] Check browser DevTools → Elements tab
- [ ] Is the section div set to `className="section active"`?

### Links broken
- [ ] Check route is added to App.tsx
- [ ] Verify Link path matches route path
- [ ] Example: `<Link to="/shop">` needs `<Route path="/shop" ... />`

---

## Pro Tips

1. **Test One Page at a Time** — Don't convert multiple pages at once
2. **Check Console** — Browser console shows errors immediately
3. **Use DevTools** — Inspect element to debug CSS issues
4. **Git Commits** — Commit after each page: `git commit -m "Convert Shop page"`
5. **Copy Paste** — It's OK to copy HTML structure as-is, then refactor later

---

Good luck! 🚀
