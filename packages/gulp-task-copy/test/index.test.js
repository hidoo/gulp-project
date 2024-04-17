import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import copy from '../src/index.js';

describe('gulp-task-copy', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src');
    destDir = path.resolve(fixturesDir, 'dest');
  });

  afterEach(async () => {
    await fs.rm(destDir, { recursive: true });
    await fs.mkdir(destDir);
  });

  it('should output files to options.dest.', async () => {
    const extnames = ['css', 'js', 'png', 'jpg', 'gif', 'svg'];
    const task = copy({
      src: `${srcDir}/*.{${extnames.join(',')}}`,
      dest: destDir
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      extnames.map(async (extname) => {
        const actual = await fs.readFile(
          path.join(destDir, `sample.${extname}`)
        );
        const expected = await fs.readFile(
          path.join(srcDir, `sample.${extname}`)
        );

        assert(actual);

        assert.deepEqual(actual, expected);
      })
    );
  });
});
