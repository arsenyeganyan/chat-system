const mongoose = require('mongoose');

const poepleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'chatter name must be provided']
    }
});

const People = mongoose.model('People', poepleSchema);

module.exports = People;