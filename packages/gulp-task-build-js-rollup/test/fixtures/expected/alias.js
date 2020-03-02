/**
 * @license
 *
 * @hidoo/gulp-task-build-js-rollup:
 * author: hidoo
 * version: <pkg version>
 */

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

  // eslint-disable-next-line strict
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

}());
