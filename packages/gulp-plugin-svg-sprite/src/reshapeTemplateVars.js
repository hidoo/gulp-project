/**
 * reshape variables for template
 *
 * @param {Object} vars variables for template
 * @return {Array}
 */
export default function reshapeTemplateVars(vars = {}) {
  const {shapes, padding, spriteWidth, spriteHeight} = vars;

  return shapes.map((shape) => {
    const RATE = 100,
          totalWidth = spriteWidth,
          totalHeight = spriteHeight,
          width = shape.width.outer - (padding.left + padding.right),
          height = shape.height.outer - (padding.top + padding.bottom),
          offsetX = shape.position.absolute.x - padding.left,
          offsetY = shape.position.absolute.y - padding.top;

    return {
      name: shape.name,

      // shape's integer height
      roundedHeight: Math.round(height),

      // shape's elastic sizes
      // + relative value based on height
      elasticWidth: width / height,
      elasticHeight: height / height,
      elasticBackgroundWidth: totalWidth / width * RATE,
      elasticBackgroundHeight: totalHeight / height * RATE,
      elasticOffsetX: offsetX / height,
      elasticOffsetY: offsetY / height,

      // shape's fixed pixel sizes (same as gulp.spritesmith)
      px: {
        /* eslint-disable camelcase, no-magic-numbers */
        offset_x: offsetX.toFixed(1),
        offset_y: offsetY.toFixed(1),
        width: width.toFixed(1),
        height: height.toFixed(1),
        total_width: spriteWidth.toFixed(1),
        total_height: spriteHeight.toFixed(1)
        /* eslint-enable camelcase, no-magic-numbers */
      }
    };
  });
}
