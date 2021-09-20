import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import fileModule from 'frontend/utils/file';
import sinon from 'sinon';

module(
  'Integration | Component | document-branding/add-logo',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      await render(hbs`<DocumentBranding::AddLogo/>`);

      assert.dom('h2').hasText('Add Your Logo');
      assert
        .dom('p')
        .hasText(
          "For best results, use PNG files (but we'll accept JPG or JPEG assets as well)"
        );
      assert.dom('.bs-drop-zone').exists({ count: 1 });
      assert.dom('.bs-file-picker').exists({ count: 1 });
      assert.dom('.bs-drop-zone img').doesNotExist();
    });

    test('it selects file', async function (assert) {
      sinon
        .stub(fileModule, 'readAsDataURL')
        .onFirstCall()
        .resolves({
          target: {
            result: '//DATA-URI 1'
          }
        })
        .onSecondCall()
        .resolves({
          target: {
            result: '//DATA-URI 2'
          }
        });

      this.onSelectFileTest = sinon.spy();

      await render(
        hbs`<DocumentBranding::AddLogo @onSelectFile={{onSelectFileTest}}/>`
      );

      // pick an unsupported file
      await triggerEvent('.bs-file-picker input', 'change', {
        files: [new File(['file'], 'file.png', { type: 'image/png' })]
      });

      // Drop another image
      await triggerEvent('.bs-drop-zone', 'drop', {
        dataTransfer: {
          files: [new File(['second'], 'second.jpg', { type: 'image/jpeg' })]
        }
      });

      assert.deepEqual(this.onSelectFileTest.firstCall.args, [
        {
          data: '//DATA-URI 1',
          name: 'file.png',
          size: 4,
          type: 'image/png'
        }
      ]);

      assert.deepEqual(this.onSelectFileTest.secondCall.args, [
        {
          data: '//DATA-URI 2',
          name: 'second.jpg',
          size: 6,
          type: 'image/jpeg'
        }
      ]);

      assert.ok(this.onSelectFileTest.calledTwice);
    });
  }
);
