import Controller from '@ember/controller';
import FormBase from 'frontend/mixins/form-base';

export default Controller.extend(FormBase, {
  message: 'Notification settings saved successfully.'
});
