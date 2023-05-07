const path = require('path');
const fs = require('fs');
const readline = require('readline');
const dir = path.dirname(__filename);
const {stdin, stdout} = require('node:process');
const ExitMassage = 'Программа ввода успешно завершена';
const writeFile = (filePath) => {
  if (!path.isAbsolute(filePath)) {
    filePath = path.join(dir, filePath);
  }
  const stream = fs.createWriteStream(filePath);
  const rl = readline.createInterface(stdin, stdout);
  console.log('Введи в меня свой текст:');
  rl.on('line', (input) => {
    if (input === 'exit') {
      console.log(ExitMassage);
      process.exit(0);
    }
    stream.write(input + '\n');
  });
  process.on('beforeExit', () => console.log(ExitMassage));
};

writeFile('./text.txt');