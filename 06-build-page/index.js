const { createReadStream, createWriteStream, readFileSync } = require('fs');
const fs = require('fs').promises;
const path = require('path');

const { Transform } = require('stream');

const projectDistDir = path.join(__dirname, 'project-dist');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const styleCss = path.join(projectDistDir, 'style.css');
const templateHtml = path.join(__dirname, 'template.html');
const indexHtml = path.join(projectDistDir, 'index.html');
const assetsOriginDir = path.join(__dirname, 'assets');
const assetsDestinationDir = path.join(projectDistDir, 'assets');

class FileReplacementStream extends Transform {
  constructor(replacementMap) {
    super();
    this.replacementMap = replacementMap;
  }

  _transform(chunk, encoding, callback) {
    let data = chunk.toString('utf8');

    for (const [placeholder, filePath] of Object.entries(this.replacementMap)) {
      const replacement = readFileSync(filePath, 'utf8');
      data = data.replace(`{{${placeholder}}}`, replacement);
    }

    const transformedChunk = Buffer.from(data, 'utf8');

    callback(null, transformedChunk);
  }
}

async function makeDirectory(dir) {
  try {
    const dirCreation = await fs.mkdir(dir, { recursive: true });
    if (dirCreation) {
      console.log(`Создан директорий: ${dirCreation}`);
    } else {
      console.log(`Директорий уже существует: ${dir}`);
    }
    return dirCreation;
  } catch (err) {
    console.error(err);
  }
}

async function getTags(componentsDir) {
  try {
    const filesName = await fs.readdir(componentsDir);
    const namesOnly = filesName.map((fileName) => {
      return path.parse(fileName).name;
    });
    return namesOnly;
  } catch (err) {
    console.error(err);
  }
}

function getReplacementMap(tags, componentsDir) {
  const replacementMap = {};
  for (const tag of tags) {
    replacementMap[tag] = path.join(componentsDir, `${tag}.html`);
  }
  return replacementMap;
}

async function getStyleFiles(stylesDir, extension = '.css') {
  try {
    const filesName = await fs.readdir(stylesDir);
    const filesCertainExt = filesName.filter((file) => {
      return path.extname(file) === extension;
    });
    return filesCertainExt;
  } catch (err) {
    console.error(err);
  }
}

async function mergeFilesTo(fromDir, toFile) {
  try {
    const filesName = await getStyleFiles(fromDir);
    const filesPath = filesName.map((fileName) => {
      return path.join(fromDir, fileName);
    });
    const output = createWriteStream(toFile);
    for (const filePath of filesPath) {
      const input = createReadStream(filePath);
      input.pipe(output);
    }
  } catch (err) {
    console.error(err);
  }
}

async function copyDir(originDir, destinationDir) {
  try {
    const items = await fs.readdir(originDir);
    for (const item of items) {
      const itemPath = path.join(originDir, item);
      const fileStat = await fs.stat(itemPath);
      if (fileStat.isDirectory()) {
        await fs.mkdir(path.join(destinationDir, item), { recursive: true });
        await copyDir(itemPath, path.join(destinationDir, item));
      } else {
        await fs.copyFile(
          path.join(originDir, item),
          path.join(destinationDir, item),
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function main(
  projectDistDir,
  componentsDir,
  stylesDir,
  styleCss,
  templateHtml,
  indexHtml,
) {
  try {
    await makeDirectory(projectDistDir);

    const tags = await getTags(componentsDir);
    console.log(tags);

    const replacementMap = getReplacementMap(tags, componentsDir);

    const templateReadStream = createReadStream(templateHtml);
    templateReadStream.on('error', (err) => {
      console.error(err);
    });

    const replacementStream = new FileReplacementStream(replacementMap);
    replacementStream.on('error', (err) => {
      console.error(err);
    });

    const indexWriteStream = createWriteStream(indexHtml);
    indexWriteStream.on('error', (err) => {
      console.error(err);
    });

    templateReadStream.pipe(replacementStream).pipe(indexWriteStream);

    mergeFilesTo(stylesDir, styleCss);

    copyDir(assetsOriginDir, assetsDestinationDir);
  } catch (err) {
    console.error(err);
  }
}

main(
  projectDistDir,
  componentsDir,
  stylesDir,
  styleCss,
  templateHtml,
  indexHtml,
);
