import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'form',
  elementId: 'receive-payment',
  model: null,
  organization: service(),
  currentOrganization: reads('organization.current'),

  didReceiveAttrs() {
    let model = this.invoice.buildPayment({
      date: moment().toDate()
    });

    this.rollbackPayment();

    this.setProperties({ model });
  },

  paymentMethodOptions: computed(function () {
    return [
      { id: 'Check', name: 'Check' },
      { id: 'Paypal', name: 'Paypal' },
      { id: 'Cash', name: 'Cash' },
      { id: 'Wire', name: 'Wire' },
      { id: 'Stripe', name: 'Stripe' },
      { id: 'Credit Card', name: 'Credit Card' },
      { id: 'Other', name: 'Other' }
    ];
  }),

  rollbackPayment() {
    let { model } = this;

    if (model) {
      model.rollbackAttributes();
      this.set('model', null);
    }
  },

  actions: {
    cancel() {
      this.cancel();
    },

    save() {
      let { model } = this;
      this.set('validationsEnabled', true);

      model.validate().then(({ validations }) => {
        if (validations.isValid) {
          this.accept(model);
        }
      });
    }
  }
}).reopenClass({
  positionalParams: ['invoice']
});
