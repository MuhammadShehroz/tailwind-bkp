import { underscore } from '@ember/string';

export default function underscoreQuery(query) {
  let prepared = Object.entries(query).reduce((obj, [key, value]) => {
    value && (obj[underscore(key)] = value);
    return obj;
  }, {});
  return prepared;
}
