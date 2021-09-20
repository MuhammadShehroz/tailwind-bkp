import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import { computed } from '@ember/object';

export default Service.extend(Evented, {
  store: service(),
  organization: service(),

  current: computed('organization.current.subscription', function () {
    return this.store.query('subscription', {}).then((result) => {
      if (result.firstObject) {
        return this.organization.current?.subscription;
      } else {
        return this.store.createRecord('subscription');
      }
    });
  })
});
