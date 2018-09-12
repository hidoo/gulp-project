/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import render from '../src/render';

describe('render', () => {
  const path = {
    src: `${__dirname}/fixtures/src/render`
  };

  it('should return Promise includes String of evaled template.', (done) => {
    const actual = render(`${path.src}/template.hbs`, {type: 'template'});

    assert(actual instanceof Promise);
    actual
      .then((content) => {
        assert(typeof content === 'string');
        assert(content.trim() === 'This is a template text.');
      })
      .then(() => done());
  });

});
