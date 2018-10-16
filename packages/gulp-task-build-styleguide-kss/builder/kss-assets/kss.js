/* eslint-disable strict, no-var, prefer-arrow-callback */
(function() {

  'use strict';

  var THEME_CLASS_NAME_DARK = 'styleguide-element-wrapper--dark';
  var THEME_CLASS_NAME_LIGHT = 'styleguide-element-wrapper--light';
  var THEME_CLASS_NAME_RED = 'styleguide-element-wrapper--red';
  var THEME_CLASS_NAME_GREEN = 'styleguide-element-wrapper--green';
  var THEME_CLASS_NAME_BLUE = 'styleguide-element-wrapper--blue';

  var elements = Array.prototype.slice.call(
    document.querySelectorAll('.styleguide-element-wrapper')
  );

  elements.forEach(function(element) {
    element.addEventListener('click', function(event) {
      var isDark = hasClass(element, THEME_CLASS_NAME_DARK),
          isLight = hasClass(element, THEME_CLASS_NAME_LIGHT),
          isRed = hasClass(element, THEME_CLASS_NAME_RED),
          isGreen = hasClass(element, THEME_CLASS_NAME_GREEN),
          isBlue = hasClass(element, THEME_CLASS_NAME_BLUE);

      if (isDark) {
        addClass(element, THEME_CLASS_NAME_LIGHT);
        removeClass(element, THEME_CLASS_NAME_DARK);
      }
      else if (isLight) {
        addClass(element, THEME_CLASS_NAME_RED);
        removeClass(element, THEME_CLASS_NAME_LIGHT);
      }
      else if (isRed) {
        addClass(element, THEME_CLASS_NAME_GREEN);
        removeClass(element, THEME_CLASS_NAME_RED);
      }
      else if (isGreen) {
        addClass(element, THEME_CLASS_NAME_BLUE);
        removeClass(element, THEME_CLASS_NAME_GREEN);
      }
      else if (isBlue) {
        removeClass(element, THEME_CLASS_NAME_BLUE);
      }
      else {
        addClass(element, THEME_CLASS_NAME_DARK);
      }

      event.stopPropagation();
    }, false);
  });

  /**
   * return html classNames
   * @param {HTMLElement} element target element
   * @param {String} className html class name
   * @return {void}
   */
  function getClassNames(element) {
    var className = element.getAttribute('class');

    return className.replace(/\s+/g, ' ').split(' ');
  }

  /**
   * return has html class or not
   * @param {HTMLElement} element target element
   * @param {String} className html class name
   * @return {void}
   */
  function hasClass(element, className) {
    return getClassNames(element).indexOf(className) !== -1; // eslint-disable-line no-magic-numbers
  }

  /**
   * add html class
   * @param {HTMLElement} element target element
   * @param {String} className html class name
   * @return {void}
   */
  function addClass(element, className) {
    var classNames = getClassNames(element);

    if (!hasClass(element, className)) {
      classNames.push(className);
    }

    element.className = classNames.join(' ');
  }

  /**
   * remove html class
   * @param {HTMLElement} element target element
   * @param {String} className html class name
   * @return {void}
   */
  function removeClass(element, className) {
    var classNames = getClassNames(element);
    var filterdClassNames = [];

    if (hasClass(element, className)) {
      classNames.forEach(function(value) {
        if (value !== className) {
          filterdClassNames.push(value);
        }
      });
      element.className = filterdClassNames.join(' ');
    }
    else {
      element.className = classNames.join(' ');
    }

    return element;
  }

})();
