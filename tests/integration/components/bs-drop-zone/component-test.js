import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | bs-drop-zone', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<BsDropZone />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <BsDropZone>
        template block text
      </BsDropZone>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('drop files', async function (assert) {
    this.dropFilesSpy = sinon.spy();

    this.dropFilesTestCB = (files) =>
      this.dropFilesSpy(
        files.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size
        }))
      );

    await render(hbs`<BsDropZone @onDropFiles={{dropFilesTestCB}} />`);

    // Drop some files
    await triggerEvent(this.element.firstChild, 'drop', {
      dataTransfer: {
        files: [
          new File(['file1'], 'file1.png', { type: 'image/png' }),
          new File(['file2'], 'file2.jpeg', { type: 'image/jpeg' }),
          new File(['file3'], 'file3.gif', { type: 'image/gif' })
        ]
      }
    });

    // Drop more files
    await triggerEvent(this.element.firstChild, 'drop', {
      dataTransfer: {
        files: [
          new File(['file4'], 'file4.png', { type: 'image/png' }),
          new File(['file5'], 'file5.jpg', { type: 'image/jpg' }),
          new File(['file6'], 'file6.jpg', { type: 'image/jpg' })
        ]
      }
    });

    assert.deepEqual(this.dropFilesSpy.firstCall.args, [
      [
        {
          name: 'file1.png',
          size: 5,
          type: 'image/png'
        },
        {
          name: 'file2.jpeg',
          size: 5,
          type: 'image/jpeg'
        },
        {
          name: 'file3.gif',
          size: 5,
          type: 'image/gif'
        }
      ]
    ]);

    assert.deepEqual(this.dropFilesSpy.secondCall.args, [
      [
        {
          name: 'file4.png',
          size: 5,
          type: 'image/png'
        },
        {
          name: 'file5.jpg',
          size: 5,
          type: 'image/jpg'
        },
        {
          name: 'file6.jpg',
          size: 5,
          type: 'image/jpg'
        }
      ]
    ]);
  });

  test('filter unaccepted files', async function (assert) {
    this.dropFilesSpy = sinon.spy();

    this.acceptTest = ['image/png', 'image/jpeg'];

    this.dropFilesTestCB = (files) =>
      this.dropFilesSpy(
        files.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size
        }))
      );

    await render(
      hbs`<BsDropZone @onDropFiles={{dropFilesTestCB}} @accept={{acceptTest}} />`
    );

    // Drop some files
    await triggerEvent(this.element.firstChild, 'drop', {
      dataTransfer: {
        files: [
          new File(['file1'], 'file1.png', { type: 'image/png' }),
          new File(['file2'], 'file2.txt', { type: 'txt/plain' })
        ]
      }
    });

    // Drop more files
    await triggerEvent(this.element.firstChild, 'drop', {
      dataTransfer: {
        files: [
          new File(['file3'], 'file3.pdf', { type: 'application/pdf' }),
          new File(['file4'], 'file4.gif', { type: 'image/gif' }),
          new File(['file5'], 'file5.jpg', { type: 'image/jpeg' })
        ]
      }
    });

    assert.deepEqual(this.dropFilesSpy.firstCall.args, [
      [
        {
          name: 'file1.png',
          size: 5,
          type: 'image/png'
        }
      ]
    ]);

    assert.deepEqual(this.dropFilesSpy.secondCall.args, [
      [
        {
          name: 'file5.jpg',
          size: 5,
          type: 'image/jpeg'
        }
      ]
    ]);
  });
});
