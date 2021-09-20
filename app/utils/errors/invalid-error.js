export default class InvalidError extends Error {
  name = 'Invalid Document Error';

  message;

  constructor(error) {
    super();
    this.message = this._message(error);
  }

  _message(error) {
    return error.errors.map((item) => item.detail).join('<br/>');
  }
}
