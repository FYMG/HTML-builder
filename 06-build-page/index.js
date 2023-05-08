const path = require('path');
const fs = require('fs');
const dir = path.join(path.dirname(__dirname), '06-build-page');

const createResultFolder = async (resultDir) => {
  const resultPath = path.join(dir, resultDir);
  return fs.promises.rm(resultPath, {recursive: true, force: true})
    .then((err) => {
      if (err) throw err;
      fs.mkdir(resultPath, {recursive: true}, (err) => {
        if (err) throw err;
      });
    });
};

const mergeStyles = (stylesDir, resultDir, resultName = 'bundle.css') => {
  const stylesPath = path.isAbsolute(stylesDir) ? stylesDir : path.join(dir, stylesDir);
  const resultPath = path.isAbsolute(resultDir) ? resultDir : path.join(dir, resultDir);
  fs.unlink(path.join(resultPath, resultName), () => {
    fs.writeFile(path.join(resultPath, resultName), '', (err) => {
      if (err) throw err;
      fs.readdir(stylesPath, {withFileTypes: true}, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          if (path.extname(file.name) === '.css' && file.isFile()) {
            const readStream = fs.createReadStream(path.join(stylesPath, file.name));
            readStream.on('data', (chunk) => {
              fs.appendFile(path.join(resultPath, resultName), chunk, (err) => {
                if (err) throw err;
              });
            });
            readStream.on('end', () => {readStream.close();});
          }
        });
      });
    });
  });
};

const copyDirectory = (directory, directoryCopy) => {
  const dirPath = path.isAbsolute(directory) ? directory : path.join(dir, directory);
  const dirCopyPath = path.isAbsolute(directory) ? directoryCopy : path.join(dir, directoryCopy);
  fs.rm(dirCopyPath, {recursive: true, force: true}, (err) => {
    if (err) throw err;
    fs.mkdir(dirCopyPath,{recursive:true} , (err) => {
      if (err) throw err;
      fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          const filePath = path.join(dirPath, file.name);
          const newFilePath = path.join(dirCopyPath, file.name);
          if (file.isDirectory()){
            copyDirectory(filePath, newFilePath);
          }else {
            fs.copyFile(filePath, newFilePath, (err) => {
              if (err) throw err;
            });
          }
        });
      });
    });
  });
};

const builder = async (resultDir) => {
  await createResultFolder(resultDir);
  mergeStyles('styles', 'project-dist', 'style.css');
  copyDirectory('assets', 'project-dist/assets');
};

builder('project-dist');