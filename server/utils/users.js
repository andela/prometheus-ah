import Users from './utilities';

const users = [
  {
    username: 'joeeasy',
    email: 'joeeasy@gmail.com',
    isVerified: true,
    password: Users.hashPassword('12345678'),
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z'
  },
  {
    username: 'faksam',
    email: 'fakunlesamuel@gmail.com',
    isVerified: true,
    password: Users.hashPassword('90123456'),
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z'
  },
  {
    password1: '12345678',
    password2: '90123456',
    password3: '90123456',
    password4: '90123456'
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
