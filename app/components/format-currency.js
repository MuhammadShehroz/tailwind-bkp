import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly, equal, or, reads } from '@ember/object/computed';
import Component from '@ember/component';
import delegate from 'frontend/lib/delegate';

const delegations = delegate(readOnly, 'organization', [
  'decimals',
  'decimalsSeparator',
  'thousandsSeparator'
]);

export default Component.extend(delegations, {
  currencies: service(),
  organizationService: service('organization'),
  organization: reads('organizationService.current'),

  tagName: 'span',
  classNames: ['currency'],

  symbol: computed('isoCode', 'currencies.all', function () {
    return this.currencies.symbol(this.isoCode);
  }).readOnly(),

  currency: computed('code', 'isoCode', 'symbol', 'symbolFormat', function () {
    if (this.symbolFormat) {
      return this.symbol;
    }

    return this.isoCode;
  }),

  symbolFirstFormat: equal('organization.currencyFormat', 'symbol_first'),
  symbolFirstSpaceFormat: equal(
    'organization.currencyFormat',
    'symbol_first_space'
  ),

  symbolLastFormat: equal('organization.currencyFormat', 'symbol_last'),
  symbolLastSpaceFormat: equal(
    'organization.currencyFormat',
    'symbol_last_space'
  ),

  symbolFirst: or('symbolFirstFormat', 'symbolFirstSpaceFormat'),
  symbolLast: or('symbolLastFormat', 'symbolLastSpaceFormat'),
  symbolFormat: or('symbolFirst', 'symbolLast'),

  codeFirstFormat: equal('organization.currencyFormat', 'code_first'),
  codeFirstSpaceFormat: equal(
    'organization.currencyFormat',
    'code_first_space'
  ),

  codeLastFormat: equal('organization.currencyFormat', 'code_last'),
  codeLastSpaceFormat: equal('organization.currencyFormat', 'code_last_space'),
  codeFirst: or('codeFirstFormat', 'codeFirstSpaceFormat'),
  codeLast: or('codeLastFormat', 'codeLastSpaceFormat'),

  currencyFirst: or('symbolFirst', 'codeFirst'),
  currencyLast: or('symbolLast', 'codeLast'),
  spaceBefore: or('symbolFirstSpaceFormat', 'codeFirstSpaceFormat'),
  spaceAfter: or('symbolLastSpaceFormat', 'codeLastSpaceFormat')
});
