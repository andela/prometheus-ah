import Users from '../../utils/utilities';

const users = [
  {
    username: 'joeeasy',
    email: 'joeeasy@gmail.com',
    status: 'active',
    role: 'user',
    password: Users.hashPassword('12345678'),
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z',
    isVerified: true,
  },
  {
    username: 'faksam',
    email: 'fakunlesamuel@gmail.com',
    status: 'active',
    role: 'user',
    password: Users.hashPassword('90123456'),
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z',
    isVerified: true,
  },
  {
    password1: '12345678',
    password2: '90123456',
    password3: '90123456',
    password4: '90123456'
  },
  {
    username: 'createadmin',
    email: 'createadmin@gmail.com',
    password: Users.hashPassword('password3'),
    status: 'active',
    role: 'user',
    createdAt: '2018-02-18T03:22:56.637Z',
    updatedAt: '2018-02-18T03:48:35.824Z'
  },
  {
    username: 'createadmin1',
    email: 'createadmin1@gmail.com',
    password: Users.hashPassword('password4'),
    status: 'active',
    role: 'admin',
    createdAt: '2018-02-18T03:22:56.637Z',
    updatedAt: '2018-02-18T03:48:35.824Z'
  },
  {
    username: 'peter',
    email: 'peteradeoye@gmail.com',
    isVerified: false,
    password: '90123456',
    password_confirmation: '90123456',
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z'
  },
  {
    username: 'tega',
    email: 'tegatega@gmail.com',
    isVerified: false,
    password: '90123456',
    password_confirmation: '90123456',
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z'
  },
  {
    username: 'chidinma',
    email: 'chidinma@gmail.com',
    isVerified: true,
    password: '90123456',
    password_confirmation: '90123456',
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z'
  },
];

export default users;
