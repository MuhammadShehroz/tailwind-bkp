import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | bs-file-picker', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    let arrayOfCalledItems = [];
    this.set('arrayOfCalledItems', arrayOfCalledItems);

    this.set('onSelectFilesTest', function (files) {
      arrayOfCalledItems.push({
        functionName: 'onSelectFiles',
        arguments: [...files].mapBy('name')
      });
    });
  });

  test('it select files', async function (assert) {
    await render(hbs`
      <BsFilePicker
        @onSelect={{onSelectFilesTest}}
      />
    `);

    await triggerEvent('[data-test-input]', 'change', {
      files: [
        (() => {
          let blob = new Blob(['file'], { type: 'image/png' });
          blob.name = 'file1.png';
          return blob;
        })(),
        (() => {
          let blob = new Blob(['file'], { type: 'image/jpg' });
          blob.name = 'file2.jpg';
          return blob;
        })(),
        (() => {
          let blob = new Blob(['file'], { type: 'image/gif' });
          blob.name = 'file3.gif';
          return blob;
        })()
      ]
    });

    assert.dom('[data-test-input]').hasNoValue();

    assert.deepEqual(
      this.arrayOfCalledItems,
      [
        {
          arguments: ['file1.png', 'file2.jpg', 'file3.gif'],

          functionName: 'onSelectFiles'
        }
      ],
      'Expected the selected files to be dispatched to the parent'
    );
  });

  test('it supports drag drop', async function (assert) {
    await render(hbs`
      <BsFilePicker
        @onSelect={{onSelectFilesTest}}
        @allowDragDrop={{true}}
      />
    `);

    // Drop some files
    await triggerEvent('[data-test-dropzone]', 'drop', {
      dataTransfer: {
        files: [
          new File(['file1'], 'file1.png', { type: 'image/png' }),
          new File(['file2'], 'file2.jpeg', { type: 'image/jpeg' }),
          new File(['file3'], 'file3.gif', { type: 'image/gif' })
        ]
      }
    });

    // Drop more files
    await triggerEvent('[data-test-dropzone]', 'drop', {
      dataTransfer: {
        files: [
          new File(['file4'], 'file4.png', { type: 'image/png' }),
          new File(['file5'], 'file5.jpg', { type: 'image/jpg' }),
          new File(['file6'], 'file6.jpg', { type: 'image/jpg' })
        ]
      }
    });

    assert.deepEqual(
      this.arrayOfCalledItems,
      [
        {
          arguments: ['file1.png', 'file2.jpeg', 'file3.gif'],

          functionName: 'onSelectFiles'
        },
        {
          arguments: ['file4.png', 'file5.jpg', 'file6.jpg'],

          functionName: 'onSelectFiles'
        }
      ],
      'Expected the selected files to be dispatched to the parent'
    );
  });
});
