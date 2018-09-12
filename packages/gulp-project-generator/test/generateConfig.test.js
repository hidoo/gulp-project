/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import generateConfig from '../src/generateConfig';

describe('generateConfig', () => {
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/.*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generateConfig(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should generate config.js.', async () => {
    await generateConfig(path.src, path.dest, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true
    });

    const actual = fs.readFileSync(`${path.dest}/config.js`),
          expected = fs.readFileSync(`${path.expected}/config.js`);

    assert(actual);
    assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
  });

});
