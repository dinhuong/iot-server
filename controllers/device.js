const Area = require("../models/area")
const Device = require("../models/device")

module.exports = {
    getAll: async function (req, res, next) {
        const devices = await Device.find({ status: false, type: [3,4] })
        console.log(devices)
        res.json(devices)
    },

    postCreate: async (req, res, next) => {
        const device = new Device({
            area: req.body.areaId,
            type: req.body.type,
            status: false
        })

        const createdDevice = await device.save()
        if (!createdDevice) {
            res.send('Fail')
        }

        res.json(createdDevice)
    },

    bind: async function (req, res, next) {
        let device = await Device.findById(req.param.deviceId)
        const area = await Area.findById(req.query.areaId)
        device.status = true
        device = device.save()
            .then(suc => {
                area.devices = [...area.devices, device]
                area.save()
                res.send('Successful')
            })
            .catch(err => { res.send('Fail')})
    }
}