import esModule from './modules/esm';
import commonJsModule from './modules/cjs';

esModule();
commonJsModule();

// apply polyfill for ie8
// eslint-disable-next-line no-console
[].forEach((item) => console.log(item));
