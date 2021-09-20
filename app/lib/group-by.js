import { A } from '@ember/array';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';

export default function groupBy(collection, property) {
  let dependentKey = `${collection}.@each.${property}`;

  return computed(dependentKey, function () {
    let groups = A();
    let items = get(this, collection); // eslint-disable-line ember/no-get

    if (items) {
      items.forEach(function (item) {
        let value = get(item, property); // eslint-disable-line ember/no-get
        let group = groups.findBy('value', value);

        if (isPresent(group)) {
          get(group, 'items').push(item); // eslint-disable-line ember/no-get
        } else {
          group = { property, value, items: [item] };
          groups.push(group);
        }
      });
    }

    return groups;
  }).readOnly();
}
