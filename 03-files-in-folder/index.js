// const fs = require('fs');
// const path = require('path');

// const dirPath = path.join(__dirname, 'secret-folder');

// fs.readdir(dirPath, (err, files) => {
//   if (err) {
//     console.log(err);
//   } else {
//     files.forEach((item) => {
//       const filePath = path.join(dirPath, item);
//       const nameInf = path.parse(filePath);
//       fs.stat(filePath, (err, fileStat) => {
//         if (err) {
//           console.log(err);
//         } else {
//           if (fileStat.isFile()) {
//             console.log(
//               `${nameInf.name} - ${nameInf.ext.slice(1)} - ${convertBytes(
//                 fileStat.size,
//               )}`,
//             );
//           }
//         }
//       });
//     });
//   }
// });

const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

async function listFiles(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    for (const item of files) {
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
    }
  } catch (err) {
    console.error(err);
  }
}

// function listFiles(dirPath) {
//   fs.readdir(dirPath)
//     .then((files) => {
//       files.forEach((item) => {
//         const filePath = path.join(dirPath, item);
//         const nameInf = path.parse(filePath);
//         fs.stat(filePath)
//           .then((fileStat) => {
//             if (fileStat.isFile()) {
//               console.log(
//                 `${nameInf.name} - ${nameInf.ext.slice(1)} - ${convertBytes(
//                   fileStat.size,
//                 )}`,
//               );
//             }
//           })
//           .catch((err) => console.log(err));
//       });
//     })
//     .catch((err) => console.log(err));
// }

// function getFileInfo(filePath) {
//   const nameInf = path.parse(filePath);
//   return fs
//     .stat(filePath)
//     .then((fileStat) => {
//       if (fileStat.isFile()) {
//         return {
//           name: nameInf.name,
//           ext: nameInf.ext.slice(1),
//           size: convertBytes(fileStat.size),
//         };
//       }
//     })
//     .catch((err) => console.log(err));
// }

// function printFileInfo(fileInfo) {
//   if (fileInfo) {
//     console.log(`${fileInfo.name} - ${fileInfo.ext} - ${fileInfo.size}`);
//   }
// }

// function listFiles(dirPath) {
//   fs.readdir(dirPath)
//     .then((files) => {
//       files.forEach((item) => {
//         const filePath = path.join(dirPath, item);
//         getFileInfo(filePath).then(printFileInfo);
//       });
//     })
//     .catch((err) => console.log(err));
// }

listFiles(dirPath);

function convertBytes(bytes) {
  const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'];
  if (bytes === 0) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i)) + sizes[i];
}
