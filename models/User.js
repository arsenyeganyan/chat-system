const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'user name must be provided'],
    },
    password: {
        type: String,
        required: [true, 'user password must be provided'],
    },
    verfied: {
        type: Boolean,
        required: [true, 'user status must be provided'],
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;