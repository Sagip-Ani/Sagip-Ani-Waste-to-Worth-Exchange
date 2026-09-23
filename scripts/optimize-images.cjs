const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = 'src/assets/images/landing';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

async function optimize() {
  for (const file of files) {
    const filePath = path.join(dir, file);
    const tempPath = path.join(dir, 'temp-' + file);
    
    // Determine max dimension based on usage
    const isHero = file.includes('hero');
    const maxWidth = isHero ? 1920 : 800;

    await sharp(filePath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(tempPath);

    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
    
    const stat = fs.statSync(filePath);
    console.log(`Optimized ${file}: ${(stat.size / 1024).toFixed(1)} KB`);
  }
}

optimize().catch(console.error);

