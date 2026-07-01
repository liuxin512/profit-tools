// Generate simple PNG icons for Chrome extension
// Pure Node.js - no external dependencies needed
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function createPNG(width, height, drawFn) {
  // Create RGBA buffer
  const buffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const idx = (y * width + x) * 4;
      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  // Create PNG file
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const rawData = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 4)] = 0; // filter: none
    buffer.copy(rawData, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuffer, data]));

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Draw a simple "chart" icon: blue circle with a white bar chart pattern
function drawIcon(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.4;
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

  // Blue gradient circle background
  if (dist < r) {
    const gradient = 1 - (dist / r) * 0.3;
    const baseR = Math.floor(37 * gradient);
    const baseG = Math.floor(99 * gradient);
    const baseB = Math.floor(235 * gradient);

    // Draw bars (white)
    const barW = w * 0.08;
    const bars = [
      { x: cx - w * 0.2, h: h * 0.15 },
      { x: cx - w * 0.06, h: h * 0.25 },
      { x: cx + w * 0.08, h: h * 0.18 },
    ];

    let isWhite = false;
    for (const bar of bars) {
      if (Math.abs(x - bar.x) < barW / 2 && y > cy + h * 0.05 && y < cy + h * 0.05 + bar.h) {
        isWhite = true;
      }
    }

    if (isWhite) return [255, 255, 255, 255];
    return [baseR, baseG, baseB, 255];
  }

  return [0, 0, 0, 0]; // transparent
}

const sizes = [16, 48, 128];
const dir = path.join(__dirname, 'icons');

for (const size of sizes) {
  const png = createPNG(size, size, drawIcon);
  fs.writeFileSync(path.join(dir, `icon${size}.png`), png);
  console.log(`Created icon${size}.png (${size}x${size})`);
}

console.log('All icons generated!');
