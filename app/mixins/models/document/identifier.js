import Mixin from '@ember/object/mixin';
import { isBlank } from '@ember/utils';
import { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Mixin.create({
  prefix: attr(),
  number: attr('number'),
  legacyIdentifier: attr(),

  identifier: computed(
    'hasLegacyIdentifier',
    'legacyIdentifier',
    'number',
    'prefix',
    function () {
      if (this.hasLegacyIdentifier) {
        return this.legacyIdentifier;
      }

      return [this.prefix, this.number].filter((v) => !isBlank(v)).join('');
    }
  ),

  hasLegacyIdentifier: computed('legacyIdentifier', function () {
    return !isBlank(this.legacyIdentifier);
  })
});
