import assert from 'node:assert';
import { spy } from 'sinon';
import stripAnsi from 'strip-ansi';
import log from 'fancy-log';
import errorHandler from '../src/index.js';

describe('gulp-util-error-handler', () => {
  let spied = null;

  beforeEach(() => {
    spied = spy(log, 'error');
  });

  afterEach(() => {
    spied.restore();
  });

  it('should out formated message if argment "error" is valid.', () => {
    const cases = [
      ['', 'Error'],
      [new Error(), 'Error'],
      [new Error('hogehoge.'), 'Error, detail: hogehoge.'],
      [
        {
          name: 'hoge',
          message: 'error from hoge.',
          reason: '',
          plugin: 'hogePlugin'
        },
        "hoge from 'hogePlugin', detail: error from hoge."
      ],
      [
        {
          name: 'hoge',
          message: 'error from hoge.',
          line: '200',
          column: '5',
          file: '/path/to/file.js',
          reason: '',
          plugin: 'hogePlugin'
        },
        "hoge from 'hogePlugin' in /path/to/file.js at 200:5, detail: error from hoge."
      ]
    ];

    cases.forEach(([value, expected], index) => {
      errorHandler(value);

      assert(stripAnsi(spied.args[index][0]) === expected);
    });
  });
});
