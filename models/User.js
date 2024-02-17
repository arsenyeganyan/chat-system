const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'user name must be provided'],
        validate: {
            validator: (value) => Joi.string().validate(value).error === undefined,
            message: 'Invalid name format'
        }
    },
    password: {
        type: String,
        required: [true, 'user password must be provided'],
    },
    verified: {
        type: Boolean,
        required: [true, 'user status must be provided'],
    },
    date: {
        type: String,
        default: Date.now(),
        required: [true, 'date of creation must be provided'],
    },
    chats: {
        type: Array,
        required: [true, 'rooms list must be provided'],
    },
    profile_pic: {
        type: String,
        default: 'img/[removal.ai]_cb530dbb-90ac-4ea4-81cb-53aa823bde6e-user2.png',
        required: [true, 'user image must be provided'],
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;