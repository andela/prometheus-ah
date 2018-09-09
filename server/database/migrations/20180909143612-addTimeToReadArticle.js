module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Articles', 'readingTime', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    queryInterface.removeColumn('Articles', 'readingTime');
  }
};
