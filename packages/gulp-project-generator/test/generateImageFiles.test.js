/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {glob} from 'glob';
import generateImageFiles from '../src/generateImageFiles.js';

describe('generateImageFiles', () => {
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
    const actual = generateImageFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.image is false.', async () => {
    await generateImageFiles(path.src, path.dest, {image: false});

    const actualTask = glob.sync(`${path.dest}/task/image.js`, {nodir: true}),
          actualAssetList = glob.sync(`${path.dest}/src/image/**/*`, {nodir: true});

    assert(Array.isArray(actualTask));
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask, []);
    assert.deepStrictEqual(actualAssetList, []);
  });

  it('should generate files image task if argument options.image is true.', async () => {
    await generateImageFiles(path.src, path.dest, {image: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/image.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-image.js`),
          actualAssetList = glob.sync(`${path.dest}/src/image/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/image/sample.gif',
            '/src/image/sample.jpg',
            '/src/image/sample.png',
            '/src/image/sample.svg'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files image task if argument options.image is true argument options.multiDevice is true.', async () => {
    await generateImageFiles(path.src, path.dest, {image: true, multiDevice: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/image.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-image-multi-device.js`),
          actualAssetList = glob.sync(`${path.dest}/src/image/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/image/desktop/sample.gif',
            '/src/image/desktop/sample.jpg',
            '/src/image/desktop/sample.png',
            '/src/image/desktop/sample.svg',
            '/src/image/mobile/sample.gif',
            '/src/image/mobile/sample.jpg',
            '/src/image/mobile/sample.png',
            '/src/image/mobile/sample.svg'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

});
