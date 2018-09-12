/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import write from '../src/write';

describe('write', () => {
  const path = {
    dest: `${__dirname}/fixtures/dest`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*`, done)
  );

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
