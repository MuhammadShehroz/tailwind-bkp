import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('clients', function () {
    this.route('edit', { path: ':client_id/edit' });
    this.route('new');
    this.route('show', { path: ':client_id' });
    this.route('preferences', { path: ':client_id/preferences' });
  });

  this.route('contacts', function () {
    this.route('new', { path: ':client_id/new' });
    this.route('edit', { path: ':contact_id/edit' });
  });

  this.route('invoices', function () {
    this.route('edit', { path: ':id/edit' });
    this.route('new');
    this.route('show', { path: ':id' });
    this.route('preview', { path: ':id/preview' });
    this.route('payments');
    this.route('settings');
  });

  this.route('invoice-templates', function () {
    this.route('edit', { path: ':id/edit' });
    this.route('new');
    this.route('show', { path: ':id' });
  });

  this.route('estimates', function () {
    this.route('edit', { path: ':id/edit' });
    this.route('new');
    this.route('show', { path: ':id' });
    this.route('preview', { path: ':id/preview' });
  });

  this.route('paypal-payment');

  this.route('account', function () {
    this.route('subscription');
    this.route('preferences');
    this.route('user-profile', function () {
      this.route('delete');
      this.route('delete-membership');
    });
    this.route('saved-items');
    this.route('taxes');
    this.route('units-of-measurement');
    this.route('payment-methods');
    this.route('templates');
    this.route('members-permissions');
    this.route('notifications');
    this.route('notification-settings');
    this.route('profile', function () {
      this.route('delete');
    });
    this.route('email-settings');
  });

  this.route('accounts', function () {
    this.route('new');
  });

  this.route('portal', { path: 'p' }, function () {
    this.route('estimate', { path: 'estimate/:id' });
    this.route('invoice', { path: 'invoice/:id' });
  });

  this.route('login');
  this.route('signup');
  this.route('invitation-signup');
  this.route('confirm-email', { path: 'confirm-email/:token' });
  this.route('forgot-password');
  this.route('reset-password');
  this.route('impersonate');
  this.route('user-profile');
  this.route('activate-coupon');

  this.route('error-404', { path: '*path' });
  this.route('error-500');
  this.route('error-payment-required', { path: 'trial-ended' });
  this.route('contact-us');
  this.route('test');
});

export default Router;
