const fs = require('fs').promises;
const path = require('path');

const originDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

async function makeDirectory(destinationDir) {
  try {
    const dirCreation = await fs.mkdir(destinationDir, { recursive: true });
    if (dirCreation) {
      console.log(`Создан директорий: ${dirCreation}`);
    } else {
      console.log(`Директорий уже существует: ${destinationDir}`);
    }
    return dirCreation;
  } catch (err) {
    console.error(err);
  }
}

async function copyFiles(originDir, destinationDir) {
  try {
    const files = await fs.readdir(originDir);
    for (const file of files) {
      const originFilePath = path.join(originDir, file);
      const destinationFilePath = path.join(destinationDir, file);
      await fs.copyFile(originFilePath, destinationFilePath);
      console.log(
        `**********\nfile:\n${originFilePath}\nwas copied to:\n${destinationFilePath}`,
      );
    }
  } catch (err) {
    console.error(err);
  }
}

async function main(originDir, destinationDir) {
  try {
    await makeDirectory(destinationDir);
    await copyFiles(originDir, destinationDir);
  } catch (err) {
    console.error(err);
  }
}

main(originDir, destinationDir);
