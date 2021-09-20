import { sort } from '@ember/object/computed';

export function sortByID(property) {
  return sort(property, function (a, b) {
    let aID = parseInt(a.get('id'));
    let bID = parseInt(b.get('id'));

    let result = 0;

    if (aID) {
      if (aID > bID) {
        result = 1;
      } else if (aID < bID) {
        result = -1;
      }
    } else {
      result = 1;
    }

    return result;
  });
}
