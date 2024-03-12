/* eslint-disable strict, no-console, func-names */
(function (window) {
  'use strict';

  console.log('a.js', window);

  if (process.env.NODE_ENV !== 'development') {
    console.log('not development.');
  }
})(window);
/* eslint-enable strict, no-console, func-names */
