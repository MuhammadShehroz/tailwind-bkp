import Component from '@ember/component';
import FormBase from 'frontend/mixins/form-base';
import { underscore, capitalize, htmlSafe } from '@ember/string';
import { computed, setProperties } from '@ember/object';
import InvalidError from 'frontend/utils/errors/invalid-error';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend(FormBase, {
  modelName: 'liquid-message',
  previewMode: false,
  previewTemplate: '',
  store: service(),

  init() {
    this._super(...arguments);

    let templateTags = {
      base: [
        {
          name: '{{ client_name }}',
          desc: 'Inserts the client&#39;s name.'
        },
        {
          name: '{{ vendor_name }}',
          desc: 'Inserts your account name.'
        },
        {
          name: '{{ vendor_email }}',
          desc: 'Inserts your account profile&#39;s email address.'
        }
      ],

      invoiceMessage: [
        {
          name: '{{ invoice_id }}',
          desc: 'Inserts the invoice ID.'
        },
        {
          name: '{{ due_date }}',
          desc: 'Inserts invoice due date'
        }
      ],

      invoiceReminder: [
        {
          name: '{{ invoice_id }}',
          desc: 'Inserts the invoice ID.'
        },
        {
          name: '{{ days_past_due }}',
          desc: 'Inserts the #number of days that the invoice is currently past due.'
        },
        {
          name: '{{ late_fee_value }}',
          desc: 'Inserts either the late fee % or fixed amount, depending on the option set for the invoice.'
        },
        {
          name: '{{ late_fee }}',
          desc: '<b><i>True<i></b> if you have set a late fee for the invoice;<br /> \
              <b><i>False</i></b> if the invoice does not have a late fee set. To be used in a conditional statement.'
        },
        {
          name: '{{ late_fee_fixed }}',
          desc: '<b><i>True<i></b> if you have set fixed late fee for the invoice;<br /> \
              <b><i>False</i></b> if the invoice does not have a late fee set or has percentage late fee. To be used in a conditional statement.'
        },
        {
          name: '{{ late_fee_interval }}',
          desc: "Inserts late fee interval ('per month'/'per week'/'per day'/'one time')."
        },
        {
          name: '{% if conditional %}',
          block: '{% if %}\n\n{% else %}\n\n{% endif %}',
          desc: 'This tag opens a conditional statement.</b>'
        }
      ],

      invoiceSubject: [
        {
          name: '{{ invoice_id }}',
          desc: 'Inserts the invoice ID.'
        },
        {
          name: '{{ due_date }}',
          desc: 'Inserts invoice due date'
        }
      ],

      reminderSubject: [
        {
          name: '{{ invoice_id }}',
          desc: 'Inserts the invoice ID.'
        },
        {
          name: '{{ days_past_due }}',
          desc: 'Inserts the #number of days that the invoice is currently past due.'
        },
        {
          name: '{{ due_date }}',
          desc: 'Inserts invoice due date'
        }
      ],

      thankYouMessage: [
        {
          name: '{{ invoice_id }}',
          desc: 'Inserts the invoice ID.'
        }
      ],

      estimateMessage: [
        {
          name: '{{ estimate_id }}',
          desc: 'Inserts the estimate ID.'
        }
      ],

      estimateSubject: [
        {
          name: '{{ estimate_id }}',
          desc: 'Inserts the estimate ID.'
        }
      ]
    };

    let lateFeeOptions = [
      { label: 'No late fee', value: '' },
      { label: 'Fixed late fee', value: 'fixed' },
      { label: 'Percentage late fee', value: 'percent' }
    ];

    let { instanceName, messageType } = this;

    let customTags = templateTags[`${instanceName}${capitalize(messageType)}`];
    if (customTags !== undefined) {
      setProperties(this, {
        templateTags: [
          ...templateTags[`${instanceName}${capitalize(messageType)}`],
          ...templateTags.base
        ]
      });
    } else {
      setProperties(this, { templateTags: templateTags.base });
    }

    setProperties(this, {
      lateFeeOptions,
      hideTagsPreview: false
    });
  },

  isTemplateInvalid: computed(
    'model.validations.errors.[]',
    'templateName',
    function () {
      return this.model.get(`validations.attrs.${this.templateName}.isInvalid`);
    }
  ),

  templateError: computed(
    'model.validations.errors.[]',
    'templateName',
    function () {
      return this.model.get(`validations.attrs.${this.templateName}.message`);
    }
  ),

  didInsertElement() {
    let textArea = this.element.querySelector('textarea');
    textArea.focus();
  },

  textLabel: computed('message', 'instanceName', function () {
    return `${capitalize(this.instanceName)} - ${this.message}`;
  }),

  lateFeeKind: '',

  getTemplatePreview: task(function* () {
    if (this.previewMode) {
      yield this.preview(this.modelName, {
        message: this.model.get(this.templateName),
          instance_name: underscore(this.instanceName), // eslint-disable-line
          preview_params: { late_fee_kind: this.lateFeeKind }, // eslint-disable-line
        type: this.messageType
      })
        .then(
          (response) => {
            this.set('previewTemplate', response.liquid_message.preview);
            this.set(
              'showLateFee',
              response.liquid_message.include_conditionals
            );
          },
          (invalidError) => {
            invalidError.errors.forEach((error) =>
              this.model.errors.add(this.templateName, error.detail)
            );
            this.set('previewMode', false);
            throw new InvalidError(invalidError);
          }
        )
        .catch((error) =>
          this.flashMessages.add({
            type: 'error',
            title: error.name,
            message: htmlSafe(error.message),
            timeout: this.defaultTimeout
          })
        );
    }
  }).drop(),

  saveChain() {
    return this.model.save().then(() => {
      this.flashMessages.add({
        type: 'success',
        title: 'Successfully saved',
        message: 'Template saved successfully.',
        timeout: this.defaultTimeout
      });
      this.close();
    });
  },

  actions: {
    selectLateFee({ value }) {
      this.set('lateFeeKind', value);
      this.getTemplatePreview.perform();
    },

    cancel() {
      this.resetDefault();
      this.close();
    }
  }
});
