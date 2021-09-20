import AuthenticatedRoute from './authenticated-route';

export default AuthenticatedRoute.extend({
  titleToken: 'Dashboard',

  model() {
    return this.store.findAll('amount-stat');
  },

  deactivate() {
    this.store.unloadAll('amount-stat');
  }
});
