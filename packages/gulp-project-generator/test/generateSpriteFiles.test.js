/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import glob from 'glob';
import generateSpriteFiles from '../src/generateSpriteFiles';

describe('generateSpriteFiles', () => {
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generateSpriteFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.sprite is false.', async () => {
    await generateSpriteFiles(path.src, path.dest, {sprite: false});

    const actualTask = glob.sync(`${path.dest}/task/sprite.js`),
          actualAssetList = glob.sync(`${path.dest}/src/sprite/**/*`);

    assert(Array.isArray(actualTask) && actualTask.length === 0);
    assert(Array.isArray(actualAssetList) && actualAssetList.length === 0);
  });

  it('should generate files for svg sprite sheet task if argument options.sprite is true and argument options.spriteType is "svg".', async () => {
    await generateSpriteFiles(path.src, path.dest, {sprite: true, spriteType: 'svg'});

    const actualTask = fs.readFileSync(`${path.dest}/task/sprite.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-sprite-svg.js`),
          actualAssetList = glob.sync(`${path.dest}/src/sprite/*`),
          expectedAssetList = glob.sync(`${path.src}/src/sprite/*.svg`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(
      actualAssetList.map((filepath) => filepath.replace(path.dest, '')),
      expectedAssetList.map((filepath) => filepath.replace(path.src, ''))
    );
  });

  it('should generate files for svg sprite sheet task if argument options.sprite is true and argument options.spriteType is "image".', async () => {
    await generateSpriteFiles(path.src, path.dest, {sprite: true, spriteType: 'image'});

    const actualTask = fs.readFileSync(`${path.dest}/task/sprite.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-sprite-image.js`),
          actualAssetList = glob.sync(`${path.dest}/src/sprite/*`),
          expectedAssetList = glob.sync(`${path.src}/src/sprite/*.{jpg,jpeg,png,gif}`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(
      actualAssetList.map((filepath) => filepath.replace(path.dest, '')),
      expectedAssetList.map((filepath) => filepath.replace(path.src, ''))
    );
  });

});
