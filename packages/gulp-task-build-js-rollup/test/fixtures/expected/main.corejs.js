/**
 * @license
 *
 * @hidoo/gulp-task-build-js-rollup:
 * author: hidoo
 * version: 0.0.0
 */

(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  /**
   * ESModules 形式のモジュール
   *
   * @return {void}
   */
  function esModule() {
    // eslint-disable-next-line no-console
    console.log('This is ES Module.');
  }

  // eslint-disable-next-line strict
  /**
   * Common JS 形式のモジュール
   *
   * @return {void}
   */

  var cjs = function commonJsModule() {
    // eslint-disable-next-line no-console
    console.log('This is Common JS Module.');
  };

  esModule();
  cjs();

  var Es2015Class =
  /*#__PURE__*/
  function () {
    function Es2015Class() {
      _classCallCheck(this, Es2015Class);

      this.name = 'es2015-class';
    }

    _createClass(Es2015Class, [{
      key: "print",
      value: function print() {
        console.log(this.name); // eslint-disable-line no-console
      }
    }]);

    return Es2015Class;
  }();

  var ChildEs2015Class =
  /*#__PURE__*/
  function (_Es2015Class) {
    _inherits(ChildEs2015Class, _Es2015Class);

    function ChildEs2015Class() {
      var _this;

      _classCallCheck(this, ChildEs2015Class);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ChildEs2015Class).call(this));
      _this.name = 'child-es2015-class';
      return _this;
    }

    return ChildEs2015Class;
  }(Es2015Class);

  var child = new ChildEs2015Class();
  child.print();

}());
