const { Chat } = require('../models/Chat');

const getAllChats = async () => {
    const chat = await Chat.find({});
    return chat;
}