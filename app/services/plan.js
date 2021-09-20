import Service from '@ember/service';

const PLANS = window.BSN.subscription.plans;

export default Service.extend({
  monthlyPlanKey() {
    for (let planKey in PLANS) {
      if (PLANS[planKey].interval === 'month') {
        return planKey;
      }
    }
  },

  monthlyPlan() {
    for (let planKey in PLANS) {
      if (PLANS[planKey].interval === 'month') {
        return PLANS[planKey];
      }
    }
  },

  getPlan(planKey) {
    return PLANS[planKey];
  },

  anuallyPlanKey() {
    for (let planKey in PLANS) {
      if (PLANS[planKey].interval === 'year') {
        return planKey;
      }
    }
  },

  anuallyPlan() {
    for (let planKey in PLANS) {
      if (PLANS[planKey].interval === 'year') {
        return PLANS[planKey];
      }
    }
  },

  gtmPlan(planId) {
    return planId === 'bspro_monthly' ? 'monthly' : 'annual';
  }
});
