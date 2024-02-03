/* eslint strict: off, no-console: off, node/no-process-env: off*/
(function main(window) {
  'use strict';

  console.log('sample-a.js', window);

  if (process.env.NODE_ENV !== 'development') {
    console.log('not development.');
  }
})(window);
