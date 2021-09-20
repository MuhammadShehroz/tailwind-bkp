import TextInput from 'frontend/components/form-elements/text-input';

export default TextInput.extend({
  tagName: '',
  type: 'number',

  transform() {
    return (value) => Number(value);
  }
});
