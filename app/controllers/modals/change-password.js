import Controller from '@ember/controller';
import ModalController from 'frontend/mixins/controllers/modal';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend(ModalController, {
  resetPassword: service(),
  validations: alias('model.validations.attrs'),

  actions: {
    cancel() {
      this.model.rollbackAttributes();
      this.model.set('skipPasswordValidation', true);
      this.close();
    },

    save() {
      let user = this.model;

      if (user.password && user.currentPassword !== user.password) {
        return user.validate().then(({ validations }) => {
          if (validations.get('isValid')) {
            this.resetPassword
              .updatePassword(user)
              .then(() => {
                this.flashMessages.success('Your password has been updated.');
                this.user.rollbackAttributes();
                this.user.set('skipPasswordValidation', true);
                this.close();
              })
              .catch((data) => {
                user.errors.add('currentPassword', data.payload);
              });
          }
        });
      } else {
        let message = user.password
          ? "Can't use same password"
          : "Can't be blank";
        this.flashMessages.add({
          message,
          type: 'error'
        });
      }
    }
  }
});
