import { module, test } from 'qunit';
import DateRange from 'frontend/utils/filter/date-range';
import moment from 'moment';
const DATE_FORMAT = 'YYYY-MM-DD';

module('Unit | Utility | filter/date-range', function () {
  let dateRange = new DateRange();
  test('get dates by a period string', function (assert) {
    let after = dateRange.after('year');
    let before = dateRange.before('year');
    assert.equal(after, moment().month(0).date(1).format(DATE_FORMAT));
    assert.equal(before, moment().month(11).date(31).format(DATE_FORMAT));
    assert.equal(dateRange.before(null), null);
  });

  test('find a range by two dates', function (assert) {
    assert.equal(dateRange._range('2021-06-01', '2021-06-30'), 'month');
    assert.equal(dateRange._range('2021-04-01', '2021-06-30'), 'quarter');
    assert.equal(dateRange._range('2021-01-01', '2021-12-31'), 'year');
  });

  test('find a dropdown option by two dates', function (assert) {
    assert.equal(
      dateRange.range('2021-04-01', '2021-12-31'),
      dateRange.ranges[0]
    );
    assert.equal(
      dateRange.range('2021-06-01', '2021-06-30'),
      dateRange.ranges[1]
    );
    assert.equal(
      dateRange.range('2021-04-01', '2021-06-30'),
      dateRange.ranges[2]
    );
    assert.equal(
      dateRange.range('2021-01-01', '2021-12-31'),
      dateRange.ranges[3]
    );
  });
});
