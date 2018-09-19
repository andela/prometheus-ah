module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn('Users', 'notificationStatus', {
      type: Sequelize.STRING,
      validate: {
        isIn: {
          args: [['on', 'off']],
          msg: 'Notification status must be on or off'
        }
      },
      defaultValue: 'on',
      allowNull: false,
    }),
  ],

  down: queryInterface => [
    queryInterface.removeColumn('Users', 'notificationStatus')
  ]
};
