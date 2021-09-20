import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | sort-by', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<SortBy >Header</SortBy>`);
    assert.dom('span.relative').exists();
    assert.dom('span.relative').hasText('Header');

    this.set('sort', 'title');
    this.set('field', 'title');
    this.set('order', 'asc');
    this.set('sortHandler', (sort, order) =>
      this.setProperties({ sort, order })
    );

    await render(hbs`<SortBy
      @sort={{sort}}
      @field={{field}}
      @order={{order}}
      @onSortChange={{action sortHandler}}/>
    `);
    await click('span.relative');
    assert.equal(this.order, 'desc', 'Sort direction has changed');
    assert.equal(this.sort, 'title', 'Sort field has still the same');

    this.set('field', 'id');
    this.set('order', 'asc');
    await render(hbs`<SortBy
      @sort={{sort}}
      @field={{field}}
      @order={{order}}
      @onSortChange={{action sortHandler}}/>
    `);
    await click('span.relative');
    assert.equal(this.sort, 'id', 'Sort field has changed');
    assert.equal(this.order, 'asc', 'Sort field is equal the default value');

    this.set('sort', 'title');
    this.set('field', 'id');
    this.set('order', 'asc');
    await render(hbs`<SortBy
      @defaultOrder='desc'
      @sort={{sort}}
      @field={{field}}
      @order={{order}}
      @onSortChange={{action sortHandler}}/>
    `);
    await click('span.relative');
    assert.equal(this.sort, 'id', 'Sort field has changed');
    assert.equal(this.order, 'desc', 'Sort field is equal the default value');
  });
});
