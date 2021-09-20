import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNames: ['avatar-placeholder'],
  classNameBindings: ['url:image:no-image'],
  attributeBindings: ['_style:style'],

  _style: computed('url', function () {
    return this.url ? htmlSafe(`background-image: url(${this.url})`) : null;
  })
});
