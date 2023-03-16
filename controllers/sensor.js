const { StatusCodes } = require('http-status-codes')
const { fs } = require('../db/connect')
const BadRequestError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const db = fs.firestore();
const bcrypt = require("bcryptjs");


const getData = async (req, res) => {
    const email = req.user && req.user.email ? req.user.email : 0;
    console.log(email)
    const sensors = db.collection("Sensor Data");
    const sensorsData = [];
    if (email) {
        const fetchSensors = await sensors.where('email', '==', email).get().then(snapshot => {
            snapshot.forEach(user => {
                // console.log(user.id, user.data());
                sensorsData.push(user.data());
            });
        }).catch(error => {
            console.error(error);
        });
    }

    if (sensorsData && sensorsData.length > 0) {
        return res.status(200).json({ data: sensorsData });
    }
    else {
        return res.status(200).json({ data: [] });
    }
}



const saveData = async (req, res) => {
    const { email, sensorName, sensorValue, bit } = req.body
    const stringSensorValue = sensorValue.toString()
    const userDB = [];
    const userRef = db.collection("Sensor Data")
    //     const data = await userRef.where("email", "==", req.body.email)
    //   .get()
    //   .then(function(querySnapshot) {
    //       querySnapshot.forEach(function(doc) {
    //           console.log(doc.id, " => ", doc.data());
    //         //   doc.update(req.body)
    //       });
    //  })

    const User = await userRef.where('email', '==', req.body.email).where('sensorName', '==', req.body.sensorName).get().then(snapshot => {
        snapshot.forEach(user => {
            console.log(user.id, user.data());
            userDB.push(user.data(), user.id);
            // const name = some[0].name;
            // res.json({"name": name})
            // res.send(user);
        });
    }).catch(error => {
        console.error(error);
    });


    //  console.log(data.data())
    if (userDB.length === 0) {
        const response = db.collection("Sensor Data").add(req.body)
        // res.send(response) 
        return res.status(200).json("Data Created")
    }
    console.log(userDB[1]);
    // db.collection("Sensor Data").doc(userDB[1]).delete();
    const update = await db.collection("Sensor Data").doc(userDB[1]).update(
        {
            sensorName: sensorName,
            sensorValue: stringSensorValue,
            bit: bit,
        });

    res.status(200).json("Data Changed")


}

module.exports = { getData, saveData }