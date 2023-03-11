require('dotenv').config()
const express = require("express");
const app = express();

const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

const createuser = require('./routes/user')
const sensorData = require('./routes/sensor')



app.use('/api/v1/user', createuser)
app.use('/api/v1/sensor', sensorData)

app.listen(3000, () => console.log("Up & RUnning *3000"));