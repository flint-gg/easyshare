module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.addColumn('switch_share_user', 'autoDelete', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Should we delete tweets/posts automatically',
      }, {
        transaction,
      });
      return true;
    },
  ),
  down: async (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeColumn('switch_share_user', 'autoDelete', {
      transaction,
    });
    return true;
  }),
};
