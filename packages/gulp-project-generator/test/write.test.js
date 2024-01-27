/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import write from '../src/write.js';

describe('write', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = {
    dest: `${__dirname}/fixtures/dest`
  };

  afterEach((done) => {
    fs.rm(
      path.dest,
      {recursive: true},
      () => fs.mkdir(path.dest, done)
    );
  });

  it('should return Promise includes String of created file path.', (done) => {
    const contents = 'hoge hoge',
          dest = `${path.dest}/hoge.txt`,
          actual = write(contents, dest, {verbose: false});

    assert(actual instanceof Promise);
    actual
      .then((filepath) => {
        assert(typeof filepath === 'string');
        assert(filepath === dest);
        assert(fs.readFileSync(filepath).toString() === contents);
      })
      .then(() => done());
  });

});
