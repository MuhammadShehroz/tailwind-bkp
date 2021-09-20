import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import EmberObject from '@ember/object';

const intervalOptions = [
  { label: 'per month', lateFeeInterval: 'monthly' },
  { label: 'per week', lateFeeInterval: 'weekly' },
  { label: 'per day', lateFeeInterval: 'daily' },
  { label: 'one time', lateFeeInterval: 'one_time' },
  { label: 'Clear', lateFeeInterval: null }
];

const lateFeeServiceStub = Service.extend({
  init() {
    this._super(...arguments);
    this.lateFeeOptions = [];
  },

  lateFeeIntervals: () => {
    return intervalOptions;
  },

  intervalFind: (model) => {
    return intervalOptions.find(function (option) {
      return option.lateFeeInterval === model.lateFeeInterval;
    });
  }
});

const currenciesServiceStub = Service.extend({
  symbol: () => {
    return { id: 'usd', code: 'USD' };
  }
});

module('Integration | Component | late-fee-group', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    let model = EmberObject.create({});
    this.set('model', model);

    this.owner.register('service:late-fee', lateFeeServiceStub);
    this.owner.register('service:currencies', currenciesServiceStub);
  });

  test('should render default late fee', async function (assert) {
    await render(hbs`<LateFeeGroup @model={{model}} />`);

    assert.dom('label').exists({ count: 1 });
    assert.dom('label').hasText('Late Fee (optional)');
    assert.dom('.custom-late-fee').doesNotExist();
  });

  test('should display late fee options from late fee service', async function (assert) {
    await render(hbs`<LateFeeGroup @model={{model}} />`);

    this.lateFeeService = this.owner.lookup('service:late-fee');
    this.lateFeeService.set('lateFeeOptions', [{ label: 'Option one' }]);

    // Open late fee options
    await click('.ember-power-select-trigger');

    assert.dom('li.ember-power-select-option').exists({ count: 1 });
    assert
      .dom(this.element.querySelectorAll('li.ember-power-select-option')[0])
      .hasText('Option one');
  });

  test('should not set selected item if has late fee', async function (assert) {
    await render(hbs`<LateFeeGroup @model={{model}} />`);

    this.lateFeeService = this.owner.lookup('service:late-fee');
    this.lateFeeService.set('lateFeeOptions', [
      { label: 'Option one', hasLateFee: false, lateFeeInterval: 'weekly' }
    ]);

    // Open late fee options
    await click('.ember-power-select-trigger');

    await click(
      this.element.querySelectorAll('li.ember-power-select-option')[0]
    );

    assert.dom('.ember-power-select-selected-item').doesNotExist();
  });

  test('should set selected item if has late fee', async function (assert) {
    await render(hbs`<LateFeeGroup @model={{model}} />`);

    this.lateFeeService = this.owner.lookup('service:late-fee');
    this.lateFeeService.set('lateFeeOptions', [
      { label: 'Option two', hasLateFee: true, lateFeeInterval: 'weekly' }
    ]);

    // Open late fee options
    await click('.ember-power-select-trigger');

    await click(
      this.element.querySelectorAll('li.ember-power-select-option')[0]
    );

    assert.dom('.ember-power-select-selected-item').exists();
    assert.dom('.ember-power-select-selected-item').hasText('per week');
  });

  test('should render custom late fee when customPercentageLateFee and customFixedLateFee', async function (assert) {
    this.set('customPercentageLateFee', true);
    this.set('customFixedLateFee', true);

    await render(hbs`
      <LateFeeGroup
        @model={{model}}
        @customPercentageLateFee={{customPercentageLateFee}}
        @customFixedLateFee={{customFixedLateFee}}
      />
    `);

    assert.dom('.custom-late-fee').exists();
    assert.dom('.number-field').exists();
  });

  test('should display late fee intervals from late fee service for custom late fee', async function (assert) {
    this.set('customPercentageLateFee', true);
    this.set('customFixedLateFee', true);

    await render(hbs`
      <LateFeeGroup
        @model={{model}}
        @customPercentageLateFee={{customPercentageLateFee}}
        @customFixedLateFee={{customFixedLateFee}}
      />
    `);

    this.lateFeeService = this.owner.lookup('service:late-fee');
    this.lateFeeService.set('lateFeeIntervals', intervalOptions);

    // Open late fee intervals
    await click('.ember-power-select-trigger');

    assert.dom('li.ember-power-select-option').exists({ count: 5 });
    assert
      .dom(this.element.querySelectorAll('li.ember-power-select-option')[0])
      .containsText('per month');
  });
});
