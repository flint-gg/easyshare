module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.addColumn('switch_share_user', 'email', {
        type: Sequelize.TEXT,
        comment: 'The email the user manually added.',
      }, {
        transaction,
      });
      return true;
    },
  ),
  down: async (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeColumn('switch_share_user', 'email', {
      transaction,
    });
    return true;
  }),
};
