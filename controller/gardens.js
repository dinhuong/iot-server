const Garden = require("../models/garden");

module.exports = {
    getAll : async function (req, res, next) {
        const user = await req.user.populate("gardens")
        console.log(user.gardens)
        return res.json(user.gardens)
    },

    postCeate : async function (req, res, next) {
        const garden = new Garden({
            name: req.body.name,
            address: req.body.req.body.address,
            acreage: req.body.acreage
        });

        const createdGarden = await garden.save()
        if (!createdGarden) {
            res.send("Fail")
        }
        res.json(createdGarden)
    },

    deleteOne : async function (req, res, next) {
        Garden.deleteOne({ _id: req.body.gardenId })
        .then(result => {
            res.status(200).send("Successful")
        })
        .catch(err => {
            res.send("Fail")
        })
    }
}