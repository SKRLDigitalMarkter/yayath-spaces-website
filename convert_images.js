const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('assets', async (filePath) => {
    if (filePath.match(/\.(png|jpg|jpeg)$/i)) {
        const webpPath = filePath.replace(/\.[^/.]+$/, "") + ".webp";
        if (!fs.existsSync(webpPath)) {
            try {
                await sharp(filePath)
                    .webp({ quality: 80 })
                    .toFile(webpPath);
                console.log('Converted:', filePath);
            } catch (err) {
                console.error('Error converting', filePath, err);
            }
        }
    }
});
