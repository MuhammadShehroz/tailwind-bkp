import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';

export default class FormElementsControlComponent extends Component {
  @tracked fieldId;

  hasBottomBorder = true;

  constructor() {
    super(...arguments);
    this.fieldId = guidFor(this);
  }
}
