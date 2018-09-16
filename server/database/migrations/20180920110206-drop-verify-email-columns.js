module.exports = {
  up: queryInterface => [
    queryInterface.removeColumn('Users', 'verify_hash_expiration')
  ],

  down: (queryInterface, Sequelize) => [
    queryInterface.addColumn('Users', 'verify_hash_expiration', {
      type: Sequelize.DATE,
    })
  ]
};
