/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import mkdir from '../src/mkdir.js';
import isEmptyDir from '../src/isEmptyDir.js';

describe('isEmptyDir', () => {
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

  it('should return Promise includes false if argument "dest" is not empty directory.', (done) => {
    mkdir(`${path.dest}/hoge/fuga`)
      .then(() => {
        const actual = isEmptyDir(`${path.dest}/hoge`, {});

        assert(actual instanceof Promise);
        actual
          .then((isEmpty) => {
            assert(!isEmpty);
          })
          .then(() => done());
      });
  });

  it('should return Promise includes true if argument "dest" is empty directory.', (done) => {
    mkdir(`${path.dest}/hoge`)
      .then(() => {
        const actual = isEmptyDir(`${path.dest}/hoge`, {});

        assert(actual instanceof Promise);
        actual
          .then((isEmpty) => {
            assert(isEmpty);
          })
          .then(() => done());
      });
  });

});
