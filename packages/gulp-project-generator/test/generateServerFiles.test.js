/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import glob from 'glob';
import generateServerFiles from '../src/generateServerFiles.js';

describe('generateServerFiles', () => {
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
    const actual = generateServerFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.server is false.', async () => {
    await generateServerFiles(path.src, path.dest, {server: false});

    const actualTask = glob.sync(`${path.dest}/task/server.js`, {nodir: true}),
          actualAssetList = glob.sync(`${path.dest}/src/server/**/*`, {nodir: true});

    assert(Array.isArray(actualTask));
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask, []);
    assert.deepStrictEqual(actualAssetList, []);
  });

  it('should generate files for local web server task if argument options.server is true.', async () => {
    await generateServerFiles(path.src, path.dest, {server: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/server.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-server.js`),
          actualAssetList = glob.sync(`${path.dest}/src/server/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/server/app.js',
            '/src/server/constants/statusCode.js',
            '/src/server/controllers/api.js',
            '/src/server/controllers/index.js',
            '/src/server/routes/api.js',
            '/src/server/routes/index.js',
            '/src/server/views/markdown.hbs'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files for local web server task if argument options.server and argument options.multiDevice is true.', async () => {
    await generateServerFiles(path.src, path.dest, {server: true, multiDevice: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/server.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-server.js`),
          actualAssetList = glob.sync(`${path.dest}/src/server/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/server/app.js',
            '/src/server/constants/statusCode.js',
            '/src/server/controllers/api.js',
            '/src/server/controllers/index.js',
            '/src/server/routes/api.js',
            '/src/server/routes/index.js',
            '/src/server/views/markdown.hbs'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

});
