import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import sanitizeHtml from 'ember-cli-sanitize-html';

export function customHtmlSanitize([rawValue]) {
  if (rawValue === null) return '';

  let sanitized = sanitizeHtml(rawValue, {
    allowedTags: [
      'a',
      'b',
      'blockquote',
      'br',
      'cite',
      'code',
      'dd',
      'dl',
      'dt',
      'em',
      'i',
      'li',
      'ol',
      'p',
      'pre',
      'q',
      'small',
      'strike',
      'strong',
      'sub',
      'sup',
      'u',
      'ul',
      'td',
      'tr',
      'table',
      'thead',
      'tbody',
      'tfoot',
      'th',
      'col',
      'caption',
      'colgroup',
      'hr'
    ],

    allowedAttributes: {
      '*': ['class'],
      a: ['href'],
      blockquote: ['cite'],
      q: ['cite'],
      td: ['colspan', 'rowspan']
    }
  });

  let formattedValue = sanitized.replace(/\r\n?/, '\n');

  if (formattedValue.length > 0) {
    formattedValue = formattedValue.replace(/\n\n/g, '</p><p>');
    formattedValue = formattedValue.replace(/\n/g, '<br/>');
    formattedValue = `<p>${formattedValue}</p>`;
  }

  return htmlSafe(formattedValue);
}

export default helper(customHtmlSanitize);
