import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import EditRoute from 'frontend/mixins/routes/documents/edit';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(EditRoute, FormOptions, {
  titleToken: 'Edit Recurring Invoice',
  modelName: 'invoice-template',

  model(params) {
    return this.store.find(this.modelName, params.id);
  },

  async setupController(controller, model) {
    this._super(controller, model);
    let recurringSchedules = await this.store.query('recurring-schedule', {
      invoice_template_id: model.id // eslint-disable-line camelcase
    });

    await Promise.all(
      recurringSchedules.map((recurringSchedule) =>
        this.store.query('contact', {
          client_id: recurringSchedule.get('client.id') // eslint-disable-line camelcase
        })
      )
    );

    recurringSchedules = recurringSchedules.toArray();

    for (let recurringSchedule of recurringSchedules) {
      // eslint-disable-next-line no-await-in-loop
      await recurringSchedule.belongsTo('client').load();
      // eslint-disable-next-line no-await-in-loop
      let recurringScheduleContacts = await Promise.all(
        recurringSchedule.scheduleContacts.map((scheduleContact) =>
          scheduleContact.belongsTo('contact').load()
        )
      );

      recurringScheduleContacts = recurringScheduleContacts.filter(
        (contact) => contact
      );
    }

    controller.setProperties({
      fetchCountries: this.fetchCountries,
      fetchSubregions: this.fetchSubregions,
      clients: controller.clients || (await this.fetchClients()),
      currencies: controller.currencies || (await this.fetchCurrencies()),
      createTax: () => this.createTax(),
      createUnit: () => this.createUnit(),
      fetchUnits: () => this.fetchUnits()
    });
  }
});
