const mongoose = require('mongoose');

const GardenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    acreage: {
        type: Number,
    },
    areas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area'
    }]
});

const Garden = mongoose.model('Garden', GardenSchema);

module.exports = Garden;