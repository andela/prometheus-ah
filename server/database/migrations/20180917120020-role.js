module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      isIn: [['user', 'admin', 'superAdmin']],
      defaultValue: 'user',
    }),
    queryInterface.addColumn('Users', 'status', {
      type: Sequelize.STRING,
      isIn: [['active', 'blocked']],
      defaultValue: 'active',
    }),
  ],

  down: queryInterface => [
    queryInterface.removeColumn('Users', 'role'),
    queryInterface.removeColumn('Users', 'status')
  ]
};
