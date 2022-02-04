const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    garden: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garden',
    }
});

const Sensor = mongoose.model('Sensor', SensorSchema);

module.exports = Sensor;