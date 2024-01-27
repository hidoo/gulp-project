import chalk from 'chalk';

/**
 * print formatted values
 *
 * @param {String} caption caption of values
 * @param {Array<Object>} items items of label and value
 * @return {void}
 *
 * @example
 * import fancyPrint from '@hidoo/util-fancy-print';
 *
 * fancyPrint('project name', [
 *   {label: 'Host', value: '0.0.0.0'},
 *   {label: 'Port', value: 8000}
 * ]);
 */
export default function fancyPrint(caption = '', items = []) {
  if (!Array.isArray(items)) {
    throw new TypeError('Argument "items" must be array.');
  }

  const delimiter = ': ',
        minWidth = 30,
        labelLength = Math.max.apply(
          null,
          items.map(({label}) => label.length)
        ),
        valueLength = Math.max.apply(
          null,
          items.map(({value}) => String(value).length)
        ),
        maxWidth = Math.max.apply(
          null,
          [minWidth, caption.length, labelLength + valueLength + delimiter.length]
        );

  const lf = '';
  const separator = chalk.grey(
    Array.from(Array(maxWidth).keys())
      .map(() => '+')
      .join('')
  );
  const paddingWidth = parseInt((maxWidth - caption.length) / 2, 10); // eslint-disable-line no-magic-numbers
  const padding = Array.from(Array(paddingWidth).keys())
    .map(() => ' ')
    .join('');

  const lines = [
    separator,
    caption === '' ? false : [`${padding}${caption}`, separator],
    lf,
    items
      .map(({label, value}) => {
        return {label: label.padStart(labelLength, ' '), value};
      })
      .map(({label, value}) => {
        return {label: chalk.cyan(label), value};
      })
      .map(({label, value}) => {
        return {label, value: value ? chalk.white(value) : chalk.grey(value)};
      })
      .map(({label, value}) => `${label}${delimiter}${value}`),
    lf,
    separator
  ];

  console.log(
    lines
      .reduce((prev, current) => prev.concat(current), [])
      .filter((line) => line || line === '')
      .join('\n')
  );
}
