import { toQueryString } from 'frontend/utils/url';
import { module, test } from 'qunit';

module('Unit | Utility | url', function () {
  test('transform object', function (assert) {
    let result = toQueryString({
      some: 'prop',
      thingOfSome: 'http://another.com',
      WillDECAMELIZE: 'and ENCode THE uri'
    });
    assert.equal(
      result,
      'some=prop&thing_of_some=http%3A%2F%2Fanother.com&will_decamelize=and%20ENCode%20THE%20uri'
    );
  });

  test('transform object with decamelize turned off', function (assert) {
    let result = toQueryString(
      {
        some: 'prop',
        thingOfSome: 'http://another.com',
        willNotDECAMELIZE: 'and ENCode THE uri'
      },
      false
    );
    assert.equal(
      result,
      'some=prop&thingOfSome=http%3A%2F%2Fanother.com&willNotDECAMELIZE=and%20ENCode%20THE%20uri'
    );
  });
});
