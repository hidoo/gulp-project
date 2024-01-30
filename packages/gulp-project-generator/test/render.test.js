import assert from 'node:assert';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import render from '../src/render.js';

describe('render', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src', 'render');
  });

  it('should return string of evaluated template.', async () => {
    const content = await render(`${srcDir}/template.hbs`, {type: 'template'});

    assert(typeof content === 'string');
    assert(content.trim() === 'This is a template text.');
  });

});
