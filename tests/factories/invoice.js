import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('invoice', {
  default: {},
  traits: {
    withClient: {
      client: FactoryGuy.belongsTo('client')
    }
  }
});
