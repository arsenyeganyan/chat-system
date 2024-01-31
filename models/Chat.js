const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: {
        type: Array,
        required: [true, 'participants list must be provided']
    },
    messages: {
        type: Array,
        required: [true, 'messages list must be provided']
    }
})

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;