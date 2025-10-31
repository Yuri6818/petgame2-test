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
const out = path.join(root, 'dist');
if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });
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
