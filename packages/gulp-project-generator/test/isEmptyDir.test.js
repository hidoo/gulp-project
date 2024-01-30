import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import mkdir from '../src/mkdir.js';
import isEmptyDir from '../src/isEmptyDir.js';

describe('isEmptyDir', () => {
  let dirname = null;
  let fixturesDir = null;
  let destDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    destDir = path.resolve(fixturesDir, 'dest');
  });

  afterEach(async () => {
    await fs.rm(destDir, {recursive: true});
    await fs.mkdir(destDir);
  });

  it('should return false if argument "dest" is not empty directory.', async () => {
    await mkdir(`${destDir}/hoge/fuga`);

    const isEmpty = await isEmptyDir(`${destDir}/hoge`, {});

    assert(isEmpty === false);
  });

  it('should return true if argument "dest" is empty directory.', async () => {
    await mkdir(`${destDir}/hoge`);

    const isEmpty = await isEmptyDir(`${destDir}/hoge`, {});

    assert(isEmpty === true);
  });

});
