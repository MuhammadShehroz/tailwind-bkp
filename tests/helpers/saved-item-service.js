import SavedItem from 'frontend/services/saved-item';
import EmberObject from '@ember/object';

export default function (values) {
  return SavedItem.extend({
    savedItems(params) {
      let items = [];

      values.forEach((value) => {
        if (value.currency === params.currency || params.currency === '') {
          items.pushObject(EmberObject.create(value));
        }
      });

      return items;
    }
  });
}
