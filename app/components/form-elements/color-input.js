import TextInput from 'frontend/components/form-elements/text-input';

export default TextInput.extend({
  onColorChange: () => {},

  actions: {
    changeColor(event) {
      event.stopPropagation();
      this.set('value', event.target.value);
      this.onColorChange(event.target.value);
    }
  }
});
