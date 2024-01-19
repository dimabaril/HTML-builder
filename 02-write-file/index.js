const fs = require('fs');
const path = require('path');

const { stdin, stdout, exit } = require('process');
const filePath = path.join(__dirname, 'text.txt');
const writeFileStream = fs.createWriteStream(filePath, { flags: 'a' });

stdout.write(
  'Для выхода: ctrl + c или exit\nВведи текст который запишем в файл (text.txt): ',
);
stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    console.log('Выход из программы');
    exit();
  }
  writeFileStream.write(chunk);
});
