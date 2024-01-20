const { createReadStream, createWriteStream } = require('fs');
const fs = require('fs').promises;
const path = require('path');

const originDir = path.join(__dirname, 'styles');
const destination = path.join(__dirname, 'project-dist', 'bundle.css');

function getFilesCertainExt(filesName, extension) {
  const filesCertainExt = filesName.filter((file) => {
    return path.extname(file) === extension;
  });
  return filesCertainExt;
}

async function getFiles(originDir) {
  try {
    const filesName = await fs.readdir(originDir);
    const filesCertainExt = getFilesCertainExt(filesName, '.css');
    return filesCertainExt;
  } catch (err) {
    console.error(err);
  }
}

async function mergeFilesTo(originDir, destination) {
  try {
    const filesName = await getFiles(originDir);
    const filesOriginPath = filesName.map((file) => {
      return path.join(originDir, file);
    });
    const output = createWriteStream(destination);
    for (const filePath of filesOriginPath) {
      const input = createReadStream(filePath);
      input.pipe(output);
    }
  } catch (err) {
    console.error(err);
  }
}

mergeFilesTo(originDir, destination);
