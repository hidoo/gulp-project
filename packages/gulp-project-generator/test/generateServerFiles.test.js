/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import glob from 'glob';
import generateServerFiles from '../src/generateServerFiles';

describe('generateServerFiles', () => {
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generateServerFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.server is false.', async () => {
    await generateServerFiles(path.src, path.dest, {server: false});

    const actualTask = glob.sync(`${path.dest}/task/server.js`),
          actualAssetList = glob.sync(`${path.dest}/src/server/**/*`);

    assert(Array.isArray(actualTask) && actualTask.length === 0);
    assert(Array.isArray(actualAssetList) && actualAssetList.length === 0);
  });

  it('should generate files for local web server task if argument options.server is true.', async () => {
    await generateServerFiles(path.src, path.dest, {server: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/server.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-server.js`),
          actualAssetList = glob.sync(`${path.dest}/src/server/**/*`),
          expectedAssetList = glob.sync(`${path.src}/src/server/**/*`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(
      actualAssetList.map((filepath) => filepath.replace(path.dest, '')),
      expectedAssetList.map((filepath) => filepath.replace(path.src, ''))
    );
  });

});
