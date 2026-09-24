const sharp = require('sharp');

async function fixLogo() {
  const input = 'src/assets/logo/sagip-ani-logo.jpg';

  // 1. Extract emblem with full bottom intact
  const { data, info } = await sharp(input)
    .extract({ left: 210, top: 85, width: 835, height: 745 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const rgbaBuffer = Buffer.alloc(info.width * info.height * 4);

  for (let y = 0; y < info.height; y++) {
    const origY = y + 85;
    for (let x = 0; x < info.width; x++) {
      const origX = x + 210;
      const srcIdx = (y * info.width + x) * channels;
      const dstIdx = (y * info.width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      const isLetterS = origY >= 815 && origX < 380;
      const isLetterA = origY >= 815 && origX > 780;
      const isPastEmblemBottom = origY > 825;

      if (isLetterS || isLetterA || isPastEmblemBottom || (r > 242 && g > 242 && b > 242)) {
        rgbaBuffer[dstIdx] = 255;
        rgbaBuffer[dstIdx + 1] = 255;
        rgbaBuffer[dstIdx + 2] = 255;
        rgbaBuffer[dstIdx + 3] = 0;
      } else {
        rgbaBuffer[dstIdx] = r;
        rgbaBuffer[dstIdx + 1] = g;
        rgbaBuffer[dstIdx + 2] = b;
        rgbaBuffer[dstIdx + 3] = 255;
      }
    }
  }

  // Save clean transparent emblem, trimmed of empty margins
  const trimmedEmblemBuffer = await sharp(rgbaBuffer, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
  .trim()
  .png()
  .toBuffer();

  await sharp(trimmedEmblemBuffer).toFile('src/assets/logo/sagip-ani-emblem-transparent.png');
  console.log('sagip-ani-emblem-transparent.png saved (trimmed & intact)');

  // 2. Build horizontal logo without excess blank side space
  const emblemResized = await sharp(trimmedEmblemBuffer)
    .resize({ height: 140, fit: 'inside' })
    .toBuffer();

  const emblemMeta = await sharp(emblemResized).metadata();

  // Text width for "Waste-to-Worth Exchange" at 23px is ~320px
  const svgText = Buffer.from(`<svg width="340" height="160" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="900" fill="#0d4722" letter-spacing="-1.5">Sagip-Ani</text>
    <text x="2" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="23" font-weight="700" fill="#334155" letter-spacing="0.5">Waste-to-Worth Exchange</text>
  </svg>`);

  const textMeta = await sharp(svgText).trim().metadata();
  
  // Total canvas exactly fits emblem + gap + text + 10px padding on edges
  const totalWidth = emblemMeta.width + 15 + 335 + 10;

  await sharp({
    create: {
      width: totalWidth,
      height: 160,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    }
  })
  .composite([
    { input: emblemResized, top: 10, left: 5 },
    { input: svgText, top: 0, left: emblemMeta.width + 18 }
  ])
  .trim() // Trim any remaining whitespace on the sides
  .extend({
    top: 6,
    bottom: 6,
    left: 6,
    right: 6,
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  })
  .png()
  .toFile('src/assets/logo/sagip-ani-logo.png');

  console.log('sagip-ani-logo.png updated without excess side space!');
}

fixLogo().catch(console.error);
