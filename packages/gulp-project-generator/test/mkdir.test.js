/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mkdir from '../src/mkdir.js';

describe('mkdir', () => {
  let dirname = null;
  let fixturesDir = null;
  let destDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    destDir = path.resolve(fixturesDir, 'dest');
  });

  afterEach(async () => {
    await fs.rm(destDir, { recursive: true });
    await fs.mkdir(destDir);
  });

  it('should return string of created directory path.', async () => {
    const dest = await mkdir(`${destDir}/hoge`, { verbose: false });

    assert(typeof dest === 'string');
    assert(dest === `${destDir}/hoge`);
  });
});
