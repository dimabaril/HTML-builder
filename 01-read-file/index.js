const fs = require('fs');
const path = require('path');

const { stdout } = process;
const filePath = path.join(__dirname, 'text.txt');
const readFileStream = fs.createReadStream(filePath, 'utf8');

readFileStream.on('data', (chunk) => stdout.write(chunk));
readFileStream.on('error', (error) => stdout.write(error.message));
