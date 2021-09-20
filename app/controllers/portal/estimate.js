import Controller from '@ember/controller';
import DocumentController from 'frontend/mixins/controllers/portal/document';
import DocumentShowComponent from 'frontend/mixins/components/document-show';

export default Controller.extend(DocumentController, DocumentShowComponent, {
  isCommentFormExpanded: false,

  approve() {
    this.model.approve().then(() => {
      this.model.reload();
      this.reloadEvents();
      this.flashMessages.success('Estimate approved.');
    });
  },

  decline() {
    this.model.decline().then(() => {
      this.model.reload();
      this.reloadEvents();
      this.flashMessages.success('Estimate declined.');
    });
  },

  actions: {
    approve() {
      this.approve();
    },

    decline() {
      this.decline();
    },

    changeStatus() {
      if (this.model.statusSymbol === 'approved') {
        this.decline();
      } else {
        this.approve();
      }
    },

    newComment() {
      return this.newComment();
    }
  }
});
