const path = require('path');
const fs = require('fs');
const dir = path.join(path.dirname(__dirname), '03-files-in-folder');

const filesInFolder = (folder) => {
  const folderPath = path.isAbsolute(folder) ? folder : path.join(dir, folder);
  fs.stat(folderPath, (err, stats) => {
    if (err) throw err;
    if (!stats.isDirectory()) throw new Error('Указана не папка!');
  });
  fs.readdir(folderPath, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          console.log(
            `${path.basename(path.parse(file).name)} - ${path.extname(file).replace('.', '')} - ${stats.size / 1024}KB`
          );
        }
      }, );
    });
  });
};

filesInFolder('./secret-folder');