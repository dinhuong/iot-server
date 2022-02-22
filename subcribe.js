const mqtt = require('mqtt');


class Client {

    constructor(){
        this.client =  mqtt.connect(process.env.MQTT_HOST);
    }

    connect() {
        console.log('connect')
        this.client.on('connect', () => {
            this.client.subscribe('iot-nhom8-20211/#');
            console.log('client connected');
          })
    }

    receive() {
        console.log('receive')
        this.client.on('message', (topic, message) => {
            var data = message.toString() //.replaceAll('\'', '\"');
            console.log(topic)
            console.log(data)
          })
    }
}

module.exports = new Client();