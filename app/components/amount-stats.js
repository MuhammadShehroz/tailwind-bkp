import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNames: ['invoice-stats'],
  classNameBindings: ['className'],

  organization: service(),

  organizationCurrency: readOnly('organization.current.currency'),
  placeholderCurrency: 'USD',

  placeHolderStats: computed('showPlaceholderStats', function () {
    let {
      showPlaceholderStats,
      organizationCurrency,
      placeholderCurrency,
      model
    } = this;
    if (showPlaceholderStats && !model?.length) {
      return [
        {
          currency: organizationCurrency || placeholderCurrency
        }
      ];
    }

    return null;
  })
});
