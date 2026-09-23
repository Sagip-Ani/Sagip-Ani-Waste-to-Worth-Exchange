const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:/Users/Jane Justine/.gemini/antigravity/brain/a8302d12-5dc5-4069-8911-1782e71ab28c';

fs.mkdirSync('src/assets/images/landing', { recursive: true });
fs.mkdirSync('src/assets/logo', { recursive: true });

const files = fs.readdirSync(brainDir);

const heroImg = files.filter(f => f.startsWith('hero_farm_bg') && f.endsWith('.jpg')).pop();
const howImg = files.filter(f => f.startsWith('farmer_how_it_works') && f.endsWith('.jpg')).pop();
const pineImg = files.filter(f => f.startsWith('pineapple_crowns') && f.endsWith('.jpg')).pop();
const cornImg = files.filter(f => f.startsWith('corn_husks') && f.endsWith('.jpg')).pop();
const rejImg = files.filter(f => f.startsWith('rejected_produce') && f.endsWith('.jpg')).pop();

console.log('Found image files:', { heroImg, howImg, pineImg, cornImg, rejImg });

if (heroImg) fs.copyFileSync(path.join(brainDir, heroImg), 'src/assets/images/landing/hero-farm.jpg');
if (howImg) fs.copyFileSync(path.join(brainDir, howImg), 'src/assets/images/landing/how-it-works.jpg');
if (pineImg) fs.copyFileSync(path.join(brainDir, pineImg), 'src/assets/images/landing/pineapple-crowns.jpg');
if (cornImg) fs.copyFileSync(path.join(brainDir, cornImg), 'src/assets/images/landing/corn-husks.jpg');
if (rejImg) fs.copyFileSync(path.join(brainDir, rejImg), 'src/assets/images/landing/rejected-produce.jpg');

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 130" width="540" height="130">
  <g transform="translate(15, 12)">
    <!-- Stylized emblem -->
    <path d="M 50 100 C 18 90 2 56 12 28 C 24 50 44 68 50 100 Z" fill="#15803d" />
    <path d="M 50 100 C 82 90 98 56 88 28 C 76 50 56 68 50 100 Z" fill="#166534" />
    <path d="M 50 96 C 32 76 25 50 30 32 C 38 45 47 68 50 96 Z" fill="#22c55e" />
    <path d="M 50 96 C 68 76 75 50 70 32 C 62 45 53 68 50 96 Z" fill="#15803d" />
    <!-- Center seed / sprout -->
    <circle cx="50" cy="24" r="10" fill="#f59e0b" />
    <path d="M 50 6 C 46 15 42 22 50 30 C 58 22 54 15 50 6 Z" fill="#84cc16" />
    <!-- Stem -->
    <path d="M 46 98 Q 50 108 54 98" stroke="#14532d" stroke-width="4" stroke-linecap="round" fill="none" />
  </g>
  <text x="125" y="65" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="50" font-weight="800" fill="#0d3d29" letter-spacing="-1">Sagip-Ani</text>
  <text x="128" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="#475569" letter-spacing="0.2">Waste-to-Worth Exchange</text>
</svg>`;

sharp(Buffer.from(logoSvg))
  .png()
  .toFile('src/assets/logo/sagip-ani-logo.png')
  .then(() => console.log('Assets processed and logo saved successfully!'))
  .catch(err => {
    console.error('Error saving logo:', err);
    process.exit(1);
  });

