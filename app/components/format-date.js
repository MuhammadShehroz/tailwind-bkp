import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const { dateFormats } = window.BSN.organization;

export default Component.extend({
  tagName: 'span',
  classNames: ['date'],
  dateFormats,

  organizationService: service('organization'),
  organization: readOnly('organizationService.current'),
  jsDateFormat: readOnly('organization.jsDateFormat'),

  dateFormat: computed('jsDateFormat', function () {
    return this.jsDateFormat || dateFormats.d_mmm_yyyy.js_format;
  }).readOnly()
});
