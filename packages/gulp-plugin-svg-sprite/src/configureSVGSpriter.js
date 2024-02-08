import SVGSpriter from 'svg-sprite';

/**
 * initialize SVGSpriter
 * + most options are decisive, only some values can be changed
 *
 * @param {Object} options options
 * @param {Object} options.padding padding between image in sprite sheet
 * @param {Object} options.layout layout for generate sprite sheet（one of packed, vertical, and horizontal）
 * @return {SVGSpriter}
 */
export default function configureSvgSpriter(options = {}) {
  const { padding, layout } = options;

  return new SVGSpriter({
    shape: {
      spacing: {
        padding: padding || 0, // eslint-disable-line no-magic-numbers
        box: 'content'
      },
      transform: ['svgo']
    },
    mode: {
      css: {
        dest: '',
        layout: layout || 'packed',
        prefix: '',
        dimensions: '',
        sprite: '',
        bust: false,
        render: { styl: true }
      }
    }
  });
}
