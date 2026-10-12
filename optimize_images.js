import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dirs = [
  'assets/images/spaces',
  'assets/images/hero',
  'assets/images/warehouse',
  'assets/images/about'
];

async function optimizeImages() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      // If image is larger than 200KB, optimize it
      if (stat.size > 200 * 1024) {
        console.log(`Optimizing ${filePath}...`);
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        const outPath = path.join(dir, `${baseName}.webp`);
        
        await sharp(filePath)
          .resize(1200, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outPath);
          
        console.log(`Saved ${outPath}`);
      }
    }
  }
}

optimizeImages().catch(console.error);
