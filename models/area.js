const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
    garden: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garden',
    },
    acreage: {
        type: Number,
    },
    name: {
        type: String,
    },
    position: {
        type: String,
    },
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
    }]
});

const Area = mongoose.model('Area', AreaSchema);

module.exports = Area;