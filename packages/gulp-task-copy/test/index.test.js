/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import copy from '../src/index.js';

describe('gulp-task-copy', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`
  };

  afterEach((done) => {
    fs.rm(
      path.dest,
      {recursive: true},
      () => fs.mkdir(path.dest, done)
    );
  });

  it('should out to "options.dest" if argument "options" is default.', (done) => {
    const task = copy({
      src: [
        `${path.src}/*.{css,js,png,jpg,gif,svg}`
      ],
      dest: path.dest
    });

    task().on('finish', () => {
      const extnames = ['css', 'js', 'png', 'jpg', 'gif', 'svg'];

      extnames.forEach((extname) => {
        const actual = fs.readFileSync(`${path.dest}/sample.${extname}`),
              expected = fs.readFileSync(`${path.src}/sample.${extname}`);

        assert(actual);
        assert.deepStrictEqual(actual, expected);
      });
      done();
    });
  });

});
