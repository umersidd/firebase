require('dotenv').config()
const express = require("express");
const cors = require('cors');
const app = express();
// const wbm = require('wbm');

const cookieParser = require('cookie-parser');
const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "9387e031",
  apiSecret: "p2EjJyGoc0DuIXnj"
})

//const accountSid = 'ACb5c7bb6d3f88125d303575a466f67c08'; 
//const authToken = 'b40c48402d91362a01c9202766db21bb'; 
//const client = require('twilio')(accountSid, authToken); 
const nodemailer = require("nodemailer");
  

const from = "Vonage APIs"
const to = "923358154653"
const text = 'A text message sent using the Vonage SMS API'


// let transporter = nodemailer.createTransport({
//     host: 'smtp-relay.sendinblue.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: 'muhammad.umer0312@gmail.com',
//         pass: '9VGZnqEgHpfd805b'
//     }
//   });
  
//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: '"Umer" <muhammad.umer0312@gmail.com>', // sender address
//     to: "muhammad.umer0312@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   };
  
//   // send mail with defined transport object
// const email = async(req,res)=>{
//     await transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log("Message sent: %s", info.messageId);
//   });
// }
// email()

//adding cors
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

const createuser = require('./routes/user')
const sensorData = require('./routes/sensor')



app.use('/api/v1/user', createuser)
app.use('/api/v1/sensor', sensorData)

app.listen(3000, () => console.log("Up & RUnning *3000"));
