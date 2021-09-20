import Clients from 'frontend/services/clients';
import EmberObject from '@ember/object';
import { resolve } from 'rsvp';

export default function (values) {
  return Clients.extend({
    init() {
      this._super(...arguments);
      this.set(
        '_values',
        values.map((value) => EmberObject.create(value))
      );
    },

    query() {
      return this._values;
    },

    fetch(id) {
      return resolve(this._fetch(id));
    },

    _fetch(id) {
      return this._values.findBy('id', id);
    },

    contacts(clientId) {
      let contacts = this._fetch(clientId).contacts.map((c) =>
        EmberObject.create(c)
      );
      return resolve(contacts);
    }
  });
}
