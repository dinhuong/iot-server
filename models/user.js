const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gardens: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garden',
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;