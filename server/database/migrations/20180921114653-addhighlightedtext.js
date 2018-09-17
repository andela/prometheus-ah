module.exports = {
  up: (queryInterface, Sequelize) => [
    queryInterface.addColumn('Comments', 'highlightedText', {
      type: Sequelize.STRING
    })
  ],

  down: queryInterface => [
    queryInterface.removeColumn('Comments', 'highlightedText')
  ]
};
