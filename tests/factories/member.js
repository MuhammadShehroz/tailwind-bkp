import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('member', {
  default: {
    name: FactoryGuy.generate((num) => `Member ${num}`),
    email: FactoryGuy.generate((num) => `member${num}@email.com`)
  }
});
