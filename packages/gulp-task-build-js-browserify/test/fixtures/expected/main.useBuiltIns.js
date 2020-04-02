/**
 * Modules in this bundle
 * @license
 *
 * @hidoo/gulp-task-build-js-browserify:
 *   license: MIT (http://opensource.org/licenses/MIT)
 *   author: hidoo
 *   version: <pkg version>
 *
 * This header is generated by licensify (https://github.com/twada/licensify)
 */
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _esm = _interopRequireDefault(require("./modules/esm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commonJsModule = require('./modules/cjs');

(0, _esm.default)();
commonJsModule(); // apply polyfill for ie8

[].forEach(function (item) {
  return item;
});

},{"./modules/cjs":2,"./modules/esm":3}],2:[function(require,module,exports){
// eslint-disable-next-line strict
'use strict';
/**
 * Common JS 形式のモジュール
 *
 * @return {void}
 */

module.exports = function commonJsModule() {
  // eslint-disable-next-line no-console
  console.log('This is Common JS Module.');
};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = esModule;

/**
 * ESModules 形式のモジュール
 *
 * @return {void}
 */
function esModule() {
  // eslint-disable-next-line no-console
  console.log('This is ES Module.');
}

},{}]},{},[1]);
