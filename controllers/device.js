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
        let area = await Area.findById(req.body.area)

        if (area) {
            const device = new Device({
                name: req.body.name,
                area: req.body.area,
                type: req.body.type
            })
    
            const createdDevice = await device.save()
            if (!createdDevice) {
                res.send('Fail')
            }
    
            area.devices = [...area.devices, createdDevice._id]
            await area.save()
            res.json(createdDevice)
        }
        res.send('Invalid area id')
    },

    bind: async function (req, res, next) {
        let realDevice = await Device.findById(req.query.realId)
        let virtualDevice = await Device.findById(req.query.virtualId)
        if (realDevice && virtualDevice) {
            if (realDevice.status || virtualDevice.status) {

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

        }
        
        res.send('Error. Device is invalid')

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
                if (device.status) {
                    await Device.findOneAndUpdate({ type: device.type, topic: device.topic }, { status: false })
                }
                res.send('Successful')
            })
            .catch(err => res.send('Fail'))
    },

    schedule: async function (req, res, next) {
        let startTime = req.query.startTime
        let endTime = req.query.endTime
        let action = req.query.action
        let device = await Device.findById(req.query.deviceId)
        let topic = device.topic
        let startMess = ""
        let endMess = ""

        switch (device.type) {
            case 3: startMess = `{"Lamp":${ action ? 0 : 1 }}`
                    endMess = `{"Lamp":${ action ? 1 : 0 }}`
                    break;
            case 4: startMess = `{"Pump":${ action ? 0 : 1 }}`
                    endMess = `{"Pump":${ action ? 1 : 0 }}`
                    break;
        }

        if (true) {
            console.log('....')
            cron.schedule(startTime, () => {
                publisher(topic, startMess)
                console.log('start')
            });
            cron.schedule(endTime, () => {
                publisher(topic, endMess)
                console.log('end')
                
            });
            res.send('ok')
        } else {
            res.send('Can not control sensors.')
        }
    },
}