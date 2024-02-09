import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Vinyl from 'vinyl';
import Handlebars from 'handlebars';
import svgSprite from '../src/index.js';

const DEBUG = false;

/**
 * convert svg contents to dataURL
 *
 * @param {Buffer|String} svg svg contents
 * @return {String}
 */
function toDataURL(svg) {
  const contents = svg.toString().trim().replace(/#fff/g, '#000');

  return `data:image/svg+xml,${encodeURIComponent(contents)}`;
}

/**
 * read built file
 *
 * @param {String} file filename
 * @return {String}
 */
async function readBuiltFile(file) {
  const content = await fs.readFile(file);

  return content.toString().trim();
}

describe('gulp-plugin-svg-sprite', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let expectedDir = null;
  let files = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src');
    expectedDir = path.resolve(fixturesDir, 'expected');
    files = [`${srcDir}/sample-a.svg`, `${srcDir}/sample-b.svg`];
  });

  it('should out css and svg to specified path.', async () => {
    const opts = {
      imgName: 'sample.svg',
      cssName: 'sample.styl',
      imgPath: './sample.svg'
    };

    await new Promise(async (resolve, reject) => {
      const expectedSvg = await readBuiltFile(`${expectedDir}/${opts.imgName}`);
      const expectedCss = await readBuiltFile(`${expectedDir}/${opts.cssName}`);
      const stream = svgSprite({ ...opts });

      stream.on('end', resolve);
      stream.on('error', reject);

      stream.on('data', (file) => {
        assert(file.isBuffer());
      });

      stream.svg.on('data', (file) => {
        const actual = file.contents;

        if (DEBUG) {
          console.log('[DEBUG] actual: "%s"', toDataURL(actual));
          console.log('[DEBUG] expected: "%s"', toDataURL(expectedSvg));
        }

        assert(file.isBuffer());
        assert.equal(file.path, opts.imgName);
        assert.deepEqual(actual.toString().trim(), expectedSvg);
      });

      stream.css.on('data', (file) => {
        const actual = file.contents;

        assert(file.isBuffer());
        assert.equal(file.path, opts.cssName);
        assert(file.contents.toString().includes(opts.imgPath));
        assert.deepEqual(actual.toString().trim(), expectedCss);
      });

      await Promise.all(
        files.map(async (file) => {
          stream.write(
            new Vinyl({
              path: file,
              contents: await fs.readFile(file)
            })
          );
        })
      );

      stream.end();
    });
  });

  it('should out css and svg with padding specified by options.padding.', async () => {
    const opts = {
      imgName: 'sample.padding.svg',
      cssName: 'sample.padding.styl',
      imgPath: './sample.padding.svg',
      padding: 10
    };

    await new Promise(async (resolve, reject) => {
      const expectedSvg = await readBuiltFile(`${expectedDir}/${opts.imgName}`);
      const expectedCss = await readBuiltFile(`${expectedDir}/${opts.cssName}`);
      const stream = svgSprite({ ...opts });

      stream.on('end', resolve);
      stream.on('error', reject);

      stream.on('data', (file) => {
        assert(file.isBuffer());
      });

      stream.svg.on('data', (file) => {
        const actual = file.contents;

        if (DEBUG) {
          console.log('[DEBUG] actual: "%s"', toDataURL(actual));
          console.log('[DEBUG] expected: "%s"', toDataURL(expectedSvg));
        }

        assert(file.isBuffer());
        assert.equal(file.path, opts.imgName);
        assert.deepEqual(actual.toString().trim(), expectedSvg);
      });

      stream.css.on('data', (file) => {
        const actual = file.contents;

        assert(file.isBuffer());
        assert.equal(file.path, opts.cssName);
        assert(file.contents.toString().includes(opts.imgPath));
        assert.deepEqual(actual.toString().trim(), expectedCss);
      });

      await Promise.all(
        files.map(async (file) => {
          stream.write(
            new Vinyl({
              path: file,
              contents: await fs.readFile(file)
            })
          );
        })
      );

      stream.end();
    });
  });

  it('should out css and svg with layout specified by options.layout.', async () => {
    const opts = {
      imgName: 'sample.layout.svg',
      cssName: 'sample.layout.styl',
      imgPath: './sample.layout.svg',
      layout: 'vertical'
    };

    await new Promise(async (resolve, reject) => {
      const expectedSvg = await readBuiltFile(`${expectedDir}/${opts.imgName}`);
      const expectedCss = await readBuiltFile(`${expectedDir}/${opts.cssName}`);
      const stream = svgSprite({ ...opts });

      stream.on('end', resolve);
      stream.on('error', reject);

      stream.on('data', (file) => {
        assert(file.isBuffer());
      });

      stream.svg.on('data', (file) => {
        const actual = file.contents;

        if (DEBUG) {
          console.log('[DEBUG] actual: "%s"', toDataURL(actual));
          console.log('[DEBUG] expected: "%s"', toDataURL(expectedSvg));
        }

        assert(file.isBuffer());
        assert.equal(file.path, opts.imgName);
        assert.deepEqual(actual.toString().trim(), expectedSvg);
      });

      stream.css.on('data', (file) => {
        const actual = file.contents;

        assert(file.isBuffer());
        assert.equal(file.path, opts.cssName);
        assert(file.contents.toString().includes(opts.imgPath));
        assert.deepEqual(actual.toString().trim(), expectedCss);
      });

      await Promise.all(
        files.map(async (file) => {
          stream.write(
            new Vinyl({
              path: file,
              contents: await fs.readFile(file)
            })
          );
        })
      );

      stream.end();
    });
  });

  it('should out css and svg with template specified by options.cssTemplate.', async () => {
    const opts = {
      imgName: 'sample.template.svg',
      cssName: 'sample.template.styl',
      imgPath: './sample.template.svg',
      cssTemplate: `${srcDir}/template.hbs`
    };

    await new Promise(async (resolve, reject) => {
      const expectedSvg = await readBuiltFile(`${expectedDir}/${opts.imgName}`);
      const expectedCss = await readBuiltFile(`${expectedDir}/${opts.cssName}`);
      const stream = svgSprite({ ...opts });

      stream.on('end', resolve);
      stream.on('error', reject);

      stream.on('data', (file) => {
        assert(file.isBuffer());
      });

      stream.svg.on('data', (file) => {
        const actual = file.contents;

        if (DEBUG) {
          console.log('[DEBUG] actual: "%s"', toDataURL(actual));
          console.log('[DEBUG] expected: "%s"', toDataURL(expectedSvg));
        }

        assert(file.isBuffer());
        assert.equal(file.path, opts.imgName);
        assert.deepEqual(actual.toString().trim(), expectedSvg);
      });

      stream.css.on('data', (file) => {
        const actual = file.contents;

        assert(file.isBuffer());
        assert.equal(file.path, opts.cssName);
        assert(file.contents.toString().includes(opts.imgPath));
        assert.deepEqual(actual.toString().trim(), expectedCss);
      });

      await Promise.all(
        files.map(async (file) => {
          stream.write(
            new Vinyl({
              path: file,
              contents: await fs.readFile(file)
            })
          );
        })
      );

      stream.end();
    });
  });

  it('should out css and svg with template and helpers specified by options.cssHandlebarsHelpers.', async () => {
    const opts = {
      imgName: 'sample.template-with-helpers.svg',
      cssName: 'sample.template-with-helpers.styl',
      imgPath: './sample.template-with-helpers.svg',
      cssTemplate: `${srcDir}/template-with-helpers.hbs`,
      cssHandlebarsHelpers: {
        wrapBrackets: (value) => new Handlebars.SafeString(`[[ ${value} ]]`)
      }
    };

    await new Promise(async (resolve, reject) => {
      const expectedSvg = await readBuiltFile(`${expectedDir}/${opts.imgName}`);
      const expectedCss = await readBuiltFile(`${expectedDir}/${opts.cssName}`);
      const stream = svgSprite({ ...opts });

      stream.on('end', resolve);
      stream.on('error', reject);

      stream.on('data', (file) => {
        assert(file.isBuffer());
      });

      stream.svg.on('data', (file) => {
        const actual = file.contents;

        if (DEBUG) {
          console.log('[DEBUG] actual: "%s"', toDataURL(actual));
          console.log('[DEBUG] expected: "%s"', toDataURL(expectedSvg));
        }

        assert(file.isBuffer());
        assert.equal(file.path, opts.imgName);
        assert.deepEqual(actual.toString().trim(), expectedSvg);
      });

      stream.css.on('data', (file) => {
        const actual = file.contents;

        assert(file.isBuffer());
        assert.equal(file.path, opts.cssName);
        assert(file.contents.toString().includes(opts.imgPath));
        assert.deepEqual(actual.toString().trim(), expectedCss);
      });

      await Promise.all(
        files.map(async (file) => {
          stream.write(
            new Vinyl({
              path: file,
              contents: await fs.readFile(file)
            })
          );
        })
      );

      stream.end();
    });
  });
});
