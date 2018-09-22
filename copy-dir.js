const fse = require('fs-extra');

function copyDir() {
    try {
        fse.copySync('src/public', 'dist/public');
        fse.copySync('src/config/rsa-keys', 'dist/config/rsa-keys');
        fse.copySync('src/storage', 'dist/storage');
        fse.copySync('src/config/config.json', 'dist/config/config.json');
        fse.copySync('src/config/config.json', 'dist/config/currency.json');
        fse.copySync('package.json', 'dist/package.json');
        fse.copySync('package.json', 'dist/package.json');
        fse.copySync('README.md', 'dist/README.md');
    } catch (e) {
        console.log('Error from File Copy: ', e.message);
    }
}

console.log('file copy will start in 5 seconds');
setTimeout(() => {
    copyDir();
}, 5000);