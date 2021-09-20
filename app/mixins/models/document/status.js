import Mixin from '@ember/object/mixin';
import { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

import { dasherize } from '@ember/string';

export default Mixin.create({
  statusSymbol: attr(),
  draft: attr('boolean'),
  documentStatus: service(),

  isDraft: equal('statusSymbol', 'draft'),
  isOpen: equal('statusSymbol', 'open'),

  statusLabel: computed('statusSymbol', function () {
    return this.documentStatus.statusLabel(this.statusSymbol);
  }),

  statusClass: computed('statusLabel', function () {
    return dasherize(this.statusLabel);
  }),

  makeOpen() {
    this.set('draft', false);
    return this.save();
  }
});
