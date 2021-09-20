import Mixin from '@ember/object/mixin';
import { rollbackRelationship } from 'frontend/utils/rollback-relationship';

export default Mixin.create({
  titleToken: null,

  model(params) {
    return this.store.find(this.modelName, params.id);
  },

  deactivate() {
    let model = this.modelFor(this.routeName);
    model.rollbackAttributes();
    rollbackRelationship(model, 'lineItems');
  },

  createTax() {
    return this.store.createRecord('tax');
  },

  createUnit() {
    return this.store.createRecord('unit-of-measurement');
  },

  fetchUnits() {
    return this.store.findAll('unit-of-measurement');
  }
});
