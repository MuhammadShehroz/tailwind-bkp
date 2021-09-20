import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';
import { ActiveModelSerializer } from 'active-model-adapter';

export default ActiveModelSerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    billingAddress: { embedded: 'always' },
    contacts: { serialize: 'records', deserialize: false }
  }
});
