import Users from './utilities';

const users = [
  {
    username: 'joeeasy',
    email: 'joeeasy@gmail.com',
    password: Users.hashPassword('12345678'),
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z'
  },
  {
    username: 'faksam',
    email: 'fakunlesamuel@gmail.com',
    password: Users.hashPassword('90123456'),
    createdAt: '2016-02-18T03:22:56.637Z',
    updatedAt: '2016-02-18T03:48:35.824Z'
  },
  {
    password1: '12345678',
    password2: '90123456'
  }
];

export default users;
