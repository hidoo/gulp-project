/**
 * メッセージを返す
 * @return {String}
 */
module.exports = function() {
  return 'This is Common JS Module sample.';
};

/**
 * ユーザーエージェント文字列を返す
 * @return {String}
 */
module.exports.getUserAgent = function getUserAgent() {
  if (navigator && navigator.userAgent) {
    return navigator.userAgent;
  }
  return '';
};

/**
 * 指定された要素の内容テキストを返す
 * @param {HTMLElement} element 対象の要素
 * @return {String}
 */
module.exports.getTextContent = function getTextContent(element) {
  if (element && element.nodeName) {
    return element.textContent || '';
  }
  return '';
};
