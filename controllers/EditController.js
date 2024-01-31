const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.editUsername = async (req, res, next) => {
    try {
        const token = req.session.token;
        const { username } = req.body;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if(err) {
                return res.status(401).json({ message: 'Invalid token!' });
            }

            const user = await User.findOne({ _id: decoded.userId });
            if(!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            user.name = username;
            await user.save();

            return res.status(200).json({ msg: 'Username changed successfully!' });
        })
    } catch(err) {
        res.status(500).json({ msg: 'Error while editing user info!' });
    }
}

exports.editPassword = async (req, res) => {
    try {
        const token = req.session.token;
        const { old_password, new_password } = req.body;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if(err) {
                return res.status(401).json({ message: 'Invalid token!' });
            }

            const passwordsMatch = await bcrypt.compare(old_password, oldUser.password);
            if(passwordsMatch) {
                const newPassword = await bcrypt.hash(new_password, 10);

                await User.updateOne(
                    { _id: decoded.userId },
                    { $set: { password: newPassword } }
                );

                return res.status(200).json({ msg: 'Username changed successfully!' });
            } else {
                return res.status(401).json({ error: 'Wrong password!' });
            }
        })
    } catch(err) {
        res.status(500).json({ msg: 'Error while editing user info!' });
    }
}