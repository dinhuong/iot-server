const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
    },
    
    name: {
        type: String
    },

    type: {
        type: Number, //1-temp, 2-humid 3-lamp 4-pump 5-soil
        enum: [1,2,3,4,5]
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
    },

    topic: {
        type: String
    }
});

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;