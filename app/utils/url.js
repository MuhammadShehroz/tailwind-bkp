import { decamelize } from '@ember/string';

const toQueryString = (object, decamelizeKey = true) =>
  Object.entries(object)
    .map(
      ([key, value]) =>
        `${decamelizeKey ? decamelize(key) : key}=${encodeURIComponent(value)}`
    )
    .join('&');

export { toQueryString };
