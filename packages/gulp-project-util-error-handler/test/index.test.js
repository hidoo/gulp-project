/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import sinon from 'sinon';
import stripAnsi from 'strip-ansi';
import log from 'fancy-log';
import errorHandler from '../src';

describe('errorHandler', () => {
  let spy = null;

  before(() => {
    spy = sinon.spy(log, 'error');
  });

  it('should out formated message if argment "error" is valid.', () => {
    const cases = [
      [
        '',
        'Error'
      ],
      [
        new Error(),
        'Error'
      ],
      [
        new Error('hogehoge.'),
        'Error, detail: hogehoge.'
      ],
      [
        {
          name: 'hoge',
          message: 'error from hoge.',
          reason: '',
          plugin: 'hogePlugin'
        },
        'hoge from \'hogePlugin\', detail: error from hoge.'
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
        'hoge from \'hogePlugin\' in /path/to/file.js at 200:5, detail: error from hoge.'
      ]
    ];

    cases.forEach(([value, expected], index) => {
      errorHandler(value);

      assert(stripAnsi(spy.args[index][0]) === expected);
    });
  });
});
