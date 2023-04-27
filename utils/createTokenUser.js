const createTokenUser = (user) => {
  // console.log(user[0].email)
  return {
    email: user[0].email,
    // firstname: user[0].firstname,
    // userid: user[0].userid,
    name:user[0].name,
    userid: user[1],
    location: user[0].location,
    phoneNo: user[0].phoneNo,
  };
};

module.exports = createTokenUser;
