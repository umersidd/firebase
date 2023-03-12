require('dotenv').config()
const express = require("express");
const cors = require('cors');
const app = express();

const cookieParser = require('cookie-parser');

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