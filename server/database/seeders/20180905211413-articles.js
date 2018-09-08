module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Articles', [
    {
      userId: 1,
      slug: 'how-to-train-your-dragon',
      title: 'How to train your dragon',
      description: 'Ever wonder how?',
      body: 'It takes a Jacobian',
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    },
    {
      userId: 1,
      slug: 'how-to-train-your-dragon-2',
      title: 'How to train your dragon',
      description: 'Ever wonder wht?',
      body: 'It takes a Racobian',
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    },
    {
      userId: 1,
      slug: 'how-to-train-your-dragon-3',
      title: 'How to train your dragon',
      description: 'Ever wonder where?',
      body: 'It takes a Zacobian',
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    }
  ]),
  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
