/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import Vinyl from 'vinyl';
import sizeOf from 'image-size';
import imageEvenizer from '../src';

describe('gulp-plugin-image-evenizer', () => {

  it('should out evenized image if image width or height is odd number.', async () => {
    const cases = [
      [`${__dirname}/fixtures/9x9.gif`, [10, 10]],
      [`${__dirname}/fixtures/9x10.png`, [10, 10]],
      [`${__dirname}/fixtures/10x9.jpg`, [10, 10]],
      [`${__dirname}/fixtures/10x10.gif`, [10, 10]],
      [`${__dirname}/fixtures/10x10.png`, [10, 10]],
      [`${__dirname}/fixtures/10x10.jpg`, [10, 10]]
    ];

    return await Promise.all(cases.map(([path, [width, height]]) => new Promise((resolve, reject) => {
      const plugin = imageEvenizer({verbose: true}),
            src = fs.readFileSync(path, {encode: null}),
            fakeFile = new Vinyl({
              path: path,
              contents: Buffer.from(src)
            });

      plugin.once('data', (file) => {
        const dimentions = sizeOf(file.contents);

        assert(file.isBuffer());
        assert(dimentions.width === width);
        assert(dimentions.height === height);
      });
      plugin.on('error', reject);
      plugin.on('end', resolve);

      plugin.write(fakeFile);

      plugin.end();
    })));
  });

  it('should out original image if image is animation gif.', async () => {
    const cases = [
      [`${__dirname}/fixtures/animation.gif`, [9, 9]]
    ];

    return await Promise.all(cases.map(([path, [width, height]]) => new Promise((resolve, reject) => {
      const plugin = imageEvenizer({verbose: true}),
            src = fs.readFileSync(path, {encode: null}),
            fakeFile = new Vinyl({
              path: path,
              contents: Buffer.from(src)
            });

      plugin.once('data', (file) => {
        const dimentions = sizeOf(file.contents);

        assert(file.isBuffer());
        assert(dimentions.width === width);
        assert(dimentions.height === height);
      });
      plugin.on('error', reject);
      plugin.on('end', resolve);

      plugin.write(fakeFile);

      plugin.end();
    })));
  });
});
