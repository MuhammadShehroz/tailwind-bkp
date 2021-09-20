import Service from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {
  startLoading(message) {
    this.trigger('startLoading', message);
  },

  endLoading() {
    this.trigger('endLoading');
  }
});
