const { Chat, Message } = require('../models/Chat');
const User = require('../models/User');

async function messageSent(sender, receiver, msg) {
    const message = new Message({ sender, receiver, content: msg });
    await message.save();

    const chat = await Chat.findOne({ participants: [sender, receiver] })

    if(chat) {
        chat.messages.push(message);
    } else {
        const newChat = new Chat({ participants: [sender, receiver], messages: [message]});
        await newChat.save();
    }
}

module.exports = { messageSent };