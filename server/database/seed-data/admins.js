import Users from '../../utils/utilities';

const admins = [
  {
    username: 'superadmin',
    email: 'cwizard2011@gmail.com',
    password: Users.hashPassword('password'),
    role: 'superAdmin',
    status: 'active',
    isVerified: true,
    createdAt: '2018-02-18T03:22:56.637Z',
    updatedAt: '2018-02-18T03:48:35.824Z'
  },
  {
    username: 'spammer',
    email: 'spammer@gmail.com',
    password: Users.hashPassword('password1'),
    status: 'blocked',
    role: 'user',
    isVerified: true,
    createdAt: '2018-02-18T03:22:56.637Z',
    updatedAt: '2018-02-18T03:48:35.824Z'
  },
  {
    username: 'makeadmin',
    email: 'makeadmin@gmail.com',
    status: 'active',
    role: 'user',
    isVerified: true,
    password: Users.hashPassword('password2'),
    createdAt: '2018-02-18T03:22:56.637Z',
    updatedAt: '2018-02-18T03:48:35.824Z'
  },
  {
    username: 'makeadmin1',
    email: 'makeadmin@gmail.com',
    status: 'active',
    role: 'user',
    isVerified: true,
    password: Users.hashPassword('password3'),
    createdAt: '2018-02-18T03:22:56.637Z',
    updatedAt: '2018-02-18T03:48:35.824Z'
  },
  {
    username: 'admin',
    email: 'admin@gmail.com',
    password: Users.hashPassword('password4'),
    role: 'admin',
    status: 'active',
    isVerified: true,
    createdAt: '2018-02-18T03:22:56.637Z',
    updatedAt: '2018-02-18T03:48:35.824Z'
  },
  {
    username: 'blocked',
    email: 'blocked@gmail.com',
    password: Users.hashPassword('password5'),
    status: 'blocked',
    role: 'user',
    isVerified: true,
    createdAt: '2018-02-18T03:22:56.637Z',
    updatedAt: '2018-02-18T03:48:35.824Z'
  },
  {
    username: 'blocked2',
    email: 'blocked2@gmail.com',
    password: Users.hashPassword('password6'),
    status: 'blocked',
    role: 'user',
    isVerified: true,
    createdAt: '2018-02-18T03:22:56.637Z',
    updatedAt: '2018-02-18T03:48:35.824Z'
  },
  {
    password1: 'password',
    password2: 'password1',
    password3: 'password2',
    password4: 'password3',
    password5: 'password4',
    password6: 'password5',
    password7: 'password6'
  }
];

export default admins;
