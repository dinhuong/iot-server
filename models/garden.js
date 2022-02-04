const mongoose = require('mongoose');

const GardenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    areas: [{
        name: {
            type: String,
        },
        sensors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Sensor',
            }
        ]
    }],
});

const Garden = mongoose.model('Garden', GardenSchema);

module.exports = Garden;