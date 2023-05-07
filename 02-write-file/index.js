const path = require('path');
const fs = require('fs');
const readline = require('readline');
const dir = path.join(path.dirname(__dirname), '02-write-file');
const {stdin, stdout} = require('node:process');
const exit = () => {
  console.log('Программа ввода успешно завершена');
  process.exit();
};
const writeFile = (filePath) => {
  if (!path.isAbsolute(filePath)) {
    filePath = path.join(dir, filePath);
  }
  const writeStream = fs.createWriteStream(filePath);
  const rl = readline.createInterface(stdin, stdout);
  console.log('Введи в меня свой текст:');
  rl.on('line', (input) => {
    if (input === 'exit') exit();
    writeStream.write(input + '\n');
  });
  rl.on('SIGINT', () => exit());
};

writeFile('./text.txt');