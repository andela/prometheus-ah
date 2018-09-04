module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Articles', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('Articles', 'description');
  }
};
