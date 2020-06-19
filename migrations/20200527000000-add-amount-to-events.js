module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.addColumn('switch_share_events', 'amount', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Occurence amount of the event. Currently only relevant for multi image uploads',
      }, {
        transaction,
      });

      // set the amount to at least 2 on multi image uploads
      await queryInterface.update({
        amount: 2,
      }, {
        where: {
          type: 7,
          /* = multi image */
        },
        transaction,
      });
      return true;
    },
  ),
  down: async (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeColumn('switch_share_events', 'amount', {
      transaction,
    });
    return true;
  }),
};
