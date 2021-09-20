import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('contact', {
  default: {
    lastName: FactoryGuy.generate((num) => `Contact last name ${num}`),
    firstName: FactoryGuy.generate((num) => `Contact first name ${num}`),
    email: FactoryGuy.generate((num) => `contact${num}@email.com`),
    phone: FactoryGuy.generate((num) => `0987654321${num}`)
  }
});
