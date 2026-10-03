import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const slugs = [
  "terraform", "docker", "git", "githubactions", "react",
  "python", "postgresql", "linux", "fastapi", "nodedotjs",
  "nginx", "nextdotjs", "typescript", "ansible", "kubernetes", "grafana"
];

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Downloading icons...');

Promise.all(slugs.map(slug => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(iconsDir, `${slug}.svg`);
    const file = fs.createWriteStream(filePath);
    
    https.get(`https://cdn.simpleicons.org/${slug}`, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${slug}.svg`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      console.error(`Error downloading ${slug}: ${err.message}`);
      reject(err);
    });
  });
})).then(() => {
  console.log('All icons downloaded successfully!');
}).catch(err => {
  console.error('Failed to download some icons.');
});
