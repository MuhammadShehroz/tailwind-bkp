import Component from '@ember/component';
import ResourceActions from 'frontend/mixins/components/resource-actions';
import { alias } from '@ember/object/computed';

export default Component.extend(ResourceActions, {
  tagName: 'form',
  showActions: true,
  validations: alias('model.validations.attrs'),

  didInsertElement() {
    this._super(...arguments);

    this.model.setProperties({
      password: '',
      currentPassword: '',
      skipPasswordValidation: false
    });

    this.set('validationsEnabled', false);
  }
});
