import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class BsDropZoneComponent extends Component {
  @action
  drop(event) {
    this.preventEvent(event);
    let files = Array.from(event.dataTransfer.files);
    if (this.args.accept)
      files = files.filter((file) => this.args.accept.includes(file.type));
    this.args.onDropFiles(files);
  }

  @action
  preventEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
