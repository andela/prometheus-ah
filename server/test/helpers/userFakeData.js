const userFakeData = {
  invalidToken: 'invalidToken',
  validUserDetails: {
    firstname: 'Valentine',
    lastname: 'Ezeh',
    username: 'ugochukwu',
    password: 'password',
    email: 'valentine.ezeh@yahoo.com',
    password_confirmation: 'password',
    bio: 'I am awesome',
  },
  userDetailsDoesNotExist: {
    firstname: 'user',
    lastname: 'user',
    email: 'user.user@gmail.com',
    username: 'user1234',
    password: 'password',
    password_confirmation: 'password',
    bio: 'I am awesome.',
  },
  loginUser: {
    username: 'ugochukwu',
    password: 'password'
  }
};

export default userFakeData;
