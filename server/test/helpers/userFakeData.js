const userFakeData = {
  invalidToken: 'invalideToken',
  validUserDetails: {
    firstname: 'Valentine',
    lastname: 'Ezeh',
    username: 'ugochukwu15',
    password: 'password',
    email: 'valentine.ezeh@yahoo.com',
    confirmPassword: 'password',
    bio: 'I am awesome',
  },
  userDetailsWithPasswordMismatch: {
    firstname: 'Valentine',
    lastname: 'Ezeh',
    email: 'valentine.ezeh@yahoo.com',
    username: 'ugochukwu15',
    password: 'password1',
    confirmPassword: 'password',
    bio: 'I am awesome.',
  },
  userDetailsDoesNotExist: {
    firstname: 'user',
    lastname: 'user',
    email: 'user.user@gmail.com',
    username: 'user1234',
    password: 'password',
    confirmPassword: 'password',
    bio: 'I am awesome.',
  }
};

export default userFakeData;
