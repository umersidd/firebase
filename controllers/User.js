
const { StatusCodes } = require('http-status-codes')
const { fs } = require('../db/connect')
const BadRequestError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const db = fs.firestore();
const bcrypt = require("bcryptjs");

const registeruser = async (req, res) => {
    const { email, name, password, phoneNo, location, alertemail, alertmessage } = req.body
    if (!email || !password) {
        return res.status(200).json({ error: 'Please provide email and password' })
        throw new CustomError.BadRequestError('Please provide email and password');
    }
    const userDB = [];
    // const queryRef = await userRef.where('name', '==', 'umer').get();
    // console.log(queryRef)
    const userRef = db.collection("Users")
    const User = await userRef.where('email', '==', req.body.email).get().then(snapshot => {
        snapshot.forEach(user => {
            console.log(user.id, user.data());
            userDB.push(user.data(),user.id);
            // const name = some[0].name;
            // res.json({"name": name})
            // res.send(user);
        });
    }).catch(error => {
        console.error(error);
      });
    //   console.log(User)
    if (userDB.length > 0 ){
        return res.status(200).json("Already Exist")
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const data = { email, name, hashedPassword, phoneNo, location , alertemail, alertmessage }

    const usersDb = db.collection("Users");
    const response = await usersDb.add(data);

    res.status(200).json("User is Created")
}


const loginuser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(200).json({ error: 'Please provide email and password' })
        throw new CustomError.BadRequestError('Please provide email and password');
    }
    // const userRef = db.collection("Users")
    const userDB = [];
    // const queryRef = await userRef.where('name', '==', 'umer').get();
    // console.log(queryRef)
    const User = await db.collection("Users").where('email', '==', req.body.email).get().then(snapshot => {
        snapshot.forEach(user => {
            console.log(user.id, user.data());
            userDB.push(user.data(),user.id);
            // const name = some[0].name;
            // res.json({"name": name})
            // res.send(user);
        });
    }).catch(error => {
        console.error(error);
      });
      console.log(userDB)
    if (userDB.length === 0 ){
        return res.status(200).json({ error: 'No user exist' })
    }
    const isMatch = await bcrypt.compare(password, userDB[0].hashedPassword);
    if (!isMatch) {
      return res.status(200).json({ error: 'Incorrect Password' })
    }
    if (isMatch){
        console.log('okay')
    }
    const tokenUser = createTokenUser(userDB);
    attachCookiesToResponse({ res, user: tokenUser });
    // res.send(some);
    res.status(StatusCodes.OK).json({ user: tokenUser });

}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
  }
  



module.exports = { registeruser, loginuser, logout }