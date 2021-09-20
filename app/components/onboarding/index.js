import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  stepIndex: 0,

  selectedSegmentIndex: computed('client.isCompany', function () {
    return this.client.isCompany ? 0 : 1;
  }).readOnly(),

  init() {
    this._super(...arguments);
    this.segments = ['Company', 'Individual'];
    this.client.set('isCompany', true);
  },

  actions: {
    setClientType(index) {
      this.client.set('isCompany', index === 0);
    },

    linkTo(route) {
      let params = [route];
      if (route === 'clients.edit') params.push(this.client);
      else if (['invoices.new', 'estimates.new'].includes(route))
        params.push({ queryParams: { client: this.client.id } });
      this.onLinkTo(...params);
    }
  }
});
