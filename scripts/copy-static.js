const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else if (stat.isFile()) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

const root = process.cwd();
const targets = ['js', 'img', 'sounds', 'public'];
const staticFiles = ['style.css', 'favicon.ico'];
const out = path.join(root, 'dist');
if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

// First copy the asset folders
for (const t of targets) {
  const src = path.join(root, t);
  const dest = path.join(out, t);
  try {
    copyRecursive(src, dest);
    console.log(`Copied ${t} -> dist/${t}`);
  } catch (err) {
    console.warn(`Skipping ${t}:`, err.message);
  }
}

// Then copy HTML and other static files from root
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const allStaticFiles = [...htmlFiles, ...staticFiles];

for (const file of allStaticFiles) {
  const src = path.join(root, file);
  const dest = path.join(out, file);
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} -> dist/${file}`);
    }
  } catch (err) {
    console.warn(`Skipping ${file}:`, err.message);
  }
}
