import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { isBlank } from '@ember/utils';
import hbs from 'htmlbars-inline-precompile';

function compactOutput(obj) {
  return obj.element.textContent
    .trim()
    .split(' ')
    .map((s) => s.trim())
    .reject((s) => isBlank(s))
    .join(' ');
}

function makePage(total, current) {
  let pagination = {
    last: {
      number: total
    },

    self: {
      number: current
    }
  };

  if (current > 1) {
    pagination.prev = { number: current - 1 };
  }

  if (current < total) {
    pagination.next = { number: current + 1 };
  }

  return pagination;
}

module('Integration | Component | pagination-controls', function (hooks) {
  setupRenderingTest(hooks);

  test('2 pages, 1 current', async function (assert) {
    assert.expect(2);

    let pagination = makePage(2, 1);

    this.set('pagination', pagination);

    await render(hbs`{{pagination-controls pagination=pagination}}`);

    assert.equal(compactOutput(this), '1 2 Next');
    assert.dom('span.current').hasText('1');
  });

  test('2 pages, 2 current', async function (assert) {
    assert.expect(2);

    let pagination = makePage(2, 2);

    this.set('pagination', pagination);

    await render(hbs`{{pagination-controls pagination=pagination}}`);

    assert.equal(compactOutput(this), 'Prev 1 2');
    assert.dom('span.current').hasText('2');
  });

  test('3 pages, 1 current', async function (assert) {
    assert.expect(2);

    let pagination = makePage(3, 1);

    this.set('pagination', pagination);

    await render(hbs`{{pagination-controls pagination=pagination}}`);

    assert.equal(compactOutput(this), '1 2 3 Next');
    assert.dom('span.current').hasText('1');
  });

  test('3 pages, 2 current', async function (assert) {
    assert.expect(2);

    let pagination = makePage(3, 2);

    this.set('pagination', pagination);

    await render(hbs`{{pagination-controls pagination=pagination}}`);

    assert.equal(compactOutput(this), 'Prev 1 2 3 Next');
    assert.dom('span.current').hasText('2');
  });

  test('5 pages, 2 current', async function (assert) {
    assert.expect(2);

    let pagination = makePage(5, 2);

    this.set('pagination', pagination);

    await render(hbs`{{pagination-controls pagination=pagination}}`);

    assert.equal(compactOutput(this), 'Prev 1 2 3 4 5 Next');
    assert.dom('span.current').hasText('2');
  });

  test('5 pages, 4 current', async function (assert) {
    assert.expect(2);

    let pagination = makePage(5, 4);

    this.set('pagination', pagination);

    await render(hbs`{{pagination-controls pagination=pagination}}`);

    assert.equal(compactOutput(this), 'Prev 1 2 3 4 5 Next');
    assert.dom('span.current').hasText('4');
  });

  test('8 pages, 4 current', async function (assert) {
    assert.expect(2);

    let pagination = makePage(8, 4);

    this.set('pagination', pagination);

    await render(hbs`{{pagination-controls pagination=pagination}}`);

    assert.equal(compactOutput(this), 'Prev 2 3 4 5 6 Next');
    assert.dom('span.current').hasText('4');
  });

  test('8 pages, 7 current', async function (assert) {
    assert.expect(2);

    let pagination = makePage(8, 7);

    this.set('pagination', pagination);

    await render(hbs`{{pagination-controls pagination=pagination}}`);

    assert.equal(compactOutput(this), 'Prev 4 5 6 7 8 Next');
    assert.dom('span.current').hasText('7');
  });

  test('8 pages, 8 current', async function (assert) {
    assert.expect(2);

    let pagination = makePage(8, 8);

    this.set('pagination', pagination);

    await render(hbs`{{pagination-controls pagination=pagination}}`);

    assert.equal(compactOutput(this), 'Prev 4 5 6 7 8');
    assert.dom('span.current').hasText('8');
  });
});
