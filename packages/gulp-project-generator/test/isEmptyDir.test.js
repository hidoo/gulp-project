/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import rimraf from 'rimraf';
import mkdir from '../src/mkdir';
import isEmptyDir from '../src/isEmptyDir';

describe('isEmptyDir', () => {
  let path = null;

  before(() => {
    path = {
      dest: `${__dirname}/fixtures/dest`
    };
  });

  afterEach((done) => {
    rimraf(`${path.dest}/*`, done);
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
