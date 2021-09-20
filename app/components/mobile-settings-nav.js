import Component from '@ember/component';

export default Component.extend({
  showMobileNav: false,
  actions: {
    toggleMenu() {
      this.set('showMobileNav', !this.showMobileNav);
    }
  }
});
