/**
 * return UserAgent string
 * @return {String}
 */
export function getUserAgent() {
  if (navigator && navigator.userAgent) {
    return navigator.userAgent;
  }
  return '';
}

/**
 * return textContent from specified element
 * @param {HTMLElement} element target element
 * @return {String}
 */
export function getTextContent(element) {
  if (element && element.nodeName) {
    return element.textContent || '';
  }
  return '';
}

/**
 * return message
 * @return {String}
 */
export default function() {
  return 'This is ES Module sample.';
}
