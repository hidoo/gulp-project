/**
 * @license
 *
 * @hidoo/gulp-task-build-js-rollup:
 * author: hidoo
 * version: <pkg version>
 */

(function () {
  'use strict';

  /**
   * Hoge component
   *
   * @param {Object} props component props
   * @return {Component}
   */
  function Hoge(props) {
    return (/*#__PURE__*/React.createElement("div", null, props.hoge)
    );
  }

  return Hoge;

}());
