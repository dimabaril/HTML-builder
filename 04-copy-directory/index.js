const fs = require('fs').promises;
const path = require('path');

const originDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

async function makeOrRemakeDirectory(destinationDir) {
  try {
    let dirCreation = await fs.mkdir(destinationDir, { recursive: true });
    if (dirCreation) {
      console.log(`создан директорий:\n${dirCreation}`);
    } else {
      console.log(`директорий уже существует, обновим:\n${destinationDir}`);
      await fs.rm(destinationDir, { recursive: true });
      dirCreation = await fs.mkdir(destinationDir, { recursive: true });
    }
    return dirCreation;
  } catch (err) {
    console.error(err);
  }
}

async function copyFiles(originDir, destinationDir) {
  try {
    const files = await fs.readdir(originDir);
    files.forEach(async (file) => {
      const originFilePath = path.join(originDir, file);
      const destinationFilePath = path.join(destinationDir, file);
      await fs.copyFile(originFilePath, destinationFilePath);
      console.log(
        `файл:\n${originFilePath}\nскопирован в:\n${destinationFilePath}`,
      );
    });
  } catch (err) {
    console.error(err);
  }
}

async function main(originDir, destinationDir) {
  try {
    await makeOrRemakeDirectory(destinationDir);
    await copyFiles(originDir, destinationDir);
  } catch (err) {
    console.error(err);
  }
}

main(originDir, destinationDir);
