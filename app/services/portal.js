import Service from '@ember/service';
import { notEmpty } from '@ember/object/computed';

const emptyState = {
  token: null,
  documentId: null,
  documentType: null,
  organization: null
};

export default Service.extend(emptyState, {
  isActive: notEmpty('token'),

  setCredentials(token, documentId, documentType) {
    this.setProperties({ token, documentId, documentType });
  },

  reset() {
    this.setProperties(emptyState);
  }
});
