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
    temperature: {
        type: Number,
    },
    humid: {
        type: Number,
    }
});

const Sensor = mongoose.model('Area', AreaSchema);

module.exports = Sensor;