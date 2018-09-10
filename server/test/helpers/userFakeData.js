const userFakeData = {
  invalidToken: 'invalidToken',
  validUserDetails: {
    firstname: 'Valentine',
    lastname: 'Ezeh',
    username: 'ugochukwu',
    password: 'password',
    email: 'valentine.ezeh@yahoo.com',
    isVerified: true,
    password_confirmation: 'password',
    bio: 'I am awesome',
  },
  validUserDetails2: {
    firstname: 'Valentine',
    lastname: 'Ezeh',
    username: 'ugochukwu1',
    password: 'password',
    email: 'valentine1.ezeh@yahoo.com',
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
