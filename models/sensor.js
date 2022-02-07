const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
    type: {
        type: Number,
        enum: [0,1,2,3],  //0: temp, 1:light 
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