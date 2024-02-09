(function () {
  'use strict';

  /**
   * ESModules 形式のモジュール
   *
   * @return {void}
   */
  function esModule() {
    // eslint-disable-next-line no-console
    console.log('This is ES Module.');
  }

  /**
   * Common JS 形式のモジュール
   *
   * @return {void}
   */
  var cjs = function commonJsModule() {
    // eslint-disable-next-line no-console
    console.log('This is Common JS Module.');
  };

  esModule();
  cjs();

})();
