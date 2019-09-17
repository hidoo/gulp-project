/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import rimraf from 'rimraf';
import mkdir from '../src/mkdir';

describe('mkdir', () => {
  const path = {
    dest: `${__dirname}/fixtures/dest`
  };

  afterEach((done) => {
    rimraf(`${path.dest}/*`, done);
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
