/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import generateGulpfile from '../src/generateGulpfile';

describe('generateGulpfile', () => {
  let path = null;

  before(() => {
    path = {
      src: resolve(__dirname, '../template'),
      dest: `${__dirname}/fixtures/dest`,
      expected: `${__dirname}/fixtures/expected`
    };
  });

  afterEach((done) => {
    rimraf(`${path.dest}/.*`, done);
  });

  it('should return Promise.', (done) => {
    const actual = generateGulpfile(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should generate gulpfile.', async () => {
    await generateGulpfile(path.src, path.dest, {
      css: true,
      cssDeps: true,
      html: true,
      image: true,
      js: true,
      jsDeps: true,
      server: true,
      sprite: true,
      styleguide: true
    });

    const actual = fs.readFileSync(`${path.dest}/gulpfile.babel.js`),
          expected = fs.readFileSync(`${path.expected}/gulpfile.babel.js`);

    assert(actual);
    assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
  });

  it('should generate gulpfile if argument argument options.multiDevice is true.', async () => {
    await generateGulpfile(path.src, path.dest, {
      css: true,
      cssDeps: true,
      html: true,
      image: true,
      js: true,
      jsDeps: true,
      server: true,
      sprite: true,
      styleguide: true,
      multiDevice: true
    });

    const actual = fs.readFileSync(`${path.dest}/gulpfile.babel.js`),
          expected = fs.readFileSync(`${path.expected}/gulpfile.babel-multi-device.js`);

    assert(actual);
    assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
  });

});
