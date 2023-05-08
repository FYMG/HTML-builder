const path = require('path');
const fs = require('fs');
const dir = path.join(path.dirname(__dirname), '01-read-file');
const readFile = (filePath) => {
  filePath = path.isAbsolute(filePath) ? filePath : path.join(dir, filePath);
  const stream = fs.createReadStream(filePath);
  stream.on('data', (chunk) => {
    console.log(chunk.toString());
  });
};

readFile('./text.txt');