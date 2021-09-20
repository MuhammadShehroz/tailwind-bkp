import Component from '@ember/component';

export default Component.extend({
  classNames: ['segmented-control'],
  classNameBindings: ['isDisabled:disabled']
});
