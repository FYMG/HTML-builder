const path = require('path');
const fs = require('fs');
const dir = path.join(path.dirname(__dirname), '05-merge-styles');

const mergeStyles = (stylesDir, resultDir, resultName = 'bundle.css') => {
  const stylesPath = path.join(dir, stylesDir);
  const resultPath = path.join(dir, resultDir);
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
          }
        });
      });
    });
  });

};
mergeStyles('styles', 'project-dist');