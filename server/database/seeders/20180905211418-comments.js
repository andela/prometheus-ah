module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Comments', [
    {
      userId: 1,
      articleId: 2,
      body: 'This article is cool',
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    },
    {
      userId: 1,
      articleId: 1,
      body: 'This article is hot',
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    },
    {
      userId: 2,
      articleId: 2,
      body: 'This article is the best',
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    },
    {
      userId: 2,
      articleId: 1,
      body: 'This article is correct',
      createdAt: '2016-02-18T03:22:56.637Z',
      updatedAt: '2016-02-18T03:48:35.824Z',
    },
  ]),

  down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};
