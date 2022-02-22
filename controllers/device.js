const Area = require("../models/area")
const Device = require("../models/device")

var cron = require('node-cron');

const mqtt = require('mqtt');

function publisher(topic, message) {
    const client = mqtt.connect(process.env.MQTT_HOST);

    client.on('connect', function () {
        client.subscribe(topic, function (err) {
            if (!err) {
                client.publish(topic, message, function (e) {
                    if (!e) {
                        console.log('sent packet')
                    } else {
                        console.log(e)
                    }
                })

            }
        })
    })
}

module.exports = {
    getRealDevice: async function (req, res, next) {
        const devices = await Device.find({ area: null, type: req.query.type, status: false })
        console.log(devices)
        res.json(devices)
    },

    getAreaDevice: async function (req, res, next) {
        let area = await Area.findById(req.query.areaId)
        area = await area.populate('devices')
        console.log(area.devices)
        return res.json(area.devices)
    },

    createReal: async (req, res, next) => {
        const device = new Device({
            name: req.body.name,
            type: req.body.type,
            topic: req.body.topic
        })

        const createdDevice = await device.save()
        if (!createdDevice) {
            res.send('Fail')
        }

        res.json(createdDevice)
    },

    createVirtual: async (req, res, next) => {
        const device = new Device({
            name: req.body.name,
            area: req.body.area,
            type: req.body.type,
            status: false
        })

        const createdDevice = await device.save()
        if (!createdDevice) {
            res.send('Fail')
        }

        let area = await Area.findById(req.body.area)
        area.devices = [...area.devices, createdDevice._id]
        await area.save()
        res.json(createdDevice)
    },

    bind: async function (req, res, next) {
        let realDevice = await Device.findById(req.query.realId)
        let virtualDevice = await Device.findById(req.query.virtualId)

        if (!(realDevice.status || virtualDevice.status)) {

            realDevice.status = true
            virtualDevice.status = true
            virtualDevice.topic = realDevice.topic

            await realDevice.save()
                .then(async (suc) => {
                    await virtualDevice.save()
                    res.send('Successful')
                })
                .catch(err => { res.send('Fail') })
        }

        res.send('Error. Device has been already binded.')

    },

    unbind: async function (req, res, next) {
        let virtualDevice = await Device.findById(req.query.virtualId)
        let realDevice = await Device.findOne({ type: virtualDevice.type, topic: virtualDevice.topic })

        if (virtualDevice && realDevice) {
            virtualDevice.status = false
            virtualDevice.topic = null
            virtualDevice = await virtualDevice.save()

            realDevice.status = false
            realDevice = await realDevice.save()

            if (virtualDevice && realDevice) res.send('Successfull')
        }

        res.send('Fail')
    },

    deleteVirtual: async function (req, res, next) {
        Device.findByIdAndDelete(req.query.virtualId)
            .then(async (device) => {
                let realDevice = await Device.findOne({ type: device.type, topic: device.topic })
                realDevice.status = false
                await realDevice.save()
                res.send('Successful')
            })
            .catch(err => res.send('Fail'))
    },

    schedule: async function (req, res, next) {
        let time = req.query.time
        let isOn = req.query.isOn
        let device = await Device.findById(req.query.deviceId)
        let topic = device.topic
        let message = ""

        switch (device.type) {
            case 3: message = `{"Lamp": ${ isOn ? 0 : 1 }}`
                    break;
            case 4: message = `{"Pump": ${ isOn ? 0 : 1 }}`
                    break;
        }

        if (message) {
            cron.schedule('0 * * * * *', () => {
                publisher(topic, message)
                res.send('ok')
            });
        } else {
            res.send('Can not control sensors.')
        }
    },
}