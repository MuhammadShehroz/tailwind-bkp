import TextInput from 'frontend/components/form-elements/text-input';

export default TextInput.extend({
  tagName: '',
  type: 'password',

  actions: {
    togglePassword() {
      this.type === 'password'
        ? this.set('type', 'text')
        : this.set('type', 'password');
    }
  }
});
