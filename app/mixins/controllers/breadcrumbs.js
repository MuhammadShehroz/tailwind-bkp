import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

function parents(route) {
  return route.parent.name === 'application'
    ? [route]
    : [...parents(route.parent), route];
}

export default Mixin.create({
  router: service(),

  routeSegments: computed(
    'router.{currentRoute,currentRoute.name}',
    function () {
      let activeRoutes = parents(this.router.currentRoute);
      return activeRoutes.map((route) => ({
        label: route.metadata?.label || route.localName,
        route: route.name,
        isCurrent: this.router.currentRoute.name === route.name
      }));
    }
  )
});
