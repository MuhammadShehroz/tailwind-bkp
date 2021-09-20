import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { isPresent } from '@ember/utils';

export default Mixin.create({
  loader: service(),

  actions: {
    startLoading(message) {
      let { loader } = this;
      loader.startLoading(message);

      if (isPresent(this._router)) {
        this._router.one('didTransition', function () {
          loader.endLoading();
        });
      }
    },

    endLoading() {
      this.loader.endLoading();
    }
  }
});
