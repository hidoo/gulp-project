/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import mkdir from '../src/mkdir.js';

describe('mkdir', () => {
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

  it('should return Promise includes String of created directory path.', (done) => {
    const actual = mkdir(`${path.dest}/hoge`, {verbose: false});

    assert(actual instanceof Promise);
    actual
      .then((dest) => {
        assert(typeof dest === 'string');
        assert(dest === `${path.dest}/hoge`);
      })
      .then(() => done());
  });

});
