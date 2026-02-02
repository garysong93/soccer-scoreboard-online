# PWA Icons

The following icons are needed for the PWA:

## Required Files

- `favicon.ico` - 32x32 favicon
- `apple-touch-icon.png` - 180x180 Apple touch icon
- `pwa-192x192.png` - 192x192 PWA icon
- `pwa-512x512.png` - 512x512 PWA icon
- `og-image.png` - 1200x630 Open Graph image for social sharing

## Quick Generation

You can generate these icons from the favicon.svg using a tool like:

### Using sharp (Node.js)
```bash
npm install sharp
```

```javascript
const sharp = require('sharp');

// Generate PWA icons
sharp('favicon.svg')
  .resize(192, 192)
  .png()
  .toFile('pwa-192x192.png');

sharp('favicon.svg')
  .resize(512, 512)
  .png()
  .toFile('pwa-512x512.png');

sharp('favicon.svg')
  .resize(180, 180)
  .png()
  .toFile('apple-touch-icon.png');
```

### Using online tools
- https://realfavicongenerator.net
- https://favicon.io

## Recommended Design

The icon should feature:
- Soccer ball on dark background (#0f172a)
- Simple, recognizable at small sizes
- No text (too small to read)
