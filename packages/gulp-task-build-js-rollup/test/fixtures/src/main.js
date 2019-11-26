import esModule from './modules/esm';
import commonJsModule from './modules/cjs';

esModule();
commonJsModule();

// apply polyfill for ie8
[].forEach((item) => item);
