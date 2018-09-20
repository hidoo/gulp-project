/* eslint-disable strict, no-console, no-process-env */
(function(window) {
  'use strict';

  console.log('sample-a.js', window);

  if (process.env.NODE_ENV !== 'development') {
    console.log('not development.');
  }

})(window);
/* eslint-enable strict, no-console */
