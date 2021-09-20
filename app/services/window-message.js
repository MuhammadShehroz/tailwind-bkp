import Service from '@ember/service';

export default class PostMessageService extends Service {
  _listeners = new Set();

  get listeners() {
    return [...this._listeners.values()];
  }

  registerListener(callback, condition) {
    let listener = { callback, condition };
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  onMessage(message) {
    this.listeners.forEach(({ callback, condition }) => {
      let pass = false;
      switch (typeof condition) {
        case 'undefined':
          pass = true;
          break;
        case 'string':
          pass = message.type === condition;
          break;
        case 'function':
          pass = condition(message.type, message);
          break;
        case 'object':
          pass = message.type.match(condition);
          break;
        default:
          pass = false;
      }

      if (pass) callback(message);
    });
  }

  postMessage(message, targetUrl, target) {
    target = target || window.parent; // default to parent
    target.postMessage(message, targetUrl);
  }
}
