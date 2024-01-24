const User = require('../models/User');

function deleteUsers() {
    User.deleteMany({ date: { $lt: Date.now() - 60 * 1000 }, verified: false })
        .then((result) => {
            console.log(`${result.deletedCount} documents deleted`);
        })
        .catch(err => console.error(err))
}

module.exports = { deleteUsers };