var serviceAccount = require('../dbConnect.json');
const fs = require('firebase-admin');
fs.initializeApp({
credential: fs.credential.cert(serviceAccount),
databaseURL: "https://fir-dc380-default-rtdb.firebaseio.com",
authDomain: "fir-dc380.firebaseapp.com",
});


module.exports = { fs }