import Component from '@ember/component';
import { computed } from '@ember/object';
import hbs from 'htmlbars-inline-precompile';

/**
 * Format number with delimiter every three chars.
 * Original implementation:
 * http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
 * @private
 * @param  {float} value - Number to format
 * @param  {integer} c   - The number of decimals
 * @param  {char} d      - Decimal separator (Default: '.')
 * @param  {char} t      - Thousands separator (Default: ',')
 * @return {string}      - The number value formated with decimal and thousands separator
 */
export function formatInternational(value, c, d, t) {
  c = isNaN((c = Math.abs(c))) ? 2 : c;
  d = d === undefined ? '.' : d;
  t = t === undefined ? ',' : t;

  let s = value < 0 ? '-' : '';
  let i = String(parseInt((value = Math.abs(Number(value) || 0).toFixed(c))));
  let l = i.length;
  let j = l > 3 ? l % 3 : 0;
  let x1 = j ? i.substr(0, j) + t : '';
  let x2 = i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`);
  let x3 = c
    ? d +
      Math.abs(value - i)
        .toFixed(c)
        .slice(2)
    : '';
  return s + x1 + x2 + x3;
}

export default Component.extend({
  tagName: '',
  layout: hbs('{{formattedNumber}}'),

  formattedNumber: computed(
    'decimals',
    'decimalsSeparator',
    'thousandsSeparator',
    'value',
    function () {
      let { decimals, decimalsSeparator, thousandsSeparator, value } = this;

      return formatInternational(
        value,
        decimals,
        decimalsSeparator,
        thousandsSeparator
      );
    }
  )
});
