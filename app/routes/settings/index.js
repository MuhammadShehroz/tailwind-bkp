import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  redirect() {
    this.transitionTo('settings.organization');
  }
});
