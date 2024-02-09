import * as cheerio from 'cheerio';
import CSSOM from 'cssom';

/**
 * optimize svg markup
 * + delete unnecessary values output from adobe photoshop assets
 *
 * @param {String} contents svg contents
 * @return {String}
 */
export default function optimizeSvg(contents = '') {
  // load to parser
  // eslint-disable-next-line id-length
  const $ = cheerio.load(contents, {
    ignoreWhitespace: true,
    xmlMode: true
  });

  // process each <svg> element
  $('svg').each((index, svg) => {
    const $svg = $(svg),
      $style = $svg.find('style'),
      isRoot = !$svg.parent()[0];

    // do nothing if element is root or element has not <style>
    if (isRoot || !$style[0]) {
      return;
    }

    // delete unnecessary attributes if element is not root <svg>
    $svg.removeAttr('xmlns');
    $svg.removeAttr('xmlns:xlink');

    // parse <style> element contents
    // + transform css rules of each selectors to inline style
    CSSOM.parse($style.html()).cssRules.forEach((rule) => {
      const selector = rule.selectorText,
        style = rule.style,
        $targets = $svg.find(selector);

      // transform css rule to inline style
      Array.from(style).forEach((prop) => $targets.css(prop, style[prop]));

      // delete id attribute that was necessary for association with style
      $targets.removeAttr('id');
    });
  });

  // delete unnecessary attributes
  $('[data-name]').removeAttr('data-name');
  $('[class]').removeAttr('class');
  $('style').remove();

  // return optimized svg string
  return $.html();
}
