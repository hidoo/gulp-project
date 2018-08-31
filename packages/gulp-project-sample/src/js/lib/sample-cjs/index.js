/**
 * return message
 * @return {String}
 */
module.exports = function() {
  return 'This is Common JS Module sample.';
};

/**
 * return UserAgent string
 * @return {String}
 */
module.exports.getUserAgent = function getUserAgent() {
  if (navigator && navigator.userAgent) {
    return navigator.userAgent;
  }
  return '';
};

/**
 * return textContent from specified element
 * @param {HTMLElement} element target element
 * @return {String}
 */
module.exports.getTextContent = function getTextContent(element) {
  if (element && element.nodeName) {
    return element.textContent || '';
  }
  return '';
};
