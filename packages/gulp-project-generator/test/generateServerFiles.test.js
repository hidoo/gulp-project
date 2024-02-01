import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {glob} from 'glob';
import generateServerFiles from '../src/generateServerFiles.js';

/**
 * read built file
 *
 * @param {String} file filename
 * @return {String}
 */
async function readBuiltFile(file) {
  const content = await fs.readFile(file);

  return content.toString().trim();
}

describe('generateServerFiles', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;
  let expectedDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(dirname, '../template');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');
  });

  afterEach(async () => {
    await fs.rm(destDir, {recursive: true});
    await fs.mkdir(destDir);
  });

  it('should return Promise.', (done) => {
    const actual = generateServerFiles(srcDir, destDir, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate files without options.server.', async () => {
    await generateServerFiles(srcDir, destDir, {server: false});

    const actual = await glob(`${destDir}/task/server.js`, {nodir: true});
    const actualAssets = await glob.sync(`${destDir}/src/server/**/*`, {nodir: true});

    assert(Array.isArray(actual));
    assert(Array.isArray(actualAssets));
    assert.deepEqual(actual, []);
    assert.deepEqual(actualAssets, []);
  });

  it('should generate files for local web server task with options.server.', async () => {
    await generateServerFiles(srcDir, destDir, {server: true});

    const actual = await readBuiltFile(`${destDir}/task/server.js`);
    const expected = await readBuiltFile(`${expectedDir}/task-server.js`);
    const actualAssets = (await glob(`${destDir}/src/server/**/*`, {nodir: true}))
      .map((filepath) => filepath.replace(destDir, ''))
      .sort();

    assert.deepEqual(actual, expected);
    assert.deepEqual(actualAssets, [
      '/src/server/app.js',
      '/src/server/constants/statusCode.js',
      '/src/server/controllers/api.js',
      '/src/server/controllers/index.js',
      '/src/server/routes/api.js',
      '/src/server/routes/index.js',
      '/src/server/views/markdown.hbs'
    ]);
  });

  it('should generate files for local web server task with options.server and options.multiDevice.', async () => {
    await generateServerFiles(srcDir, destDir, {server: true, multiDevice: true});

    const actual = await readBuiltFile(`${destDir}/task/server.js`);
    const expected = await readBuiltFile(`${expectedDir}/task-server.js`);
    const actualAssets = (await glob(`${destDir}/src/server/**/*`, {nodir: true}))
      .map((filepath) => filepath.replace(destDir, ''))
      .sort();

    assert.deepEqual(actual, expected);
    assert.deepEqual(actualAssets, [
      '/src/server/app.js',
      '/src/server/constants/statusCode.js',
      '/src/server/controllers/api.js',
      '/src/server/controllers/index.js',
      '/src/server/routes/api.js',
      '/src/server/routes/index.js',
      '/src/server/views/markdown.hbs'
    ]);
  });

});
