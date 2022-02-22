const Area = require("../models/area")
const Device = require("../models/device")

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

        if (! (realDevice.status || virtualDevice.status) ) {
            
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
    }
}