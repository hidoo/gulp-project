/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Vinyl from 'vinyl';
import Handlebars from 'handlebars';
import svgSprite from '../src/index.js';

describe('gulp-plugin-svg-sprite', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  let path = null,
    srcs = null;

  before(() => {
    path = {
      src: `${__dirname}/fixtures/src`,
      expected: `${__dirname}/fixtures/expected`
    };
    srcs = [`${path.src}/sample-a.svg`, `${path.src}/sample-b.svg`];
  });

  it('should out css and svg to specified path.', async () => {
    const options = {
      imgName: 'sample.svg',
      cssName: 'sample.styl',
      imgPath: './sample.svg'
    };

    await new Promise((resolve) => {
      const stream = svgSprite({ ...options });

      stream.once('data', (file) => {
        assert(file.isBuffer());
      });
      stream.svg.once('data', (file) => {
        const actual = file.contents,
          expected = fs.readFileSync(`${path.expected}/${options.imgName}`);

        assert(file.isBuffer());
        assert(file.path === options.imgName);
        assert.deepStrictEqual(
          actual.toString().trim(),
          expected.toString().trim()
        );
      });
      stream.css.once('data', (file) => {
        const actual = file.contents,
          expected = fs.readFileSync(`${path.expected}/${options.cssName}`);

        assert(file.isBuffer());
        assert(file.path === options.cssName);
        assert(file.contents.toString().includes(options.imgPath));
        assert.deepStrictEqual(
          actual.toString().trim(),
          expected.toString().trim()
        );
      });
      stream.on('end', resolve);

      srcs.forEach((src) => {
        stream.write(
          new Vinyl({
            path: src,
            contents: fs.readFileSync(src)
          })
        );
      });

      stream.end();
    });
  });

  it('should out css and svg that applied padding if argument options.padding is set.', async () => {
    const options = {
      imgName: 'sample.padding.svg',
      cssName: 'sample.padding.styl',
      imgPath: './sample.padding.svg',
      padding: 10
    };

    await new Promise((resolve) => {
      const stream = svgSprite({ ...options });

      stream.once('data', (file) => {
        assert(file.isBuffer());
      });
      stream.svg.once('data', (file) => {
        const actual = file.contents,
          expected = fs.readFileSync(`${path.expected}/${options.imgName}`);

        assert(file.isBuffer());
        assert(file.path === options.imgName);
        assert.deepStrictEqual(
          actual.toString().trim(),
          expected.toString().trim()
        );
      });
      stream.css.once('data', (file) => {
        const actual = file.contents,
          expected = fs.readFileSync(`${path.expected}/${options.cssName}`);

        assert(file.isBuffer());
        assert(file.path === options.cssName);
        assert(file.contents.toString().includes(options.imgPath));
        assert.deepStrictEqual(
          actual.toString().trim(),
          expected.toString().trim()
        );
      });
      stream.on('end', resolve);

      srcs.forEach((src) => {
        stream.write(
          new Vinyl({
            path: src,
            contents: fs.readFileSync(src)
          })
        );
      });

      stream.end();
    });
  });

  it('should out css and svg that applied layout if argument options.layout is set.', async () => {
    const options = {
      imgName: 'sample.layout.svg',
      cssName: 'sample.layout.styl',
      imgPath: './sample.layout.svg',
      layout: 'vertical'
    };

    await new Promise((resolve) => {
      const stream = svgSprite({ ...options });

      stream.once('data', (file) => {
        assert(file.isBuffer());
      });
      stream.svg.once('data', (file) => {
        const actual = file.contents,
          expected = fs.readFileSync(`${path.expected}/${options.imgName}`);

        assert(file.isBuffer());
        assert(file.path === options.imgName);
        assert.deepStrictEqual(
          actual.toString().trim(),
          expected.toString().trim()
        );
      });
      stream.css.once('data', (file) => {
        const actual = file.contents,
          expected = fs.readFileSync(`${path.expected}/${options.cssName}`);

        assert(file.isBuffer());
        assert(file.path === options.cssName);
        assert(file.contents.toString().includes(options.imgPath));
        assert.deepStrictEqual(
          actual.toString().trim(),
          expected.toString().trim()
        );
      });
      stream.on('end', resolve);

      srcs.forEach((src) => {
        stream.write(
          new Vinyl({
            path: src,
            contents: fs.readFileSync(src)
          })
        );
      });

      stream.end();
    });
  });

  it('should out css and svg that applied template if argument options.cssTemplate is set.', async () => {
    const options = {
      imgName: 'sample.template.svg',
      cssName: 'sample.template.styl',
      imgPath: './sample.template.svg',
      cssTemplate: `${path.src}/template.hbs`
    };

    await new Promise((resolve) => {
      const stream = svgSprite({ ...options });

      stream.once('data', (file) => {
        assert(file.isBuffer());
      });
      stream.svg.once('data', (file) => {
        const actual = file.contents,
          expected = fs.readFileSync(`${path.expected}/${options.imgName}`);

        assert(file.isBuffer());
        assert(file.path === options.imgName);
        assert.deepStrictEqual(
          actual.toString().trim(),
          expected.toString().trim()
        );
      });
      stream.css.once('data', (file) => {
        const actual = file.contents,
          expected = fs.readFileSync(`${path.expected}/${options.cssName}`);

        assert(file.isBuffer());
        assert(file.path === options.cssName);
        assert(file.contents.toString().includes(options.imgPath));
        assert.deepStrictEqual(
          actual.toString().trim(),
          expected.toString().trim()
        );
      });
      stream.on('end', resolve);

      srcs.forEach((src) => {
        stream.write(
          new Vinyl({
            path: src,
            contents: fs.readFileSync(src)
          })
        );
      });

      stream.end();
    });
  });

  it('should out css and svg that applied template and helpers if argument options.cssHandlebarsHelpers is set.', async () => {
    const options = {
      imgName: 'sample.template-with-helpers.svg',
      cssName: 'sample.template-with-helpers.styl',
      imgPath: './sample.template-with-helpers.svg',
      cssTemplate: `${path.src}/template-with-helpers.hbs`,
      cssHandlebarsHelpers: {
        wrapBrackets: (value) => new Handlebars.SafeString(`[[ ${value} ]]`)
      }
    };

    await new Promise((resolve) => {
      const stream = svgSprite({ ...options });

      stream.once('data', (file) => {
        assert(file.isBuffer());
      });
      stream.svg.once('data', (file) => {
        const actual = file.contents,
          expected = fs.readFileSync(`${path.expected}/${options.imgName}`);

        assert(file.isBuffer());
        assert(file.path === options.imgName);
        assert.deepStrictEqual(
          actual.toString().trim(),
          expected.toString().trim()
        );
      });
      stream.css.once('data', (file) => {
        const actual = file.contents,
          expected = fs.readFileSync(`${path.expected}/${options.cssName}`);

        assert(file.isBuffer());
        assert(file.path === options.cssName);
        assert(file.contents.toString().includes(options.imgPath));
        assert.deepStrictEqual(
          actual.toString().trim(),
          expected.toString().trim()
        );
      });
      stream.on('end', resolve);

      srcs.forEach((src) => {
        stream.write(
          new Vinyl({
            path: src,
            contents: fs.readFileSync(src)
          })
        );
      });

      stream.end();
    });
  });
});
