import assert from 'node:assert';
import fs from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import copy from '../src/copy.js';

describe('copy', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = {
    src: `${__dirname}/fixtures/src/copy`,
    dest: `${__dirname}/fixtures/dest`
  };

  afterEach((done) => {
    fs.rm(
      path.dest,
      {recursive: true},
      () => fs.mkdir(path.dest, done)
    );
  });

  it('should return Promise that includes Array of copied filepath.', (done) => {
    const actual = copy(`${path.src}/*.{txt,md}`, path.dest, {verbose: false});

    assert(actual instanceof Promise);
    actual
      .then((filePaths) => {
        assert(Array.isArray(filePaths));
        assert(filePaths.includes(`${path.dest}/sample.txt`));
        assert(filePaths.includes(`${path.dest}/sample.md`));
      })
      .then(() => done());
  });

  it('should copy from specified files by glob pattern to specified "dest" directory.', async () => {
    const cases = [
      ['*.{txt,md}', ['sample.txt', 'sample.md']],
      ['*.txt', ['sample.txt']],
      ['*.md', ['sample.md']]
    ];

    await Promise.all(cases.map(
      ([pattern, files]) => copy(`${path.src}/${pattern}`, path.dest, {verbose: false})
        .then(() => files.forEach((file) => {
          const actual = fs.readFileSync(`${path.dest}/${file}`).toString().trim(),
                expected = fs.readFileSync(`${path.src}/${file}`).toString().trim();

          assert(actual);
          assert.deepStrictEqual(actual, expected);
        }))
    ));
  });

  it('should make directory before copy files if directory of argument "dest" is no exists.', async () => {
    const dest = `${path.dest}/not_exists_dir`;

    await copy(`${path.src}/*.{txt,md}`, dest, {verbose: false})
      .then(() => {
        const stat = fs.statSync(dest);

        assert(stat);
        assert(stat.isDirectory());
      });
  });

});
