import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

function addFilesRecursively(dirPath: string, zipFolder: JSZip) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subZip = zipFolder.folder(item);
      if (subZip) {
        addFilesRecursively(fullPath, subZip);
      }
    } else {
      const content = fs.readFileSync(fullPath);
      zipFolder.file(item, content);
    }
  }
}

async function createDistZip() {
  const rootDir = process.cwd();
  const distDir = path.join(rootDir, 'dist');

  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist!');
    process.exit(1);
  }

  // Ensure _redirects exists for Netlify SPA routing
  const redirectsPath = path.join(distDir, '_redirects');
  fs.writeFileSync(redirectsPath, '/* /index.html 200\n');

  addFilesRecursively(distDir, zip);

  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  // Write to public folder so it is served by Vite / static server
  const targetPath = path.join(publicDir, 'dist-for-netlify.zip');
  fs.writeFileSync(targetPath, zipBuffer);

  // Also write into dist so the built dist itself has it if needed
  const distTargetPath = path.join(distDir, 'dist-for-netlify.zip');
  fs.writeFileSync(distTargetPath, zipBuffer);

  console.log(`Successfully generated Netlify ready dist zip at ${targetPath} (${zipBuffer.length} bytes)`);
}

createDistZip().catch(console.error);
