import { A } from '@ember/array';
import EmberObject from '@ember/object';

const ALL_CLIENTS_ENTRY = EmberObject.create({
  name: 'All Clients',
  value: null
});

export default EmberObject.extend({
  init() {
    this._super(...arguments);
    let _clients = A();
    _clients.pushObject(ALL_CLIENTS_ENTRY);
    this.set('clients', _clients.pushObjects(this.clients));
  }
});
