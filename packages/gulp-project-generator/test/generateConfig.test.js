import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import generateConfig from '../src/generateConfig';

describe('generateConfig', () => {
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
    const actual = generateConfig(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should generate config.js.', async () => {
    await generateConfig(path.src, path.dest, {
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

    const actual = fs.readFileSync(`${path.dest}/config.js`).toString().trim(),
          expected = fs.readFileSync(`${path.expected}/config.js`).toString().trim();

    assert(actual);
    assert.deepStrictEqual(actual, expected);
  });

  it('should generate config.js if argument argument options.multiDevice is true.', async () => {
    await generateConfig(path.src, path.dest, {
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

    const actual = fs.readFileSync(`${path.dest}/config.js`).toString().trim(),
          expected = fs.readFileSync(`${path.expected}/config-multi-device.js`).toString().trim();

    assert(actual);
    assert.deepStrictEqual(actual, expected);
  });

});
