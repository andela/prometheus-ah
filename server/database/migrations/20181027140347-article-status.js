module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Articles', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      isIn: [['draft', 'publish', 'block']],
      defaultValue: 'draft',
    });
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('Articles', 'status');
  }
};
