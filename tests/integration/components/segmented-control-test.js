import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | segmented-control', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.calledItems = [];
    this.selectedSegmentIndex = 1;
    this.segments = ['one', 'two', 'three'];
    this.clickSegment = (index) => {
      this.calledItems.push({
        functionName: 'clickSegment',
        arguments: [index]
      });
      this.set('selectedSegmentIndex', index);
    };

    await render(hbs`
      <SegmentedControl
        @segments={{segments}}
        @selectedSegmentIndex={{selectedSegmentIndex}}
        @onClickSegment={{clickSegment}} as |segment|
      >
        {{segment}}
      </SegmentedControl>
    `);

    assert.dom('button').exists({ count: 3 });
    assert.dom(findAll('button')[0]).hasText('one');
    assert.dom(findAll('button')[1]).hasText('two');
    assert.dom(findAll('button')[2]).hasText('three');

    assert.dom(findAll('button')[0]).doesNotHaveClass('selected');
    assert.dom(findAll('button')[1]).hasClass('selected');
    assert.dom(findAll('button')[2]).doesNotHaveClass('selected');

    await click(findAll('button')[0]);
    assert.dom(findAll('button')[0]).hasClass('selected');
    assert.dom(findAll('button')[1]).doesNotHaveClass('selected');
    assert.dom(findAll('button')[2]).doesNotHaveClass('selected');

    await click(findAll('button')[2]);
    assert.dom(findAll('button')[0]).doesNotHaveClass('selected');
    assert.dom(findAll('button')[1]).doesNotHaveClass('selected');
    assert.dom(findAll('button')[2]).hasClass('selected');

    assert.deepEqual(this.calledItems, [
      {
        arguments: [0],
        functionName: 'clickSegment'
      },
      {
        arguments: [2],
        functionName: 'clickSegment'
      }
    ]);
  });

  test('it renders disabled state', async function (assert) {
    this.clickSegment = () => {
      throw new Error('Callback should not be fired');
    };

    await render(hbs`
      <SegmentedControl
        @isDisabled={{true}}
        @segments={{array 'one' 'two'}}
        @selectedSegmentIndex={{1}}
        @onClickSegment={{clickSegment}} as |segment|
      >
        {{segment}}
      </SegmentedControl>
    `);

    assert.dom('.segmented-control').hasClass('disabled');

    assert.dom('button').exists({ count: 2 });
    assert.dom(findAll('button')[0]).isDisabled();
    assert.dom(findAll('button')[1]).isDisabled();

    await click(findAll('button')[0]);
    await click(findAll('button')[1]);
  });
});
