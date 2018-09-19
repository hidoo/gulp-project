/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import glob from 'glob';
import generateCssFiles from '../src/generateCssFiles';

describe('generateCssFiles', () => {
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generateCssFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.css is false.', async () => {
    await generateCssFiles(path.src, path.dest, {css: false});

    const actualTask = glob.sync(`${path.dest}/task/css.js`, {nodir: true}),
          actualAssetList = glob.sync(`${path.dest}/src/css/**/*`, {nodir: true});

    assert(Array.isArray(actualTask));
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask, []);
    assert.deepStrictEqual(actualAssetList, []);
  });

  it('should generate files css task if argument options.css is true.', async () => {
    await generateCssFiles(path.src, path.dest, {css: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/css.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-css.js`),
          actualAssetList = glob.sync(`${path.dest}/src/css/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/css/README.md',
            '/src/css/main.styl'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files css task if argument options.css is true and argument options.cssDeps is true.', async () => {
    await generateCssFiles(path.src, path.dest, {css: true, cssDeps: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/css.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-css-deps.js`),
          actualAssetList = glob.sync(`${path.dest}/src/css/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/css/README.md',
            '/src/css/deps/sample-a.css',
            '/src/css/deps/sample-b.css',
            '/src/css/main.styl'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files css task if argument options.css is true and argument options.multiDevice is true.', async () => {
    await generateCssFiles(path.src, path.dest, {css: true, multiDevice: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/css.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-css-multi-device.js`),
          actualAssetList = glob.sync(`${path.dest}/src/css/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/css/desktop/README.md',
            '/src/css/desktop/main.styl',
            '/src/css/mobile/README.md',
            '/src/css/mobile/main.styl'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files css task if argument options.css and argument options.multiDevice and argument options.cssDeps is true.', async () => {
    await generateCssFiles(path.src, path.dest, {css: true, cssDeps: true, multiDevice: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/css.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-css-multi-device-deps.js`),
          actualAssetList = glob.sync(`${path.dest}/src/css/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/css/desktop/README.md',
            '/src/css/desktop/deps/sample-a.css',
            '/src/css/desktop/deps/sample-b.css',
            '/src/css/desktop/main.styl',
            '/src/css/mobile/README.md',
            '/src/css/mobile/deps/sample-a.css',
            '/src/css/mobile/deps/sample-b.css',
            '/src/css/mobile/main.styl'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

});
