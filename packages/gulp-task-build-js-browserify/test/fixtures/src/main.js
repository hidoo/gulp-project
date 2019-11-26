import esModule from './modules/esm';

const commonJsModule = require('./modules/cjs');

esModule();
commonJsModule();

// apply polyfill for ie8
[].forEach((item) => item);
