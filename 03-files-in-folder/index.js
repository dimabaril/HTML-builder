// const fs = require('fs');
// const path = require('path');

// const dirPath = path.join(__dirname, 'secret-folder');

// fs.readdir(dirPath, (err, items) => {
//   if (err) {
//     console.log(err);
//   } else {
//     items.forEach((item) => {
//       const filePath = path.join(dirPath, item);
//       const nameInf = path.parse(filePath);
//       fs.stat(filePath, (err, stats) => {
//         if (err) {
//           console.log(err);
//         } else {
//           if (stats.isFile()) {
//             console.log(
//               `${nameInf.name} - ${nameInf.ext.slice(1)} - ${convertBytes(
//                 stats.size,
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

// async function listFiles(dirPath) {
//   try {
//     const items = await fs.readdir(dirPath);
//     for (const item of items) {
//       try {
//         const filePath = path.join(dirPath, item);
//         const nameInf = path.parse(filePath);
//         const stats = await fs.stat(filePath);
//         if (stats.isFile()) {
//           console.log(
//             `${nameInf.name} - ${nameInf.ext.slice(1)} - ${convertBytes(
//               stats.size,
//             )}`,
//           );
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

function listFiles(dirPath) {
  fs.readdir(dirPath)
    .then((items) => {
      items.forEach((item) => {
        const filePath = path.join(dirPath, item);
        const nameInf = path.parse(filePath);
        fs.stat(filePath)
          .then((stats) => {
            if (stats.isFile()) {
              console.log(
                `${nameInf.name} - ${nameInf.ext.slice(1)} - ${convertBytes(
                  stats.size,
                )}`,
              );
            }
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
}

listFiles(dirPath);

function convertBytes(bytes) {
  const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb'];
  if (bytes === 0) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i)) + sizes[i];
}
