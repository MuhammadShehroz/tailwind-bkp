import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  titleToken: 'Subscriptions',

  model() {
    return this.store.query('subscription', {}).then((result) => {
      if (result.firstObject) {
        return this.organization.current?.get('subscription');
      } else {
        return this.store.createRecord('subscription');
      }
    });
  }
});
