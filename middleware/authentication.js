const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    return res.status(400).json('Authentication Invalid')
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }

  try {
    const { name, userid, role, email, phoneNo } = isTokenValid({ token });
    req.user = { name, userid, role, email, phoneNo };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

const authorizePermissions = (...roles) => {
  
  return (req, res, next) => {
    // console.log(`check check -> ${(req)}, --> -->`)
    if (!roles.includes("admin")) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
