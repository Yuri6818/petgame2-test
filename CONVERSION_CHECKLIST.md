# 📋 Page Conversion Checklist

Track your progress converting pages from HTML to React components.

## ✅ Completed Pages (2/12)

- [x] **Home** (`index.html` → `Home.tsx`) 
  - Route: `/`
  - Background: `home.png` ✓
  - Status: Working
  
- [x] **Achievements** (`achievements.html` → `Achievements.tsx`)
  - Route: `/achievements`
  - Background: Default gradient (no image)
  - Status: Working

---

## ⏳ Pages to Convert (10 Remaining)

### High Priority (Common Pages)

- [ ] **Shop** (`shop.html` → `Shop.tsx`)
  - Route: `/shop`
  - Background: `shop.png`
  - Template: `cp client/src/pages/TEMPLATE.tsx client/src/pages/Shop.tsx`
  - Checklist:
    - [ ] Copied template
    - [ ] Changed function name to `Shop`
    - [ ] Pasted HTML content
    - [ ] Replaced `class=` with `className=`
    - [ ] Added route in `App.tsx`
    - [ ] Tested at http://localhost:5173/shop
    - [ ] Background image loads correctly

- [ ] **Familiars** (`familiars.html` → `Familiars.tsx`)
  - Route: `/familiars`
  - Background: `pets.png`
  - Template: `cp client/src/pages/TEMPLATE.tsx client/src/pages/Familiars.tsx`
  - Checklist:
    - [ ] Copied template
    - [ ] Changed function name to `Familiars`
    - [ ] Pasted HTML content
    - [ ] Replaced `class=` with `className=`
    - [ ] Added route in `App.tsx`
    - [ ] Tested at http://localhost:5173/familiars
    - [ ] Background image loads correctly

- [ ] **Inventory** (`inventory.html` → `Inventory.tsx`)
  - Route: `/inventory`
  - Background: `inventory.png`
  - Template: `cp client/src/pages/TEMPLATE.tsx client/src/pages/Inventory.tsx`
  - Checklist:
    - [ ] Copied template
    - [ ] Changed function name to `Inventory`
    - [ ] Pasted HTML content
    - [ ] Replaced `class=` with `className=`
    - [ ] Added route in `App.tsx`
    - [ ] Tested at http://localhost:5173/inventory
    - [ ] Background image loads correctly

### Activity & Battle Pages

- [ ] **Activities** (`activities.html` → `Activities.tsx`)
  - Route: `/activities`
  - Background: `activities.png`
  - Checklist:
    - [ ] Copied template
    - [ ] Changed function name to `Activities`
    - [ ] Pasted HTML content
    - [ ] Replaced `class=` with `className=`
    - [ ] Added route in `App.tsx`
    - [ ] Tested at http://localhost:5173/activities

- [ ] **Battle** (`battle.html` → `Battle.tsx`)
  - Route: `/battle`
  - Background: `battle.png`
  - Checklist:
    - [ ] Copied template
    - [ ] Changed function name to `Battle`
    - [ ] Pasted HTML content
    - [ ] Replaced `class=` with `className=`
    - [ ] Added route in `App.tsx`
    - [ ] Tested at http://localhost:5173/battle

- [ ] **Training** (`training.html` → `Training.tsx`)
  - Route: `/training`
  - Background: `training-page.png`
  - Checklist:
    - [ ] Copied template
    - [ ] Changed function name to `Training`
    - [ ] Pasted HTML content
    - [ ] Replaced `class=` with `className=`
    - [ ] Added route in `App.tsx`
    - [ ] Tested at http://localhost:5173/training

### Adoption & Special Pages

- [ ] **Adopt** (`adopt.html` → `Adopt.tsx`)
  - Route: `/adopt`
  - Background: `adopt.png` (special positioning)
  - Checklist:
    - [ ] Copied template
    - [ ] Changed function name to `Adopt`
    - [ ] Pasted HTML content
    - [ ] Replaced `class=` with `className=`
    - [ ] Added route in `App.tsx`
    - [ ] Tested at http://localhost:5173/adopt

- [ ] **Pound** (`pound.html` → `Pound.tsx`)
  - Route: `/pound`
  - Background: `pound.png`
  - Checklist:
    - [ ] Copied template
    - [ ] Changed function name to `Pound`
    - [ ] Pasted HTML content
    - [ ] Replaced `class=` with `className=`
    - [ ] Added route in `App.tsx`
    - [ ] Tested at http://localhost:5173/pound

- [ ] **Crafting** (`crafting.html` → `Crafting.tsx`)
  - Route: `/crafting`
  - Background: `crafting.png`
  - Checklist:
    - [ ] Copied template
    - [ ] Changed function name to `Crafting`
    - [ ] Pasted HTML content
    - [ ] Replaced `class=` with `className=`
    - [ ] Added route in `App.tsx`
    - [ ] Tested at http://localhost:5173/crafting

- [ ] **Rest** (`rest.html` → `Rest.tsx`)
  - Route: `/rest`
  - Background: Default gradient (no custom image)
  - Checklist:
    - [ ] Copied template
    - [ ] Changed function name to `Rest`
    - [ ] Pasted HTML content
    - [ ] Replaced `class=` with `className=`
    - [ ] Added route in `App.tsx`
    - [ ] Tested at http://localhost:5173/rest

---

## 🚀 Quick Conversion Script

For each page, follow this pattern:

```bash
# 1. Copy template
cp client/src/pages/TEMPLATE.tsx client/src/pages/ShopName.tsx

# 2. Edit the file in VS Code
code client/src/pages/ShopName.tsx

# 3. Make changes:
#    - Change "PAGENAME" to actual name (Shop, Familiars, etc.)
#    - Paste HTML from backup/shopname.html into content section
#    - Replace class= with className=
#    - Replace href="page.html" with <Link to="/page">

# 4. Add route in App.tsx:
code client/src/App.tsx
#    Add: import ShopName from './pages/ShopName'
#    Add: <Route path="/shop-route" element={<ShopName />} />

# 5. Test
npm run dev
# Navigate to http://localhost:5173/shop-route
```

---

## 📊 Progress Tracking

- **Completed:** 2/12 (17%)
- **Remaining:** 10/12 (83%)

**Estimated Time:** ~5 minutes per page = ~50 minutes total

---

## 💡 Tips & Tricks

### Copy HTML from Backup
```bash
# View original HTML
cat backup/shop.html

# Copy specific section
sed -n '/<body/,/<\/body>/p' backup/shop.html
```

### Quick Find & Replace
In VS Code, use Find & Replace (Ctrl+H):
- Find: `class="`
- Replace: `className="`
- Replace All

### Test Navigation
After adding a route, test:
1. Does the page load?
2. Does the correct background appear?
3. Can you click navigation buttons?
4. Can you click back/forward?

---

## ✨ You've Got This!

Each page is just a simple copy-paste-convert job. The hard part (routing, backgrounds, styling) is already set up. Now it's just mechanical conversion. You can do all 10 remaining pages in under an hour! 🎮
