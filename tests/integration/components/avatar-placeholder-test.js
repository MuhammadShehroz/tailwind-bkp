import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | avatar-placeholder', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders image', async function (assert) {
    await render(hbs`<AvatarPlaceholder @url='image.png'/>`);

    assert
      .dom(this.element.firstChild)
      .hasAttribute('style', 'background-image: url(image.png)');
    assert.dom(this.element.firstChild).hasNoText();
    assert.dom(this.element.firstChild).hasClass('image');
  });

  test('it renders initials', async function (assert) {
    await render(hbs`<AvatarPlaceholder @initials='AO'/>`);

    assert.dom(this.element.firstChild).doesNotHaveAttribute('style');
    assert.dom(this.element.firstChild).hasText('AO');
    assert.dom(this.element.firstChild).hasClass('no-image');
  });

  test('it renders image even when initials is sent in', async function (assert) {
    await render(hbs`<AvatarPlaceholder @url='image.png' @initials='AO'/>`);

    assert
      .dom(this.element.firstChild)
      .hasAttribute('style', 'background-image: url(image.png)');
    assert.dom(this.element.firstChild).hasNoText('AO');
    assert.dom(this.element.firstChild).hasClass('image');
  });
});
