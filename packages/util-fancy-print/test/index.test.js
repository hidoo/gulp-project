/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import sinon from 'sinon';
import stripAnsi from 'strip-ansi';
import fancyPrint from '../src';

describe('util-fancy-print', () => {
  let spy = null;

  beforeEach(() => {
    spy = sinon.spy(console, 'log');
  });
  afterEach(() => {
    spy.restore();
  });

  it('should print formatted values.', () => {
    const cases = [
      [
        '',
        [
          {label: 'Hogehogehoge', value: 'hoge'},
          {label: 'Fuga', value: 3000}
        ],
        `
++++++++++++++++++++++++++++++

Hogehogehoge: hoge
        Fuga: 3000

++++++++++++++++++++++++++++++`
      ],
      [
        'Project name',
        [
          {label: 'Hogehogehoge', value: 'hogehogehogehogehogehogehogehogehoge'},
          {label: 'Fuga', value: 3000}
        ],
        `
++++++++++++++++++++++++++++++++++++++++++++++++++
                   Project name
++++++++++++++++++++++++++++++++++++++++++++++++++

Hogehogehoge: hogehogehogehogehogehogehogehogehoge
        Fuga: 3000

++++++++++++++++++++++++++++++++++++++++++++++++++`
      ],
      [
        'Piyo piyo piyo piyo piyo piyo piyo piyo piyo piyo project',
        [
          {label: 'Hogehogehoge', value: 'hoge'},
          {label: 'Fuga', value: 3000}
        ],
        `
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Piyo piyo piyo piyo piyo piyo piyo piyo piyo piyo project
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

Hogehogehoge: hoge
        Fuga: 3000

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++`
      ],
      [
        'Project name',
        [
          {label: 'Hoge', value: false},
          {label: 'Fuga', value: 0}
        ],
        `
++++++++++++++++++++++++++++++
         Project name
++++++++++++++++++++++++++++++

Hoge: false
Fuga: 0

++++++++++++++++++++++++++++++`
      ]
    ];

    cases.forEach(([caption, items, expected], index) => {
      fancyPrint(caption, items);

      assert.equal(stripAnsi(spy.args[index][0]), expected.trim());
    });

  });
});
