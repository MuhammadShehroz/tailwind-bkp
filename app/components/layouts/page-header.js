import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

const NAME = 'header';

export default Component.extend({
  classNames: ['page-header'],
  classNameBindings: [
    'resourceTypeModifier',
    'pageTypeModifier',
    'hasOrganizationLogo:has-organization-logo'
  ],

  attributeBindings: ['_style:style'],

  resourceTypeModifier: computed('resourceType', function () {
    return `${this.resourceType}-${NAME}`;
  }),

  pageTypeModifier: computed('pageType', function () {
    return `${this.pageType}-${NAME}`;
  }),

  _style: computed('headerColor', function () {
    return this.headerColor
      ? htmlSafe(`background-color: ${this.headerColor}`)
      : null;
  })
});
