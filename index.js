const express = require('express');
const mqtt = require('mqtt');
const mongoose = require('mongoose');
const router = require('./router');
const Device = require('./models/device');
const device = require('./controllers/device');

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
  let data = message.toString().split(':')[1].split(',')[0]
  console.log(data)
  console.log(topic)

  let devices = await Device.find({ topic: topic })

  for (let i=0; i< devices.length; i++) {
    let device = await Device.findByIdAndUpdate(devices[i]._id, { value: data })
    console.log(device)
    // devices[i].value = data
    // await device[i].save()
  }
  
})

const app = express();
app.use(express.json());
app.use(router)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
