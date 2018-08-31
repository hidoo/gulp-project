/**
 * ユーザーエージェント文字列を返す
 * @return {String}
 */
export function getUserAgent() {
  if (navigator && navigator.userAgent) {
    return navigator.userAgent;
  }
  return '';
}

/**
 * 指定された要素の内容テキストを返す
 * @param {HTMLElement} element 対象の要素
 * @return {String}
 */
export function getTextContent(element) {
  if (element && element.nodeName) {
    return element.textContent || '';
  }
  return '';
}

/**
 * メッセージを返す
 * @return {String}
 */
export default function() {
  return 'This is ES Module sample.';
}
