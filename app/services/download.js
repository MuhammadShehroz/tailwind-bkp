import Service, { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  create(id, modelType, options = {}) {
    return this.store
      .createRecord('download', {
        name: 'pdf',
        model_id: id, // eslint-disable-line camelcase
        model_type: modelType, // eslint-disable-line camelcase
        options
      })
      .save();
  },

  open(id, modelType, options) {
    this.create(id, modelType, options).then((download) => {
      let url = download.get('url');
      location.replace(url);
    });
  }
});
