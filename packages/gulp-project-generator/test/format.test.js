import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {formatJS, formatJSON} from '../src/format.js';

describe('formatCode', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let expectedDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src', 'formatCode');
    expectedDir = path.resolve(fixturesDir, 'expected', 'formatCode');
  });

  describe('formatJS', () => {

    it('should return string of formatted code by eslint.', async () => {
      const src = await fs.readFile(`${srcDir}/sample.js`);
      const expected = await fs.readFile(`${expectedDir}/sample.js`);
      const actual = await formatJS(src.toString());

      assert(typeof actual === 'string');
      assert.deepEqual(
        actual.toString().trim(),
        expected.toString().trim()
      );
    });

  });

  describe('formatJSON', () => {

    it('should return string of formatted json.', async () => {
      const src = '{"hoge": "fuga", "piyo": [{"hoga": "fuge"}]}';
      const expected = `{
  "hoge": "fuga",
  "piyo": [
    {
      "hoga": "fuge"
    }
  ]
}
`;
      const actual = await formatJSON(src);

      assert(typeof actual === 'string');
      assert.deepEqual(actual, expected);
    });

  });

});
