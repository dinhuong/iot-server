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
        type: Boolean
    },
    
    value: {
        type: Number
    }
});

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;