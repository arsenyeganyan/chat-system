const { Chat } = require('../models/Chat');
const User = require('../models/User');

const getAllChats = async () => {
    

    const chat = await Chat.find();
    return chat;
}

const getAllMessagesInAChat = async () => {
    
}

module.exports = { 
    getAllChats,
    getAllMessagesInAChat 
};