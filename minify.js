const jetpack = require('fs-jetpack');
const path = require('path');
const minifier = require('minifier');

/**
 * Do actual minification
 * @param file
 * @param folder
 */
let processMinifier = function (file, folder) {
  try {
      if (/.*(\.js|\.css)$/g.test(file)) {
          console.info('start minification for ' + file);
          const filePath = path.join(__dirname, 'dist/' + folder, file);
          minifier.minify(filePath, {output: filePath});
      }
  } catch (e) {
    console.log('\nfailed=', e.message);
  }
};

let indepthFileProcess = function(newPath, checkFolder) {
  const currentPath = newPath + checkFolder;
  console.log({currentPath: currentPath});
  let file = '';
  const files = jetpack.list(path.join(__dirname, 'dist/' + currentPath));
  console.log('\n files=', files.toString());
  for (let j = 0; j < files.length; j++) {
    file = files[j];
    if (file.indexOf('.min.') > -1) {
      continue;
    }
    if (file.indexOf('.') === -1) {
      console.log('\n newFolder=', file);
      indepthFileProcess(currentPath + '/', file);
    } else {
      processMinifier(file, currentPath);
    }
  }
};

/**
 * Start file in assets minification
 */
function runMinification() {

  const fileFolders = jetpack.list(path.join(__dirname, 'dist/'));

// console.info(fileFolders);

  for (let i = 0; i < fileFolders.length; i++) {
    let checkFolder = /.*(\.)$/g.test(fileFolders[i]) || fileFolders[i] === "Procfile" ? '' : fileFolders[i];
    let file = '';
    if (checkFolder === '') {
      file = fileFolders[i];
      if (file.indexOf('.min.') > -1) {
        continue;
      }
      processMinifier(file, checkFolder);
    } else {
      if (checkFolder.indexOf('.') === -1) {
        indepthFileProcess('', checkFolder);
      }
    }
  }

  console.info('Minification for assets css/js done ');
}

console.info('Asset css/js minification will start in 5 seconds, please wait');

setTimeout(function () {
  runMinification();
}, 5000);
