import EmberObject, { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default EmberObject.extend({
  entity: null,
  name: alias('entity.name'),
  percent: alias('entity.percent'),
  id: alias('entity.id'),

  nameAndPercent: computed('name', 'percent', function () {
    return this.name && this.percent ? `${this.name} (${this.percent}%)` : null;
  })
});
