import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import write from '../src/write.js';

describe('write', () => {
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

  it('should return string of created file path.', async () => {
    const contents = 'hoge hoge';
    const dest = `${destDir}/hoge.txt`;
    const filePath = await write(contents, dest, { verbose: false });

    assert(typeof filePath === 'string');
    assert(filePath === dest);
    assert((await fs.readFile(filePath)).toString() === contents);
  });
});
