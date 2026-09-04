import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

function addFilesRecursively(dirPath: string, zipFolder: JSZip, rootDir: string) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    if (
      item === 'node_modules' ||
      item === '.git' ||
      item === 'dist' ||
      item === '.env' ||
      item === 'public/downloads' ||
      item === 'public/project-source.zip'
    ) {
      continue;
    }

    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subZip = zipFolder.folder(item);
      if (subZip) {
        addFilesRecursively(fullPath, subZip, rootDir);
      }
    } else {
      const content = fs.readFileSync(fullPath);
      zipFolder.file(item, content);
    }
  }
}

async function createProjectZip() {
  const rootDir = process.cwd();
  addFilesRecursively(rootDir, zip, rootDir);

  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const targetPath = path.join(publicDir, 'project-source.zip');
  fs.writeFileSync(targetPath, zipBuffer);
  console.log(`Successfully generated project zip at ${targetPath} (${zipBuffer.length} bytes)`);
}

createProjectZip().catch(console.error);
