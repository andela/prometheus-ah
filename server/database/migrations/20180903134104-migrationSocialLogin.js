

module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn('Users', 'socialLogin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }),
    queryInterface.addColumn('Users', 'socialLoginType', {
      type: Sequelize.STRING
    })
  ],

  down: queryInterface => [
    queryInterface.removeColumn('Users', 'socialLogin'),
    queryInterface.removeColumn('Users', 'socialLoginType')
  ]
};
