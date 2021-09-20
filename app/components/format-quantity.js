import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import delegate from 'frontend/lib/delegate';

const delegations = delegate(reads, 'organization', [
  'quantityDecimals',
  'decimalsSeparator',
  'thousandsSeparator'
]);

export default Component.extend(delegations, {
  organizationService: service('organization'),
  organization: reads('organizationService.current'),

  tagName: 'span',
  classNames: ['quantity']
});
