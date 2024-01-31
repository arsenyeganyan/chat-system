const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

async function messageSent(sender, receiver, msg) {
    const user1 = await User.findOne({ name: sender, verified: true });
    const user2 = await User.findOne({ name: receiver, verified: true });
    
    const id1 = user1._id;
    const id2 = user2._id;

    const message = new Message({ sender: id1, receiver: id2, content: msg });
    await message.save();
    
    const messageId = message._id;
    
    const chat = await Chat.findOne({ participants: { $all: [id1, id2] } });

    if(chat) {
        await Chat.updateOne(
            { _id: chat._id }, 
            { $push: { messages: { messageId } }}
        );

        await User.updateOne(
            { _id: { $in: [id1, id2] } },
            { $push: { chats: newChat._id  } },
        );
    } else {
        const newChat = new Chat({ 
            participants: [id1, id2], 
            messages: [{ messageId }],
        });

        await newChat.save();

        await User.updateOne(
            { _id: { $in: [id1, id2] } },
            { $push: { chats: newChat._id  } },
        );
    }
}

module.exports = { messageSent };