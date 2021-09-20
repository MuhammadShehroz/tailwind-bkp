import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  hours: computed(function () {
    return [
      { key: '01', label: '01' },
      { key: '02', label: '02' },
      { key: '03', label: '03' },
      { key: '04', label: '04' },
      { key: '05', label: '05' },
      { key: '06', label: '06' },
      { key: '07', label: '07' },
      { key: '08', label: '08' },
      { key: '09', label: '09' },
      { key: '10', label: '10' },
      { key: '11', label: '11' },
      { key: '12', label: '12' }
    ];
  }),

  minutes: computed(function () {
    return [
      { key: '00', label: '00' },
      { key: '15', label: '15' },
      { key: '30', label: '30' },
      { key: '45', label: '45' }
    ];
  }),

  meridians: computed(function () {
    return [
      { key: 'AM', label: 'AM' },
      { key: 'PM', label: 'PM' }
    ];
  }),

  actions: {
    setValue() {
      this.set('value', `${this.hour}:${this.minute} ${this.meridian}`);
    }
  }
});
