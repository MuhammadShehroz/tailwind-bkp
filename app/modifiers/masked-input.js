import Modifier from 'ember-modifier';
import IMask from 'imask';
import { next } from '@ember/runloop';

export default class ImaskNumber extends Modifier {
  mask;

  get value() {
    return this.args.named.value || 0;
  }

  onChangeHandler = () => {
    if (this.mask && this.mask.unmaskedValue !== this.value) {
      this.args.named.onChange(this.mask.typedValue);
    }
  };

  didUpdateArguments() {
    if (
      this.mask &&
      this.mask.masked.padFractionalZeros !==
        this.args.named.options.padFractionalZeros
    ) {
      next(this, function () {
        this.mask.el.select(0, this.mask.value.length);
      });
    }

    if (this.mask) {
      this.mask.unmaskedValue = this.value.toString();
    }

    this.mask.updateOptions(this.args.named.options);
  }

  didInstall() {
    this.mask = new IMask(this.element, this.args.named.options);
    this.mask.unmaskedValue = this.value.toString();
    this.mask.on('complete', this.onChangeHandler);
  }

  willRemove() {
    if (this.mask) {
      this.mask.off('complete', this.onChangeHandler);
      this.mask.destroy();
    }
  }
}
