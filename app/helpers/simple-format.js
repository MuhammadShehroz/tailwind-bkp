import Ember from 'ember';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

const { Handlebars } = Ember;

export function simpleFormat([rawValue]) {
  let sanitized = Handlebars.Utils.escapeExpression(rawValue);

  let formattedValue = sanitized.replace(/\r\n?/, '\n');

  if (formattedValue.length > 0) {
    formattedValue = formattedValue.replace(/\n\n/g, '</p><p>');
    formattedValue = formattedValue.replace(/\n/g, '<br/>');
    formattedValue = `<p>${formattedValue}</p>`;
  }

  return htmlSafe(formattedValue);
}

export default helper(simpleFormat);
