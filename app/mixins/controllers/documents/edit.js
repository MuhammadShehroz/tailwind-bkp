import Mixin from '@ember/object/mixin';
import { pluralize } from 'ember-inflector';

export default Mixin.create({
  actions: {
    cancel() {
      this.transitionToRoute(
        `${pluralize(this.model.modelName)}.show`,
        this.model
      );
    }
  }
});
