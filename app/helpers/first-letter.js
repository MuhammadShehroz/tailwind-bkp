import { helper } from '@ember/component/helper';

export function firstLetter([str = '']) {
  return str.charAt(0);
}

export default helper(firstLetter);
