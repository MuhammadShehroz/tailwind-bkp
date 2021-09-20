import Mixin from '@ember/object/mixin';
import { schedule } from '@ember/runloop';
import { scrollToErrorField } from 'frontend/utils/scroller';

export default Mixin.create({
  validateAndSave(model) {
    return model.validate().then(({ validations }) => {
      if (validations.get('isValid')) {
        this.save(model);
      } else {
        this.handleValidationError(validations);
      }
    });
  },

  validateAndSaveModel() {
    return this.validateAndSave(this.model);
  },

  getValidationErrorMessage(/* validations */) {
    return 'The form is missing required data.';
  },

  getValidationErrorTitle() {
    return 'Form validation error';
  },

  handleValidationError(validations) {
    this.flashMessages.clearMessages();
    this.flashMessages.add({
      type: 'error',
      title: this.getValidationErrorTitle(),
      message: this.getValidationErrorMessage(validations)
    });
    schedule('afterRender', scrollToErrorField);
  }
});
