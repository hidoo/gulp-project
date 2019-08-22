/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import glob from 'glob';
import generateStyleguideFiles from '../src/generateStyleguideFiles';

describe('generateStyleguideFiles', () => {
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generateStyleguideFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.styleguide is false.', async () => {
    await generateStyleguideFiles(path.src, path.dest, {styleguide: false});

    const actualTask = glob.sync(`${path.dest}/task/styleguide.js`, {nodir: true}),
          actualAssetList = glob.sync(`${path.dest}/src/styleguide/**/*`, {nodir: true});

    assert(Array.isArray(actualTask));
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask, []);
    assert.deepStrictEqual(actualAssetList, []);
  });

  it('should generate files for styleguide task if argument options.styleguide is true.', async () => {
    await generateStyleguideFiles(path.src, path.dest, {styleguide: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/styleguide.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-styleguide-no-js.js`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
  });

  it('should generate files for styleguide task if argument options.styleguide and options.js are true.', async () => {
    await generateStyleguideFiles(path.src, path.dest, {styleguide: true, js: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/styleguide.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-styleguide.js`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
  });

  it('should generate files for styleguide task if argument options.styleguide and options.multiDevice are true.', async () => {
    await generateStyleguideFiles(path.src, path.dest, {styleguide: true, js: true, multiDevice: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/styleguide.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-styleguide-multi-device.js`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
  });

  it('should generate files for styleguide task if argument options.styleguide is true and options.cssPreprocessor is "sass".', async () => {
    await generateStyleguideFiles(path.src, path.dest, {styleguide: true, js: true, cssPreprocessor: 'sass'});

    const actualTask = fs.readFileSync(`${path.dest}/task/styleguide.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-styleguide-sass.js`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
  });

});
