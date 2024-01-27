/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import glob from 'glob';
import generateSpriteFiles from '../src/generateSpriteFiles.js';

describe('generateSpriteFiles', () => {
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
    const actual = generateSpriteFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.sprite is false.', async () => {
    await generateSpriteFiles(path.src, path.dest, {sprite: false});

    const actualTask = glob.sync(`${path.dest}/task/sprite.js`, {nodir: true}),
          actualAssetList = glob.sync(`${path.dest}/src/sprite/**/*`, {nodir: true});

    assert(Array.isArray(actualTask));
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask, []);
    assert.deepStrictEqual(actualAssetList, []);
  });

  it('should generate files for svg sprite sheet task if argument options.sprite is true and argument options.spriteType is "svg".', async () => {
    await generateSpriteFiles(path.src, path.dest, {sprite: true, spriteType: 'svg'});

    const actualTask = fs.readFileSync(`${path.dest}/task/sprite.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-sprite-svg.js`),
          actualAssetList = glob.sync(`${path.dest}/src/sprite/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/sprite/sample-a.svg',
            '/src/sprite/sample-b.svg'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files for svg sprite sheet task if argument options.sprite is true and argument options.spriteType is "image".', async () => {
    await generateSpriteFiles(path.src, path.dest, {sprite: true, spriteType: 'image'});

    const actualTask = fs.readFileSync(`${path.dest}/task/sprite.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-sprite-image.js`),
          actualAssetList = glob.sync(`${path.dest}/src/sprite/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/sprite/sample-a.png',
            '/src/sprite/sample-b.png'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files for svg sprite sheet task if argument options.sprite is true and argument options.cssPreprocessor is "sass".', async () => {
    await generateSpriteFiles(path.src, path.dest, {sprite: true, cssPreprocessor: 'sass', spriteType: 'svg'});

    const actualTask = fs.readFileSync(`${path.dest}/task/sprite.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-sprite-sass.js`),
          actualAssetList = glob.sync(`${path.dest}/src/sprite/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/sprite/sample-a.svg',
            '/src/sprite/sample-b.svg'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files for svg sprite sheet task if argument options.sprite is true and argument options.multiDevice is true.', async () => {
    await generateSpriteFiles(path.src, path.dest, {sprite: true, multiDevice: true, spriteType: 'svg'});

    const actualTask = fs.readFileSync(`${path.dest}/task/sprite.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-sprite-multi-device.js`),
          actualAssetList = glob.sync(`${path.dest}/src/sprite/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/sprite/desktop/sample-a.svg',
            '/src/sprite/desktop/sample-b.svg',
            '/src/sprite/mobile/sample-a.svg',
            '/src/sprite/mobile/sample-b.svg'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

});
