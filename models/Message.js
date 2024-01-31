const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'sender must be provided']
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
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

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;