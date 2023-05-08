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

const getComponentContent = (componentPath) => {
  componentPath = path.isAbsolute(componentPath) ? componentPath : path.join(dir, componentPath);
  return fs.promises.readFile(componentPath, {encoding: 'utf8'});
};

const mergeTemplate = async (template, componentsDir, result) => {
  template = path.isAbsolute(template) ? template : path.join(dir, template);
  componentsDir = path.isAbsolute(componentsDir) ? componentsDir : path.join(dir, componentsDir);
  result = path.isAbsolute(result) ? result : path.join(dir, result);
  const components = await fs.promises.readdir(componentsDir, {withFileTypes: true})
    .then((files) => {
      return files.filter(x => x.isFile() && path.extname(x.name) === '.html').map(x => x.name);
    });
  let templateContent = await fs.promises.readFile(template, {encoding: 'utf8'});
  for (const component of components) {
    const re = new RegExp(`{{${path.basename(path.parse(component).name)}}}`, 'gi');
    templateContent = templateContent.replace(re, await getComponentContent(path.join(componentsDir, component)));
  }
  await fs.promises.writeFile(result, templateContent);
};
const mergeStyles = (fromDir, to) => {
  const stylesPath = path.isAbsolute(fromDir) ? fromDir : path.join(dir, fromDir);
  const resultPath = path.isAbsolute(to) ? to : path.join(dir, to);
  fs.unlink(resultPath, () => {
    fs.writeFile(resultPath, '', (err) => {
      if (err) throw err;
      fs.readdir(stylesPath, {withFileTypes: true}, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          if (path.extname(file.name) === '.css' && file.isFile()) {
            const readStream = fs.createReadStream(path.join(stylesPath, file.name));
            readStream.on('data', (chunk) => {
              fs.appendFile(resultPath, chunk, (err) => {
                if (err) throw err;
              });
            });
            readStream.on('end', () => readStream.close());
          }
        });
      });
    });
  });
};

const copyDirectory = (from, to) => {
  const dirPath = path.isAbsolute(from) ? from : path.join(dir, from);
  const dirCopyPath = path.isAbsolute(from) ? to : path.join(dir, to);
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
  mergeStyles('styles', 'project-dist/style.css');
  copyDirectory('assets', 'project-dist/assets');
  mergeTemplate('template.html', 'components', './project-dist/index.html');
};

builder('project-dist');