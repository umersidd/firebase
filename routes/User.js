const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
  } = require('../middleware/authentication');

const {registeruser, loginuser, logout} = require('../controllers/User')



router.route('/register').post(registeruser)
router.route('/login').post(loginuser)
router.route('/login').get(logout)


module.exports = router