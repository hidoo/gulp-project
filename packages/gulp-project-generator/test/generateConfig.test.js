import assert from 'node:assert';
import fs from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import generateConfig from '../src/generateConfig.js';

describe('generateConfig', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) => {
    fs.rm(
      path.dest,
      {recursive: true},
      () => fs.mkdir(path.dest, done)
    );
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
