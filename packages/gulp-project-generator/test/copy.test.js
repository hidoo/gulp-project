import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import copy from '../src/copy.js';

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

describe('copy', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src', 'copy');
    destDir = path.resolve(fixturesDir, 'dest');
  });

  afterEach(async () => {
    await fs.rm(destDir, {recursive: true});
    await fs.mkdir(destDir);
  });

  it('should return an Array of copied filepath.', async () => {
    const filePaths = await copy(`${srcDir}/*.{txt,md}`, destDir, {verbose: false});

    assert(Array.isArray(filePaths));
    assert(filePaths.includes(`${destDir}/sample.txt`));
    assert(filePaths.includes(`${destDir}/sample.md`));
  });

  it('should copy files specified by glob pattern to "dest" directory.', async () => {
    const cases = [
      ['*.{txt,md}', ['sample.txt', 'sample.md']],
      ['*.txt', ['sample.txt']],
      ['*.md', ['sample.md']]
    ];

    await Promise.all(
      cases.map(async ([pattern, files]) => {
        await copy(`${srcDir}/${pattern}`, destDir, {verbose: false});

        await Promise.all(files.map(async (file) => {
          const actual = await readBuiltFile(`${destDir}/${file}`);
          const expected = await readBuiltFile(`${srcDir}/${file}`);

          assert(actual);
          assert.deepEqual(actual, expected);
        }));
      })
    );
  });

  it('should make directory before copy files if no "dest" directory.', async () => {
    const dest = `${destDir}/not_exists_dir`;

    await copy(`${srcDir}/*.{txt,md}`, dest, {verbose: false});

    const stat = await fs.stat(dest);

    assert(stat);
    assert(stat.isDirectory());
  });

});
