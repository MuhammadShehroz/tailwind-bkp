import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  terms: service(),
  netTerms: computed('model.netTerms', function () {
    let { netTerms } = this.model;
    return this.terms.findRecurringTermByType(netTerms).dropdownLabel;
  })
});
