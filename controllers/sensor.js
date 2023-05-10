const { StatusCodes } = require('http-status-codes')
const { fs } = require('../db/connect')
const BadRequestError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const db = fs.firestore();
const bcrypt = require("bcryptjs");
const { Vonage } = require('@vonage/server-sdk')
const nodemailer = require("nodemailer");
// const { query } = require('express');



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
            // console.log(user.id, user.data());
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
            sensorValue: sensorValue,
            bit: bit,
        });

    // console.log(userDB[0].email)
    const user_for_alert = [];
    const ref = db.collection("Users")


    const alert_user = await ref.where('email', '==', req.body.email).get().then(snapshot => {
        snapshot.forEach(user => {
            console.log(user.id, user.data());
            user_for_alert.push(user.data(), user.id);
            // const name = some[0].name;
            // res.json({"name": name})
            // res.send(user);
        });
    }).catch(error => {
        console.error(error);
    });
    // if (sensorValue > 200) {
    //     sendalert(user_for_alert[0].alertemail,user_for_alert[0].alertmessage)
    // }


    res.status(200).json("Data Changed")

}

function sendalert(emaill, number) {
    const vonage = new Vonage({
        apiKey: "9387e031",
        apiSecret: "p2EjJyGoc0DuIXnj"
    })
    console.log("send email")
    console.log(emaill)
    console.log(number)
    const from = "Vonage APIs"
    const to = number
    const text = 'A text message sent using the Vonage SMS API'
    async function sendSMS() {
        await vonage.sms.send({ to, from, text })
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }

    sendSMS();

    let transporter = nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        secure: false,
        auth: {
            user: 'muhammad.umer0312@gmail.com',
            pass: '9VGZnqEgHpfd805b'
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Umer" <muhammad.umer0312@gmail.com>', // sender address
        to: emaill, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    };

    // send mail with defined transport object
    const email = async (req, res) => {
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
        });
    }
    email()
}

const getAllUserData = async (req, res) => {
    const { pageNo, count, } = req.query
    const email = req.user && req.user.email ? req.user.email : 0;
    //console.log(req.user.role)
    if (req.user.role != "admin") {
        return res.status(200).json("Not Authorize to access this route")
    }
    // res.send("All Data")

    const sensorRef = db.collection("Sensor Data")
    const sensorDB = [];
    let result1 = await sensorRef.get().then(snapshot => {
        snapshot.forEach(user => {
            //console.log(user.id, user.data());
            sensorDB.push(user.data());
            // const name = some[0].name;
            // res.json({"name": name})
            // res.send(user);
        });
    }).catch(error => {
        console.error(error);
    });
    //console.log(sensorDB[0])
    // return res.json(sensorDB[0])

    //   return res.json(sensorDB)
    const userDB = [];
    const emails = [];
    const resulttt = [];
    const page = Number(pageNo) || 1
    const limit = Number(count) || 10
    const skip = (page - 1) * limit
    // const queryRef = await userRef.where('name', '==', 'umer').get();
    // console.log(queryRef)
    // const query = db.collection("Users")
    // const snapshot = await query.get();
    // const lastDocumentSnapshot = snapshot.docs[snapshot.docs.length - 1];

    // const userRef = db.collection("Users").startAfter(lastDocumentSnapshot).limit(limit)
    const userRef = db.collection("Users")

    let result2 = await userRef.get().then(snapshot => {
        snapshot.forEach(user => {
            //console.log(user.id, user.data());
            const userData = user.data();
            if (userData) {
                const found = sensorDB.find(element => element.email == userData.email);
                const retObj = {
                    name: userData.name ? userData.name : '',
                    email: userData.email ? userData.email : '',
                    location: userData.location ? userData.email : '',
                    phoneNo: userData.phoneNo ? userData.phoneNo : '',
                    alertEmail: userData.alertemail ? userData.alertemail : '',
                    sensorName: found && found.sensorName ? found.sensorName : '',
                    sensorValue: found && found.sensorValue ? found.sensorValue : '',
                }
                resulttt.push(retObj);
            }


            // const name = some[0].name;
            // res.json({"name": name})
            // res.send(user);
        });
    }).catch(error => {
        console.error(error);
    });
    // console.log(emails)
    // return res.status(200).json(userDB)

    // const page = Number(req.query.page) || 1
    // const limit = Number(req.query.limit) || 10
    const data = resulttt //await userDB
    res.status(200).json({ data, nbHits: data.length })

}



module.exports = { getData, saveData, getAllUserData }