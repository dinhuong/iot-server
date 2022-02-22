const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
    },
    
    type: {
        type: Number, //1-temp, 2-humid 3-lamp 4-pump
        enum: [1,2,3,4]
    },

    status: {
        type: Boolean,
        default: false
    },
    
    value: {
        type: Number,
        default: 0
    },

    position: {
        type: String,
        default: 'abc'
    }
});

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;