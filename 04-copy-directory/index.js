const fs = require('fs').promises;
const path = require('path');

const originDirPath = path.join(__dirname, 'files');
const destinationDirPath = path.join(__dirname, 'files-copy');

async function makeDirectory(destinationDirPath) {
  try {
    await fs.access(destinationDirPath);
    console.log(`Директорий уже существует: ${destinationDirPath}`);
  } catch (_err) {
    const dirCreation = await fs.mkdir(destinationDirPath, { recursive: true });
    console.log(`Создан директорий: ${dirCreation}`);
    return dirCreation;
  }
}

async function copyFiles(originDirPath, destinationDirPath) {
  try {
    const files = await fs.readdir(originDirPath);
    for (const file of files) {
      const originFilePath = path.join(originDirPath, file);
      const destinationFilePath = path.join(destinationDirPath, file);
      await fs.copyFile(originFilePath, destinationFilePath);
      console.log(
        `**********\nfile:\n${originFilePath}\nwas copied to:\n${destinationFilePath}`,
      );
    }
  } catch (err) {
    console.error(err);
  }
}

makeDirectory(destinationDirPath).catch(console.error);
copyFiles(originDirPath, destinationDirPath);
