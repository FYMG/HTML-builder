const path = require('path');
const fs = require('fs');
const dir = path.join(path.dirname(__dirname), '04-copy-directory');

const copyDirectory = (directory, directoryCopy) => {
  const dirPath = path.join(dir, directory);
  const dirCopyPath = path.join(dir, directoryCopy);
  fs.rm(dirCopyPath, {recursive: true, force: true}, (err) => {
    if (err) throw err;
    fs.mkdir(dirCopyPath,{recursive:true} , (err) => {
      if (err) throw err;
      fs.readdir(dirPath, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          const filePath = path.join(dirPath, file);
          const newFilePath = path.join(dirCopyPath, file);
          fs.copyFile(filePath, newFilePath, (err) => {
            if (err) throw err;
          });
        });
      });
    });
  });
};

copyDirectory('files', 'files-copy');
