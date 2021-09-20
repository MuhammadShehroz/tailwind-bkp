import Component from '@glimmer/component';
import { action } from '@ember/object';

const asc = 'asc';
const desc = 'desc';

export default class SortByComponent extends Component {
  defaultOrder = this.args.defaultOrder || asc;

  field = this.args.field;

  sort = this.args.sort;

  order = this.args.order;

  isCurrentField = this.args.sort === this.args.field;

  toggleOrder() {
    if (this.args.order === asc) {
      this.order = desc;
    } else {
      this.order = asc;
    }
  }

  get sortOrder() {
    return this.isCurrentField && this.order;
  }

  @action
  sortUpdate() {
    if (this.isCurrentField) {
      this.toggleOrder();
    } else {
      this.sort = this.field;
      this.order = this.defaultOrder;
    }

    this.args.onSortChange(this.field, this.order);
  }
}
