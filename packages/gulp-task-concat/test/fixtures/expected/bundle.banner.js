/* copyright hidoo */
/* eslint-disable strict, no-console, no-process-env */
(function(window) {
  'use strict';

  console.log('a.js', window);

  if ('test' !== 'development') {
    console.log('not development.');
  }

})(window);
/* eslint-enable strict, no-console */

/* eslint-disable strict, no-console */
(function(window) {
  'use strict';

  console.log('c.js', window);

})(window);
/* eslint-enable strict, no-console */

/* eslint-disable strict, no-console */
(function(window) {
  'use strict';

  console.log('b.js', window);

})(window);
/* eslint-enable strict, no-console */
