import Component from '@ember/component';
import { computed } from '@ember/object';
import { formatInternational } from 'frontend/components/format-number';
import { inject as service } from '@ember/service';

const padZero = (num) => {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
};

const monthsList = () => {
  return Array(12)
    .fill(0)
    .map((_, i) => `${padZero(i + 1)}`);
};

const getPaidSum = (data, currency, month, year) => {
  let found = data?.find(
    (obj) =>
      obj.currency === currency &&
      obj.month === `${month}-${year}` &&
      obj.paid === true
  );
  if (found) {
    return parseInt(found.total);
  } else {
    return 0;
  }
};

const getUnpaidSum = (data, currency, month, year) => {
  let found = data?.find(
    (obj) =>
      obj.currency === currency &&
      obj.month === `${month}-${year}` &&
      obj.paid === false
  );
  if (found) {
    return parseInt(found.total);
  } else {
    return 0;
  }
};

Date.prototype.getMonthName = function () {
  let monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  return monthNames[this.getMonth()];
};

export default Component.extend({
  currencies: service(),
  chartData: computed('graph', 'currency', 'stat.currency', function () {
    let today = new Date();
    let year = today.getFullYear();
    let months = monthsList();
    let open = months.map((month) =>
      getUnpaidSum(this.graph, this.stat.currency, month, year)
    );
    let closed = months.map((month) =>
      getPaidSum(this.graph, this.stat.currency, month, year)
    );

    return [
      {
        name: 'Open',
        data: open,
        color: '#34D399'
      },
      {
        name: 'Closed',
        data: closed,
        color: '#059669'
      }
    ];
  }),

  chartOptions: computed(
    'decimals',
    'decimalsSeparator',
    'stat.currency',
    'currencies',
    'thousandsSeparator',
    'value',
    'y',
    function () {
      let context = this;
      return {
        chart: {
          type: 'column',
          height: 240,
          style: {
            fontFamily: 'Inter, sans-serif'
          }
        },

        title: {
          text: null
        },

        tooltip: {
          valuePrefix: this.stat.currency,
          formatter() {
            return `${context.currencies.symbol(
              context.stat.currency
            )}${formatInternational(
              this.y,
              context.decimals,
              context.decimalsSeparator,
              context.thousandsSeparator
            )}`;
          }
        },

        plotOptions: {
          column: {
            stacking: 'normal',
            pointPadding: 0,
            groupPadding: 0
          }
        },

        legend: { align: 'left', verticalAlign: 'top' },

        xAxis: {
          title: {
            text: null
          },

          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'June',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ]
        },

        yAxis: {
          min: 0,
          title: {
            text: null
          },

          labels: {
            formatter() {
              return `$${this.value}`;
            }
          }
        }
      };
    }
  )
});
