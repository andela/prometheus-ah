module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn('Users', 'reset_password_hash', {
      type: Sequelize.STRING
    })
  ],

  down: queryInterface => [
    queryInterface.removeColumn('Users', 'reset_password_hash')
  ]
};
