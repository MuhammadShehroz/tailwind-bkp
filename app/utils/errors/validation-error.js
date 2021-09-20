export default class ValidationError extends Error {
  name = 'Validation Error';

  message;

  constructor(error) {
    super();
    this.message = this._message(error);
  }

  _message(error) {
    return error.map((item) => item.message).join('<br/>');
  }
}
