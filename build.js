// Simple build script - copies public/ to dist/
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// Clean dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy public to dist
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(srcDir, distDir);

// Copy src directory too (for JS and CSS)
const srcDest = path.join(distDir, 'src');
if (!fs.existsSync(srcDest)) {
  fs.mkdirSync(srcDest, { recursive: true });
}
const projectSrc = path.join(__dirname, 'src');
copyDir(projectSrc, srcDest);

console.log('Build complete! Files copied to dist/');
console.log(`Total files: ${countFiles(distDir)}`);
function countFiles(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) count += countFiles(path.join(dir, entry.name));
    else count++;
  }
  return count;
}
