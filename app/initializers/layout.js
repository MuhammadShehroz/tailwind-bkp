import { getOwner } from '@ember/application';
import { on } from '@ember/object/evented';
import Route from '@ember/routing/route';

export function initialize() {
  Route.reopen({
    injectLayout: on('activate', function () {
      let applicationInstance = getOwner(this);
      let applicationController = applicationInstance.lookup(
        'controller:application'
      );
      let layoutName = this.layout;

      applicationController.set('layoutName', layoutName);
      window.scrollTo(0, 0);
    })
  });
}

export default {
  initialize
};
