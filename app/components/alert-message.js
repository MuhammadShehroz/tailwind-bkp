import Component from '@glimmer/component';

export default class AlertMessage extends Component {
  get hasAction() {
    return this.args.alertLabel && this.args.alertAction;
  }
}
