import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import SignupValidations from 'frontend/validations/signup';

import { inject as service } from '@ember/service';

export default Model.extend(SignupValidations, {
  planService: service('plan'),

  // user fields
  firstName: attr('string', { defaultValue: '' }),
  lastName: attr('string', { defaultValue: '' }),
  email: attr('string', { defaultValue: '' }),
  password: attr('string', { defaultValue: '' }),

  // organization fields
  name: attr(),

  // subscription fields
  planId: attr({ defaultValue: 'bspro_anually' }),
  cardToken: attr(),

  validationsEnabled: false,

  isAnnually: computed('planId', {
    get() {
      return this.planId === this.planService.anuallyPlanKey();
    },

    set(key, value) {
      if (value === true) {
        this.set('planId', this.planService.anuallyPlanKey());
      } else {
        this.set('planId', this.planService.monthlyPlanKey());
      }

      return value;
    }
  })
});
