import Service, { inject as service } from '@ember/service';

export default class StorageService extends Service {
  @service router;

  removeSessionItem(key, routeName) {
    return window.sessionStorage.removeItem(this.keyFor(key, routeName));
  }

  getSessionItem(key, routeName) {
    return window.sessionStorage.getItem(this.keyFor(key, routeName));
  }

  setSessionItem(key, routeName, value) {
    return window.sessionStorage.setItem(this.keyFor(key, routeName), value);
  }

  keyFor(key, routeName) {
    routeName = routeName || this.router.currentRouteName;
    return `${routeName}__${key}`;
  }
}
