import EmberObject from '@ember/object';
import { copy } from 'ember-copy';

export const filterParams = [
  'after',
  'before',
  'clientId',
  'nameOfClient',
  'currency',
  'status'
];

const Filters = EmberObject.extend({
  init() {
    this._super(...arguments);
    let properties = this.source.getProperties(filterParams);
    properties.status = copy(properties.status);
    this.setProperties(properties);
  },

  copy() {
    return Filters.create({ source: this.source });
  },

  expand() {
    return this.getProperties(filterParams);
  }
});

export default Filters;
