const { createReadStream, createWriteStream } = require('fs');
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

    for (const [placeholder, replacement] of Object.entries(
      this.replacementMap,
    )) {
      data = data.replace(`{{${placeholder}}}`, replacement);
    }

    const transformedChunk = Buffer.from(data, 'utf8');

    callback(null, transformedChunk);
  }
}

async function makeOrRemakeDirectory(dir) {
  try {
    let dirCreation = await fs.mkdir(dir, { recursive: true });
    if (dirCreation) {
      console.log(`создан директорий:\n${dirCreation}`);
    } else {
      console.log(`директорий уже существует, обновим:\n${dir}`);
      await fs.rm(dir, { recursive: true });
      dirCreation = await fs.mkdir(dir, { recursive: true });
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

async function getReplacementMap(tags, componentsDir) {
  const pairs = await Promise.all(
    tags.map(async (tag) => {
      const filePath = path.join(componentsDir, `${tag}.html`);
      const fileContent = await fs.readFile(filePath, 'utf8');
      return [tag, fileContent];
    }),
  );
  const replacementMap = Object.fromEntries(pairs);
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
    console.log(`файлы:\n ${filesName}\nобъединены в:\n${toFile}`);
  } catch (err) {
    console.error(err);
  }
}

async function copyDir(originDir, destinationDir) {
  try {
    const items = await fs.readdir(originDir);
    items.forEach(async (item) => {
      const itemPath = path.join(originDir, item);
      const fileStat = await fs.stat(itemPath);
      if (fileStat.isDirectory()) {
        await fs.mkdir(path.join(destinationDir, item), { recursive: true });
        copyDir(itemPath, path.join(destinationDir, item));
      } else {
        fs.copyFile(
          path.join(originDir, item),
          path.join(destinationDir, item),
        );
      }
    });
    console.log(`директорий:\n${originDir}\nскопирован в:\n${destinationDir}`);
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
    await makeOrRemakeDirectory(projectDistDir);

    const tags = await getTags(componentsDir);

    const replacementMap = await getReplacementMap(tags, componentsDir);

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
    console.log(
      `файл шаблона:\n${templateHtml}\nнаполнен и записан в:\n${indexHtml}`,
    );

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
