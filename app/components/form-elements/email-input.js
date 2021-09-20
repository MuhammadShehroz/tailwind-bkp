import TextInput from 'frontend/components/form-elements/text-input';

export default TextInput.extend({
  tagName: '',
  type: 'email',

  transform() {
    return (value) => value.trim();
  }
});
