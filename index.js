const express = require('express');
const mqtt = require('mqtt');
const mongoose = require('mongoose');
const router = require('./router');
const Device = require('./models/device');
var cron = require('node-cron');

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
  client.subscribe('iot-nhom8-20211/#');
  console.log('client connected');
})

//save data to DB
client.on('message', async (topic, message) => {
  let data = message.toString()
  
  if (data.split(':').length > 2) {
    let value = data.split(':')[1].split(',')[0]
    let devices = await Device.find({ topic: topic })

    for (let i=0; i< devices.length; i++) {
      devices[i].value = value
      await devices[i].save()
      console.log(devices[i])
    }
  }
 
  
  
})

const app = express();
app.use(express.json());
app.use(router)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
