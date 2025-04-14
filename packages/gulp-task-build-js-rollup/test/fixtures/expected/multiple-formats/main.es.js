/**
 * ESModules 形式のモジュール
 *
 * @return {void}
 */
function esModule() {
  // eslint-disable-next-line no-console
  console.log('This is ES Module.');
}

var cjs;
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;

  /**
   * Common JS 形式のモジュール
   *
   * @return {void}
   */
  cjs = function commonJsModule() {
    // eslint-disable-next-line no-console
    console.log('This is Common JS Module.');
  };
  return cjs;
}

var cjsExports = requireCjs();

esModule();
cjsExports();

// apply polyfill for ie8
// eslint-disable-next-line no-console
[].forEach(item => console.log(item));
