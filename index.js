const express = require('express');
const mqtt = require('mqtt');
const mongoose = require('mongoose');
const router = require('./router');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const client = mqtt.connect(process.env.MQTT_HOST);

client.on('connect', () => {
  client.subscribe('/iot-nhom8-20211/#');
  console.log('client connected');
})

//save data to DB
client.on('message', (topic, message) => {
  var data = message.toString() //.replaceAll('\'', '\"');
  console.log(data)
  // console.log(JSON.parse(data));
  // console.log('\n')

  // var message = JSON.parse(message.toString());
  // console.log(message);
})

const app = express();
app.use(express.json());
app.use(router)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
