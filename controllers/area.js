const Garden = require("../models/garden");
const Area = require("../models/area")

module.exports = {
    getAll : async function (req, res, next) {
        let garden = await Garden.findById(req.query.gardenId)
        garden = await garden.populate('areas')
        console.log(garden.areas)
        return res.json(garden.areas)
    },

    getOne: async function (req, res, next) {
        let area = await Garden.findById(req.param.areaId)
        return res.json(area)
    },

    postCeate : async function (req, res, next) {
        const area = new Area({
            garden: req.body.garden,
            name: req.body.name,
            position: req.body.position,
            acreage: req.body.acreage
        });

        const createdArea = await area.save()
        if (!createdArea) {
            res.send("Fail")
        }
        let garden = await Garden.findById(req.body.garden)
        garden.areas = [...garden.areas, createdArea._id]
        garden.save()
        res.json(createdArea)
    },

    deleteOne : async function (req, res, next) {
        Area.findByIdAndDelete({ _id: req.query.areaId })
        .then(async (result) => {
            let garden = await Garden.findById(result.garden)
            garden.areas.splice(garden.areas.findIndex(a => a==result._id), 1)
            await garden.save()
            res.status(200).send("Successful")
        })
        .catch(err => {
            res.send("Fail")
        })
    },

    deleteMany: (gardenId) => {
        Area.deleteMany({ garden : gardenId})
    }
}