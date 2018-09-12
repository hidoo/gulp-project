/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import rimraf from 'rimraf';
import generatePackageJson from '../src/generatePackageJson';

describe('generatePackageJson', () => {
  const path = {
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/.*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generatePackageJson('hoge-project', path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should generate package.json.', async () => {
    await generatePackageJson('hoge-project', path.dest, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true
    });

    /* eslint-disable global-require */
    const actual = require(`${path.dest}/package.json`),
          expected = require(`${path.expected}/package.json`);
    /* eslint-enable global-require */

    assert(actual);
    assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
  });

});
