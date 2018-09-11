module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn('Users', 'hash', {
      type: Sequelize.STRING
    }),
    queryInterface.addColumn('Users', 'verify_hash_expiration', {
      type: Sequelize.DATE,
    })
  ],

  down: queryInterface => [
    queryInterface.removeColumn('Users', 'hash'),
    queryInterface.removeColumn('Users', 'verify_hash_expiration')
  ]
};
