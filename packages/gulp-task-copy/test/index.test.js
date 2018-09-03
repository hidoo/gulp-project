/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import copy from '../src';

describe('gulp-task-copy', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*.{css,js,png,jpg,gif,svg}`, done)
  );

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
