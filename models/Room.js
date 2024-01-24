const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    memebers: {
        type: Array,
        required: [true, 'members list must be provided']
    },
    messages: {
        type: Array,
        required: [true, 'message list must be provided']
    }
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room;