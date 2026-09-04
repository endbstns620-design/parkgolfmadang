import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createZips() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(process.cwd(), 'public');

  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Run npm run build first.');
    return;
  }

  // 1. Create dist-for-deploy.zip
  const zip = new JSZip();

  function addFolderToZip(folderPath: string, zipFolder: JSZip) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      if (file.endsWith('.zip')) continue;
      const fullPath = path.join(folderPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(file);
        if (subFolder) addFolderToZip(fullPath, subFolder);
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(file, content);
      }
    }
  }

  addFolderToZip(distDir, zip);

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const deployZipDist = path.join(distDir, 'kwang-real-estate-dist.zip');
  const deployZipPublic = path.join(publicDir, 'kwang-real-estate-dist.zip');

  fs.writeFileSync(deployZipDist, buffer);
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(deployZipPublic, buffer);
  }

  console.log('Created deployable ZIP file successfully:', deployZipDist);
}

createZips().catch(console.error);
