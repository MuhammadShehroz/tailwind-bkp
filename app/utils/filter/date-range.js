import moment from 'moment';

const RANGES = ['month', 'quarter', 'year', 'all'];
const DATE_FORMAT = 'YYYY-MM-DD';

export default class DateRange {
  constructor() {
    this.ranges = [
      { value: 'all', label: 'All Time' },
      { value: 'month', label: 'Month' },
      { value: 'quarter', label: 'Quarter' },
      { value: 'year', label: 'Year' }
    ];
  }

  before(range) {
    if (!RANGES.includes(range)) {
      return moment().endOf('year').format(DATE_FORMAT);
    }

    if (range === 'all') {
      return moment().endOf('year').format(DATE_FORMAT);
    }

    return moment().endOf(range).format(DATE_FORMAT);
  }

  after(range) {
    if (!RANGES.includes(range)) {
      return moment().startOf('year').format(DATE_FORMAT);
    }

    if (range === 'all') {
      return moment().subtract(50, 'years').endOf('year').format(DATE_FORMAT);
    }

    return moment().startOf(range).format(DATE_FORMAT);
  }

  _range(start, end) {
    return RANGES.find(
      (range) => this.after(range) === start && this.before(range) === end
    );
  }

  range(start, end) {
    return (
      this.ranges.find((range) => range.value === this._range(start, end)) ||
      this.ranges[0]
    );
  }
}
