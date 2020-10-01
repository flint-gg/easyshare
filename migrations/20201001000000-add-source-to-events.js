module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.addColumn('switch_share_events', 'source', {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Source of the event, can be type of client or console from which the image came.',
        defaultValue: 4097, // to make migration easier
      }, {
        transaction,
      });
      await queryInterface.bulkUpdate('switch_share_events', {
        source: 1,
      }, {
        source: 4097,
        type: {
          [Sequelize.Op.in]: [6, 7, 8], // uploads until now
        },
      }, {
        transaction,
      });
      return true;
    },
  ),
  down: async (queryInterface) => queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeColumn('switch_share_events', 'source', {
      transaction,
    });
    return true;
  }),
};
