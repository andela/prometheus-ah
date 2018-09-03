module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn('Users', 'firstname', {
      type: Sequelize.STRING,
      allowNull: true,
    }),
    queryInterface.addColumn('Users', 'lastname', {
      type: Sequelize.STRING,
      allowNull: true,
    }),
  ],

  down: queryInterface => [
    queryInterface.removeColumn('Users', 'firstname'),
    queryInterface.removeColumn('Users', 'lastname')
  ]
};
