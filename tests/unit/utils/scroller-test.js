import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { scrollToErrorField } from 'frontend/utils/scroller';

const createErrorField = (
  scrollIntoView,
  errorClassName = 'field-with-errors'
) => {
  let field = document.createElement('div');
  field.classList.add(errorClassName);
  field.scrollIntoView = scrollIntoView;
  return field;
};

module('Unit | Utility | scroller', function (hooks) {
  setupRenderingTest(hooks);

  test('it scrolls to error field by default', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <div id='page'>
        <form novalidate>
        </form>
      </div>
    `);

    document
      .querySelector('#page > form')
      .appendChild(createErrorField(() => assert.ok(1)));

    await settled();

    scrollToErrorField();
  });

  test('it scrolls to error field in a modal by default', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <div id='page'>
      </div>
      <div class='bs-modal'>
        <form novalidate>
        </form>
      </div>
    `);

    document
      .querySelector('.bs-modal > form')
      .appendChild(createErrorField(() => assert.ok(1)));

    await settled();

    scrollToErrorField();
  });

  test('it scrolls to error field in a custom container', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <div class='custom'>
        <form novalidate>
        </form>
      </div>
    `);

    document
      .querySelector('.custom > form')
      .appendChild(createErrorField(() => assert.ok(1)));

    await settled();

    scrollToErrorField('.custom');
  });

  test('it scrolls to error field in a custom error field', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <div id='page'>
        <form novalidate>
        </form>
      </div>
    `);

    document
      .querySelector('#page > form')
      .appendChild(createErrorField(() => assert.ok(1), 'my-error'));

    await settled();

    scrollToErrorField(null, '.my-error');
  });

  test('it scrolls to error field in a custom container and error field', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <div class='custom'>
        <form novalidate>
        </form>
      </div>
    `);

    document
      .querySelector('.custom > form')
      .appendChild(createErrorField(() => assert.ok(1), 'my-error'));

    await settled();

    scrollToErrorField('.custom', '.my-error');
  });
});
