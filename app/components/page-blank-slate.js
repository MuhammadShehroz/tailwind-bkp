import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['className'],

  newLink: computed('className', function () {
    return `${this.className}s.new`;
  })
});
