import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  queryParams: ['organizationId', 'organizationName', 'token', 'coupon'],
  organization: service(),
  subscription: service(),

  validateParams() {
    if (this.organizationId !== this.organization.organizationId) {
      this.transitionToRoute('accounts');

      this.flashMessages.add({
        title: 'Wrong organization',
        message: `Please login to ${this.organizationName} organization and retry clicking link`,
        type: 'error'
      });
    } else {
      this.store.query('subscription', {}).then((result) => {
        if (result.firstObject) {
          this.organization.current.subscription.then((subscription) => {
            subscription
              .activateCoupons(this.token, this.coupon)
              .then(() => {
                this.flashMessages.success(
                  'You can now apply coupon to your subscription'
                );
                this.transitionToRoute('account.subscription');
              })
              .catch((data) => {
                this.flashMessages.add({
                  type: 'error',
                  isInline: this.isEmbedded,
                  message: data.errors.firstObject.detail
                });

                this.transitionToRoute('/');
              });
          });
        }
      });
    }
  }
});
