import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import DeleteActions from 'frontend/mixins/routes/delete-actions';

export default AuthenticatedRoute.extend(DeleteActions, {
  titleToken: 'Unit of measurement',

  routeAfterDelete: 'settings.units-of-measurement',

  model() {
    return this.store.query('unit-of-measurement', {});
  }
});
