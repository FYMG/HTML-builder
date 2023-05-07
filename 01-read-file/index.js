const path = require('path');
const fs = require('fs');
const dir = path.dirname(__filename);
const readFile = (filePath) => {
  if (!path.isAbsolute(filePath)) {
    filePath = path.join(dir, filePath);
  }
  const stream = fs.createReadStream(filePath);
  stream.on('data', (chunk) => {
    console.log(chunk.toString());
  });
};

readFile('./text.txt');