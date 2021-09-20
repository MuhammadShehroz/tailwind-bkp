import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  setupController(controller, model) {
    this._super(controller, model);

    controller.validateParams();
  }
});
