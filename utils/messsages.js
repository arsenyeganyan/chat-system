const Message = require('../models/Message');

async function messageSent(sender, receiver, message) {
    const message = new Message({ sender, receiver, content: message });
    await message.save();
}

module.exports = { messageSent }