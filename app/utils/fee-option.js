import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  label: '',
  lateFee: null,
  hasLateFee: false,
  lateFeeKind: '',
  lateFeeInterval: '',
  otherPercentage: false,

  type: computed('lateFeeKind', 'otherPercentage', 'hasLateFee', function () {
    if (
      this.lateFeeKind === 'fixed' ||
      (this.lateFeeKind === 'percent' && this.otherPercentage === true)
    ) {
      return 'custom';
    } else return 'default';
  })
});
