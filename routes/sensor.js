const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions,
  } = require('../middleware/authentication');

const {getData, saveData} = require('../controllers/sensor')



// router.route('/register').post(registeruser)
// router.route('/login').post(loginuser)
router.route('/getdata').get(authenticateUser,getData)
router.route('/getdata').post(saveData)


module.exports = router