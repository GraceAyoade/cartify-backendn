function userMapper(newUser: any) {
  return {
    id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    name: newUser.name,
    email: newUser.email,
    nationality: newUser.nationality,
  };
}
export default userMapper;
