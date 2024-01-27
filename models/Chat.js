const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: [true, 'sender must be provided']
    },
    receiver: {
        type: String,
        required: [true, 'receiver must be provided']
    },
    content: {
        type: String,
        required: [true, 'content must be provided']
    },
    date: {
        type: Number,
        default: Date.now(),
        required: [true, 'content must be provided']
    },
});

const chatSchema = new mongoose.Schema({
    participants: {
        type: Array,
        default: new Array(2),
        required: [true, 'participants list must be provided']
    },
    messages: {
        type: [messageSchema],
        required: [true, 'messages list must be provided']
    }
})

const Message = mongoose.model('Message', messageSchema);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = { Chat, Message };