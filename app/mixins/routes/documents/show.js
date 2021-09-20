import Mixin from '@ember/object/mixin';

export default Mixin.create({
  titleToken: null,
  modelName: null,
  showSend: null,

  model(params) {
    return this.store.find(this.modelName, params.id);
  }
});
