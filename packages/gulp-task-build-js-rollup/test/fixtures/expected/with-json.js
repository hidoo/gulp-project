(function () {
  'use strict';

  var hoge = {
    fuga: [
      {
        piyo: "hoge.fuga.piyo"
      }
    ]
  };
  var json = {
    hoge: hoge
  };

  /* eslint no-console: off, n/file-extension-in-import: off */

  console.log(json.hoge);

})();
