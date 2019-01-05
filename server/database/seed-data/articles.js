const articles = [
  {
    userId: 3,
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    body: 'It takes a Jacobian',
    status: 'publish',
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z',
  },
  {
    userId: 3,
    slug: 'how-to-train-your-dragon-2',
    title: 'How to train your dragon',
    description: 'Ever wonder wht?',
    body: 'It takes a Racobian',
    status: 'publish',
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z',
  },
  {
    userId: 2,
    slug: 'how-to-train-your-dragon-3',
    title: 'How to train your dragon',
    description: 'Ever wonder where?',
    body: 'It takes a Zacobian',
    status: 'publish',
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z',
  },
  {
    userId: 2,
    slug: 'how-to-force-your-dragon-3',
    title: 'How to force your dragon',
    description: 'Ever wonder where?',
    body: 'It takes a Zacobian',
    status: 'publish',
    createdAt: '2016-09-18T03:22:56.637Z',
    updatedAt: '2016-09-18T03:48:35.824Z',
  },
  {
    userId: 3,
    slug: 'how-to-force-your-lion-3',
    title: 'How to train your lion',
    description: 'Ever wonder where?',
    body: 'It takes a Zacobian',
    status: 'publish',
    createdAt: '2016-03-18T03:22:56.637Z',
    updatedAt: '2016-03-18T03:48:35.824Z',
  },
  {
    userId: 4,
    slug: 'how-to-tame-your-fish-3',
    title: 'How to tame your fish',
    description: 'Ever wonder where?',
    body: 'It takes a Zacobian',
    status: 'publish',
    createdAt: '2016-04-18T03:22:56.637Z',
    updatedAt: '2016-04-18T03:48:35.824Z',
  },
  {
    userId: 6,
    slug: 'how-to-train-your-parrot-3',
    title: 'How to train your parrot',
    description: 'Ever wonder where?',
    body: 'It takes a Zacobian',
    status: 'publish',
    createdAt: '2016-06-18T03:22:56.637Z',
    updatedAt: '2016-06-18T03:48:35.824Z',
  },
  {
    userId: 8,
    slug: 'how-to-train-your-vision-3',
    title: 'How to train your vision',
    description: 'Ever wonder where?',
    body: 'It takes a Zacobian',
    status: 'publish',
    createdAt: '2016-08-18T03:22:56.637Z',
    updatedAt: '2016-08-18T03:48:35.824Z',
  },
  {
    userId: 2,
    slug: 'this-is-how-i-feel-9',
    title: 'What Truly Makes a Senior Developer',
    description: `It’s difficult to compare talent from different-sized companies,
                   but certain things are key`,
    body: `When you start a new project, you don’t immediately start coding.
          You first have to define the purpose and scope of the project,
          then list out the project features or specs. After you can either start coding or
          if you are working on a more complex project then you should choose a design pattern
          that best suits your project. What is a Design Pattern? In software engineering,
          a design pattern is a reusable solution for commonly occurring
          problems in software design. Design patterns represent the best
          practices used by the experienced software developers. `,
    status: 'publish',
    createdAt: '2018-09-21 20:11:23.238+01',
    updatedAt: '2018-09-21 20:11:23.238+01',
  },
  {
    userId: 2,
    slug: 'the-most-important-skill-nobody-taught-you',
    title: 'The most important skill nobody taught you',
    description: 'The root of all our problems',
    body: `Before dying at the age of 39, Blaise Pascal made huge contributions
           to both physics and mathematics, notably in fluids, geometry, and probability.
           This work, however, would influence more than just the realm of the natural sciences.
           Many fields that we now classify under the heading of social science did, in fact,
           also grow out of the foundation he helped lay.`,
    status: 'publish',
    createdAt: '2018-10-20 13:21:33.812+01',
    updatedAt: '2018-10-20 13:21:33.812+01',
  },
  {
    userId: 2,
    slug: 'goodbye-object-oriented-programming',
    title: 'Goodbye, Object Oriented Programming',
    description: 'Why I don\'t like OOP',
    body: `I’ve been programming in Object Oriented languages for decades.
          The first OO language I used was C++ and then Smalltalk and finally .NET and Java.
          I was gung-ho to leverage the benefits of And Reuse is the word of the day.
          No… make that the year and perhaps evermore.`,
    status: 'publish',
    createdAt: '2018-10-20 13:28:51.678+01',
    updatedAt: '2018-10-20 13:28:51.678+01',
  },
  {
    userId: 2,
    slug: 'the-purpose-of-life-is-not-happiness-its-usefulness',
    title: 'The Purpose Of Life Is Not Happiness: It’s Usefulness',
    description: `For the longest time,
                  I believed that there’s only purpose of life: And that is to be happy.`,
    body: `For the longest time, I believed that there’s only purpose of life:
          And that is to be happy. Right? Why else go through all the pain and hardship?
          It’s to achieve happiness in some way. And I’m not the only person who believed that.
          In fact, if you look around you, most people are pursuing happiness in their lives.`,
    status: 'publish',
    createdAt: '2018-10-20 13:31:42.506+01',
    updatedAt: '2018-10-20 13:31:42.506+01',
  },
  {
    userId: 2,
    slug: '7-things-you-need-to-stop-doing-to-be-more-productive-backed-by-science',
    title: '7 Things You Need To Stop Doing To Be More Productive, Backed By Science',
    description: 'Work Hard, Work Smart',
    body: `When I was 17 years old, I used to work and study for about 20 hours a day.
    I went to school, did my homework during breaks and
    managed a not-for-profit organization at night.
    At that time, working long hours landed me countless national campaigns,
    opportunities to work with A-list organizations and a successful career.
    As I got older, I started to think differently.
    I realized that working more is not always the right, or only, path to success.`,
    status: 'publish',
    createdAt: '2018-10-20 13:25:26.047+01',
    updatedAt: '2018-10-20 13:25:26.047+01',
  },
];

export default articles;
