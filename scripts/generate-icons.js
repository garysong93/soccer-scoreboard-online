#!/usr/bin/env node

/**
 * Generate PWA icons from a source SVG
 *
 * Usage: node scripts/generate-icons.js
 *
 * Requires: npm install sharp
 */

const fs = require('fs');
const path = require('path');

async function generateIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.log('Please install sharp first: npm install sharp');
    console.log('Then run: node scripts/generate-icons.js');
    process.exit(1);
  }

  const publicDir = path.join(__dirname, '..', 'public');
  const svgPath = path.join(publicDir, 'favicon.svg');

  if (!fs.existsSync(svgPath)) {
    console.error('favicon.svg not found in public directory');
    process.exit(1);
  }

  const icons = [
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'pwa-192x192.png' },
    { size: 512, name: 'pwa-512x512.png' },
  ];

  console.log('Generating icons from favicon.svg...');

  for (const { size, name } of icons) {
    const outputPath = path.join(publicDir, name);
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`  Created ${name} (${size}x${size})`);
  }

  // Generate Open Graph image (1200x630) with background
  const ogWidth = 1200;
  const ogHeight = 630;
  const iconSize = 200;

  const ogBackground = `
    <svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a"/>
          <stop offset="100%" style="stop-color:#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="${ogWidth}" height="${ogHeight}" fill="url(#bg)"/>
      <text x="${ogWidth/2}" y="${ogHeight - 100}"
            font-family="Arial, sans-serif"
            font-size="48"
            font-weight="bold"
            fill="white"
            text-anchor="middle">
        Soccer Scoreboard Online
      </text>
      <text x="${ogWidth/2}" y="${ogHeight - 50}"
            font-family="Arial, sans-serif"
            font-size="24"
            fill="#94a3b8"
            text-anchor="middle">
        Free Live Score Tracker
      </text>
    </svg>
  `;

  // Create OG image
  const ogPath = path.join(publicDir, 'og-image.png');
  const iconBuffer = await sharp(svgPath)
    .resize(iconSize, iconSize)
    .png()
    .toBuffer();

  await sharp(Buffer.from(ogBackground))
    .composite([{
      input: iconBuffer,
      top: Math.floor((ogHeight - iconSize) / 2) - 50,
      left: Math.floor((ogWidth - iconSize) / 2)
    }])
    .png()
    .toFile(ogPath);

  console.log(`  Created og-image.png (${ogWidth}x${ogHeight})`);

  // Create favicon.ico (simple PNG with .ico extension for modern browsers)
  const faviconPath = path.join(publicDir, 'favicon.ico');
  await sharp(svgPath)
    .resize(32, 32)
    .png()
    .toFile(faviconPath);
  console.log('  Created favicon.ico (32x32)');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
