import esModule from './modules/esm';

const commonJsModule = require('./modules/cjs');

esModule();
commonJsModule();

// apply polyfill for ie8
// eslint-disable-next-line no-console
[].forEach((item) => console.log(item));
