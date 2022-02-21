const Garden = require("../models/garden");
const Area = require("../models/area");

module.exports = {
    getAll : async function (req, res, next) {
        const user = await req.user.populate("gardens")
        console.log(user.gardens)
        return res.json(user.gardens)
    },

    postCeate : async function (req, res, next) {
        const garden = new Garden({
            name: req.body.name,
            address: req.body.address,
            acreage: req.body.acreage
        });

        const createdGarden = await garden.save()
        if (!createdGarden) {
            res.send("Fail")
        }
        let user = req.user
        user.gardens = [...user.gardens, createdGarden._id]
        user.save()
        res.json(createdGarden)
    },

    deleteOne : async function (req, res, next) {
        Garden.deleteOne({ _id: req.body.gardenId })
        .then(result => {
            let user = req.user
            user.gardens.splice(user.gardens.findIndex(g => g==result._id), 1)
            user.save()
            Area.deleteMany(result._id)
            res.status(200).send("Successful")
        })
        .catch(err => {
            res.send("Fail")
        })
    }
}