import Mixin from '@ember/object/mixin';
import { typeOf } from '@ember/utils';

export default Mixin.create({
  routeAfterSave: 'index',

  deactivate() {
    this.modelFor(this.routeName).rollbackAttributes();
  },

  _routeAfterSave(model) {
    let { routeAfterSave } = this;

    if (typeOf(routeAfterSave) === 'function') {
      return routeAfterSave(model);
    }

    return [routeAfterSave];
  },

  actions: {
    save(model) {
      model
        .save()
        .then(() =>
          this.transitionTo(
            ...this._routeAfterSave(this.modelFor(this.routeName))
          )
        );
    },

    cancel() {
      this.transitionTo(...this._routeAfterSave(this.modelFor(this.routeName)));
    }
  }
});
