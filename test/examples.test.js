/* eslint max-len: 0, no-magic-numbers: 0 */

const assert = require('assert'),
      path = require('path'),
      childProcess = require('child_process'),
      glob = require('glob'),
      rimraf = require('rimraf');

describe('examples', () => {

  describe('single-device', () => {
    const examplePath = path.resolve(__dirname, '../examples/single-device'),
          exampleDestPath = path.resolve(examplePath, './public');

    afterEach((done) =>
      rimraf(exampleDestPath, done)
    );

    it('should generate files to ./public directory.', async () => {
      process.chdir(examplePath);

      await new Promise((resolve, reject) => childProcess.exec('npm run dev:build', (error) => {
        if (error) {
          reject(error);
        }
        else {
          resolve();
        }
      }));

      const actual = glob.sync(`${exampleDestPath}/**/*`, {nodir: true})
              .map((filepath) => filepath.replace(exampleDestPath, ''))
              .sort(),
            extected = [
              '/css/README.md',
              '/css/bundle.css',
              '/css/main.css',
              '/images/sample.gif',
              '/images/sample.jpg',
              '/images/sample.png',
              '/images/sample.svg',
              '/images/sprites/sample.svg',
              '/index.html',
              '/js/bundle.js',
              '/js/main.js',
              '/page-list.html',
              '/styleguide/index.html',
              '/styleguide/kss-assets/atom-one-dark.less',
              '/styleguide/kss-assets/kss.css',
              '/styleguide/kss-assets/kss.js',
              '/styleguide/kss-assets/kss.less',
              '/styleguide/section-block.html'
            ];

      assert.deepStrictEqual(actual, extected);
    });

  });

  describe('multi-device', () => {
    const examplePath = path.resolve(__dirname, '../examples/multi-device'),
          exampleDestPath = path.resolve(examplePath, './public');

    afterEach((done) =>
      rimraf(exampleDestPath, done)
    );

    it('should generate files to ./public directory.', async () => {
      process.chdir(examplePath);

      await new Promise((resolve, reject) => childProcess.exec('npm run dev:build', (error) => {
        if (error) {
          reject(error);
        }
        else {
          resolve();
        }
      }));

      const actual = glob.sync(`${exampleDestPath}/**/*`, {nodir: true})
              .map((filepath) => filepath.replace(exampleDestPath, ''))
              .sort(),
            extected = [
              '/css/README.md',
              '/css/bundle.css',
              '/css/main.css',
              '/images/sample.gif',
              '/images/sample.jpg',
              '/images/sample.png',
              '/images/sample.svg',
              '/images/sprites/sample.svg',
              '/index.html',
              '/js/bundle.js',
              '/js/main.js',
              '/mobile/css/README.md',
              '/mobile/css/bundle.css',
              '/mobile/css/main.css',
              '/mobile/images/sample.gif',
              '/mobile/images/sample.jpg',
              '/mobile/images/sample.png',
              '/mobile/images/sample.svg',
              '/mobile/images/sprites/sample.svg',
              '/mobile/index.html',
              '/mobile/js/bundle.js',
              '/mobile/js/main.js',
              '/mobile/page-list.html',
              '/mobile/styleguide/index.html',
              '/mobile/styleguide/kss-assets/atom-one-dark.less',
              '/mobile/styleguide/kss-assets/kss.css',
              '/mobile/styleguide/kss-assets/kss.js',
              '/mobile/styleguide/kss-assets/kss.less',
              '/mobile/styleguide/section-block.html',
              '/page-list.html',
              '/styleguide/index.html',
              '/styleguide/kss-assets/atom-one-dark.less',
              '/styleguide/kss-assets/kss.css',
              '/styleguide/kss-assets/kss.js',
              '/styleguide/kss-assets/kss.less',
              '/styleguide/section-block.html'
            ];

      assert.deepStrictEqual(actual, extected);
    });

  });

  describe('use-sass', () => {
    const examplePath = path.resolve(__dirname, '../examples/use-sass'),
          exampleDestPath = path.resolve(examplePath, './public');

    afterEach((done) =>
      rimraf(exampleDestPath, done)
    );

    it('should generate files to ./public directory.', async () => {
      process.chdir(examplePath);

      await new Promise((resolve, reject) => childProcess.exec('npm run dev:build', (error) => {
        if (error) {
          reject(error);
        }
        else {
          resolve();
        }
      }));

      const actual = glob.sync(`${exampleDestPath}/**/*`, {nodir: true})
              .map((filepath) => filepath.replace(exampleDestPath, ''))
              .sort(),
            extected = [
              '/css/README.md',
              '/css/bundle.css',
              '/css/main.css',
              '/images/sample.gif',
              '/images/sample.jpg',
              '/images/sample.png',
              '/images/sample.svg',
              '/images/sprites/sample.svg',
              '/index.html',
              '/js/bundle.js',
              '/js/main.js',
              '/page-list.html',
              '/styleguide/index.html',
              '/styleguide/kss-assets/css/CHANGELOG.md',
              '/styleguide/kss-assets/css/README.md',
              '/styleguide/kss-assets/css/main.css',
              '/styleguide/kss-assets/css/main.min.css',
              '/styleguide/kss-assets/css/main.min.css.gz',
              '/styleguide/kss-assets/images/favicon.ico',
              '/styleguide/kss-assets/images/touchicon.png',
              '/styleguide/kss-assets/images/touchicon.psd',
              '/styleguide/kss-assets/js/main.js',
              '/styleguide/kss-assets/js/main.min.js',
              '/styleguide/kss-assets/js/main.min.js.gz',
              '/styleguide/section-block.html'
            ];

      assert.deepStrictEqual(actual, extected);
    });

  });

});
