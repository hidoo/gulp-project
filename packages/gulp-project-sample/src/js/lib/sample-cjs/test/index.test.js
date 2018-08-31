/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import sample, {getUserAgent, getTextContent} from '../';

describe('js/lib/sample-cjs', () => {

  it('should return "message" string.', () => {
    const actual = sample();

    assert(typeof actual === 'string');
    assert.equal(actual, 'This is Common JS Module sample.');
  });

  describe('getUserAgent', () => {

    it('should return userAgent string if "navigator.userAgent" is exists.', () => {
      const actual = getUserAgent();

      assert(typeof actual === 'string');
      assert.equal(actual, navigator.userAgent);
    });
  });

  describe('getTextContent', () => {
    let element = null;

    beforeEach(() => {
      element = document.createElement('p');
      document.body.appendChild(element);
    });
    afterEach(() => {
      document.body.removeChild(element);
    });

    it('should return empty string if argument "element" is not set.', () => {
      const actual = getTextContent();

      assert(typeof actual === 'string');
      assert.equal(actual, '');
    });

    it('should return element.textContent string if argument "element" is set.', () => {
      const value = 'hoge';

      element.textContent = value;

      const actual = getTextContent(element);

      assert(typeof actual === 'string');
      assert.equal(actual, value);
    });
  });
});
