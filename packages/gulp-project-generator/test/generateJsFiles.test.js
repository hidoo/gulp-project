/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {glob} from 'glob';
import generateJsFiles from '../src/generateJsFiles.js';

describe('generateJsFiles', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) => {
    fs.rm(
      path.dest,
      {recursive: true},
      () => fs.mkdir(path.dest, done)
    );
  });

  it('should return Promise.', (done) => {
    const actual = generateJsFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.js is false.', async () => {
    await generateJsFiles(path.src, path.dest, {js: false});

    const actualTask = glob.sync(`${path.dest}/task/js.js`, {nodir: true}),
          actualAssetList = glob.sync(`${path.dest}/src/js/**/*`, {nodir: true});

    assert(Array.isArray(actualTask));
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask, []);
    assert.deepStrictEqual(actualAssetList, []);
  });

  it('should generate files for javascript task if argument options.js is true and argument options.jsBundler is "browserify".', async () => {
    await generateJsFiles(path.src, path.dest, {js: true, jsBundler: 'browserify'});

    const actualTask = fs.readFileSync(`${path.dest}/task/js.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-js-browserify.js`),
          actualAssetList = glob.sync(`${path.dest}/src/js/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/js/lib/sample-cjs/index.cjs',
            '/src/js/lib/sample-cjs/index.test.js',
            '/src/js/lib/sample-esm/index.js',
            '/src/js/lib/sample-esm/index.test.js',
            '/src/js/main.js'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files for javascript task if argument options.js is true and argument options.jsBundler is "rollup".', async () => {
    await generateJsFiles(path.src, path.dest, {js: true, jsBundler: 'rollup'});

    const actualTask = fs.readFileSync(`${path.dest}/task/js.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-js-rollup.js`),
          actualAssetList = glob.sync(`${path.dest}/src/js/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/js/lib/sample-cjs/index.cjs',
            '/src/js/lib/sample-cjs/index.test.js',
            '/src/js/lib/sample-esm/index.js',
            '/src/js/lib/sample-esm/index.test.js',
            '/src/js/main.js'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files for javascript task if argument options.js is true and argument options.jsDeps is true.', async () => {
    await generateJsFiles(path.src, path.dest, {js: true, jsDeps: true, jsBundler: 'browserify'});

    const actualTask = fs.readFileSync(`${path.dest}/task/js.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-js-deps.js`),
          actualAssetList = glob.sync(`${path.dest}/src/js/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/js/deps/sample-a.js',
            '/src/js/deps/sample-b.js',
            '/src/js/lib/sample-cjs/index.cjs',
            '/src/js/lib/sample-cjs/index.test.js',
            '/src/js/lib/sample-esm/index.js',
            '/src/js/lib/sample-esm/index.test.js',
            '/src/js/main.js'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files for javascript task if argument options.js is true and argument options.multiDevice is true.', async () => {
    await generateJsFiles(path.src, path.dest, {js: true, multiDevice: true, jsBundler: 'browserify'});

    const actualTask = fs.readFileSync(`${path.dest}/task/js.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-js-multi-device.js`),
          actualAssetList = glob.sync(`${path.dest}/src/js/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/js/desktop/lib/sample-cjs/index.cjs',
            '/src/js/desktop/lib/sample-cjs/index.test.js',
            '/src/js/desktop/lib/sample-esm/index.js',
            '/src/js/desktop/lib/sample-esm/index.test.js',
            '/src/js/desktop/main.js',
            '/src/js/mobile/lib/sample-cjs/index.cjs',
            '/src/js/mobile/lib/sample-cjs/index.test.js',
            '/src/js/mobile/lib/sample-esm/index.js',
            '/src/js/mobile/lib/sample-esm/index.test.js',
            '/src/js/mobile/main.js'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files for javascript task if argument options.js and argument options.multiDevice and argument options.jsDeps is true.', async () => {
    await generateJsFiles(path.src, path.dest, {js: true, jsDeps: true, multiDevice: true, jsBundler: 'browserify'});

    const actualTask = fs.readFileSync(`${path.dest}/task/js.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-js-multi-device-deps.js`),
          actualAssetList = glob.sync(`${path.dest}/src/js/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/js/desktop/deps/sample-a.js',
            '/src/js/desktop/deps/sample-b.js',
            '/src/js/desktop/lib/sample-cjs/index.cjs',
            '/src/js/desktop/lib/sample-cjs/index.test.js',
            '/src/js/desktop/lib/sample-esm/index.js',
            '/src/js/desktop/lib/sample-esm/index.test.js',
            '/src/js/desktop/main.js',
            '/src/js/mobile/deps/sample-a.js',
            '/src/js/mobile/deps/sample-b.js',
            '/src/js/mobile/lib/sample-cjs/index.cjs',
            '/src/js/mobile/lib/sample-cjs/index.test.js',
            '/src/js/mobile/lib/sample-esm/index.js',
            '/src/js/mobile/lib/sample-esm/index.test.js',
            '/src/js/mobile/main.js'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

});
