import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Vinyl from 'vinyl';
import Handlebars from 'handlebars';
import svgSprite from '../src/index.js';

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
    const options = {
      imgName: 'sample.svg',
      cssName: 'sample.styl',
      imgPath: './sample.svg'
    };

    await new Promise((resolve, reject) => {
      const stream = svgSprite({ ...options });

      stream.on('end', resolve);
      stream.on('error', reject);

      stream.once('data', (file) => {
        assert(file.isBuffer());
      });

      stream.svg.once('data', async (file) => {
        const actual = file.contents;
        const expected = await fs.readFile(`${expectedDir}/${options.imgName}`);

        assert(file.isBuffer());
        assert.equal(file.path, options.imgName);
        assert.deepEqual(actual.toString().trim(), expected.toString().trim());
      });

      stream.css.once('data', async (file) => {
        const actual = file.contents;
        const expected = await fs.readFile(`${expectedDir}/${options.cssName}`);

        assert(file.isBuffer());
        assert.equal(file.path, options.cssName);
        assert(file.contents.toString().includes(options.imgPath));
        assert.deepEqual(actual.toString().trim(), expected.toString().trim());
      });

      Promise.all(
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
    const options = {
      imgName: 'sample.padding.svg',
      cssName: 'sample.padding.styl',
      imgPath: './sample.padding.svg',
      padding: 10
    };

    await new Promise((resolve, reject) => {
      const stream = svgSprite({ ...options });

      stream.on('end', resolve);
      stream.on('error', reject);

      stream.once('data', (file) => {
        assert(file.isBuffer());
      });

      stream.svg.once('data', async (file) => {
        const actual = file.contents;
        const expected = await fs.readFile(`${expectedDir}/${options.imgName}`);

        assert(file.isBuffer());
        assert.equal(file.path, options.imgName);
        assert.deepEqual(actual.toString().trim(), expected.toString().trim());
      });

      stream.css.once('data', async (file) => {
        const actual = file.contents;
        const expected = await fs.readFile(`${expectedDir}/${options.cssName}`);

        assert(file.isBuffer());
        assert.equal(file.path, options.cssName);
        assert(file.contents.toString().includes(options.imgPath));
        assert.deepEqual(actual.toString().trim(), expected.toString().trim());
      });

      Promise.all(
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
    const options = {
      imgName: 'sample.layout.svg',
      cssName: 'sample.layout.styl',
      imgPath: './sample.layout.svg',
      layout: 'vertical'
    };

    await new Promise((resolve, reject) => {
      const stream = svgSprite({ ...options });

      stream.on('end', resolve);
      stream.on('error', reject);

      stream.once('data', (file) => {
        assert(file.isBuffer());
      });

      stream.svg.once('data', async (file) => {
        const actual = file.contents;
        const expected = await fs.readFile(`${expectedDir}/${options.imgName}`);

        assert(file.isBuffer());
        assert.equal(file.path, options.imgName);
        assert.deepEqual(actual.toString().trim(), expected.toString().trim());
      });

      stream.css.once('data', async (file) => {
        const actual = file.contents;
        const expected = await fs.readFile(`${expectedDir}/${options.cssName}`);

        assert(file.isBuffer());
        assert.equal(file.path, options.cssName);
        assert(file.contents.toString().includes(options.imgPath));
        assert.deepEqual(actual.toString().trim(), expected.toString().trim());
      });

      Promise.all(
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
    const options = {
      imgName: 'sample.template.svg',
      cssName: 'sample.template.styl',
      imgPath: './sample.template.svg',
      cssTemplate: `${srcDir}/template.hbs`
    };

    await new Promise((resolve, reject) => {
      const stream = svgSprite({ ...options });

      stream.on('end', resolve);
      stream.on('error', reject);

      stream.once('data', (file) => {
        assert(file.isBuffer());
      });

      stream.svg.once('data', async (file) => {
        const actual = file.contents;
        const expected = await fs.readFile(`${expectedDir}/${options.imgName}`);

        assert(file.isBuffer());
        assert.equal(file.path, options.imgName);
        assert.deepEqual(actual.toString().trim(), expected.toString().trim());
      });

      stream.css.once('data', async (file) => {
        const actual = file.contents;
        const expected = await fs.readFile(`${expectedDir}/${options.cssName}`);

        assert(file.isBuffer());
        assert.equal(file.path, options.cssName);
        assert(file.contents.toString().includes(options.imgPath));
        assert.deepEqual(actual.toString().trim(), expected.toString().trim());
      });

      Promise.all(
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
    const options = {
      imgName: 'sample.template-with-helpers.svg',
      cssName: 'sample.template-with-helpers.styl',
      imgPath: './sample.template-with-helpers.svg',
      cssTemplate: `${srcDir}/template-with-helpers.hbs`,
      cssHandlebarsHelpers: {
        wrapBrackets: (value) => new Handlebars.SafeString(`[[ ${value} ]]`)
      }
    };

    await new Promise((resolve, reject) => {
      const stream = svgSprite({ ...options });

      stream.on('end', resolve);
      stream.on('error', reject);

      stream.once('data', (file) => {
        assert(file.isBuffer());
      });

      stream.svg.once('data', async (file) => {
        const actual = file.contents;
        const expected = await fs.readFile(`${expectedDir}/${options.imgName}`);

        assert(file.isBuffer());
        assert.equal(file.path, options.imgName);
        assert.deepEqual(actual.toString().trim(), expected.toString().trim());
      });

      stream.css.once('data', async (file) => {
        const actual = file.contents;
        const expected = await fs.readFile(`${expectedDir}/${options.cssName}`);

        assert(file.isBuffer());
        assert.equal(file.path, options.cssName);
        assert(file.contents.toString().includes(options.imgPath));
        assert.deepEqual(actual.toString().trim(), expected.toString().trim());
      });

      Promise.all(
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
