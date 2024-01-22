const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

async function listFilesInfo(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    files.forEach(async (item) => {
      const filePath = path.join(dirPath, item);
      const nameInf = path.parse(filePath);
      const fileStat = await fs.stat(filePath);
      if (fileStat.isFile()) {
        console.log(
          `${nameInf.name} - ${nameInf.ext.slice(1)} - ${convertBytes(
            fileStat.size,
          )}`,
        );
      }
    });
  } catch (err) {
    console.error(err);
  }
}

function convertBytes(bytes) {
  const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'];
  if (bytes === 0) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i)) + sizes[i];
}

listFilesInfo(dirPath);
