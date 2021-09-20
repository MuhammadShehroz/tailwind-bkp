import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { capitalize } from '@ember/string';

export default Mixin.create({
  layout: 'portal',

  portal: service(),
  organization: service(),

  modelName: null,

  titleToken(model) {
    let id = model.get('identifier');
    let name = capitalize(this.modelName);
    return model
      .get('client')
      .then((client) => `${name} ${id} from ${client.get('name')}`);
  },

  model(params) {
    let { portal } = this;
    let { token, id } = params;

    portal.setCredentials(token, id, this.modelName);
    return this.store.findRecord(this.modelName, id);
  },

  afterModel(model) {
    return this.organization.setCurrent(model.organization.get('id'));
  },

  deactivate() {
    this.portal.reset();
  }
});
