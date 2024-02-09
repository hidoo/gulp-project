import piyo from './deps/piyo';

import('./deps/hoge').then(({ default: hoge }) => {
  hoge();
});

piyo();
