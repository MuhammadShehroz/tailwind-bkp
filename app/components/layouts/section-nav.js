import Component from '@glimmer/component';

export default class SectionNav extends Component {
  invoices = this.args.resourceType === 'invoice';
}
