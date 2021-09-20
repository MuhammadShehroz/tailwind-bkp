import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PagesContactUsComponent extends Component {
  @service user;

  @service organization;

  @tracked orgName;

  @tracked userEmail;

  constructor() {
    super(...arguments);
    this.setEmailProps();
  }

  async setEmailProps() {
    let user = await this.user.current;
    let org = await this.organization.current;
    this.userEmail = user.email;
    this.orgName = org.name;
  }
}
