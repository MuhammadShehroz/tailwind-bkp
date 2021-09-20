import Mixin from '@ember/object/mixin';

export default Mixin.create({
  classNames: ['select-field'],
  classNameBindings: ['isOpen:focused-field'],

  allowClear: false,
  renderInPlace: false,
  searchPlaceholder: 'Search...',
  isOpen: false,

  onOpen() {
    this.set('isOpen', true);
  },

  onClose() {
    this.set('isOpen', false);
  },

  actions: {
    openDropdown() {
      let dropdownOpened = document.querySelector(
        '.ember-power-select-dropdown'
      );

      if (dropdownOpened) {
        dropdownOpened.style.display = 'none';
      } else {
        let dropdownSelectorClass = `#${this.elementId} .input-wrapper .ember-basic-dropdown-trigger`;

        document
          .querySelector(dropdownSelectorClass)
          .dispatchEvent(new MouseEvent('mousedown'));
      }
    }
  }
});
