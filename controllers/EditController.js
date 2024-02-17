const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const random = require('../utils/randNum');

exports.editUser = (req, res) => {
    const token = req.session.token;
    const { username } = req.body;
    const profile_picture = req.file;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({ message: 'Invalid token!' });
        }

        let updateObj = {};
        if(username) {
            updateObj.name = username;
        }
        if(profile_picture) {
            const rand = random(1000, 9999);
            const savePath = path.join(__dirname, '..', 'media', 'pictures', `${rand}.jpg`);
            
            fs.writeFile(savePath, profile_picture.buffer, (err) => {
                if(err) {
                    console.log('Error saving file:', err);
                    return;
                }
                
                console.log('File saved successfully!');
            });

            updateObj.profile_pic = savePath;
        }

        User.findByIdAndUpdate(
            { _id: decoded.userId },
            { $set: updateObj },
            { new: true }
        )
            .then(updatedPerson => {
                if(updatedPerson) {
                    console.log(`User with the id: ${decoded.userId} updated successfully!`);
                    return res.status(200).json({ msg: 'User data updated successfully!' });
                } else {
                    console.log('Could not find user!');
                    return res.status(404).json({ msg: 'User not found' });
                }
            })
            .catch((err) => {
                console.log('Error while editing user info: \n', err);
                return res.status(500).json({ msg: 'Error while editing user info!' });
            });
    })
}

exports.editPassword = async (req, res) => {
    try {
        const token = req.session.token;
        const { old_password, new_password } = req.body;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if(err) {
                console.log(err);
                return res.status(401).json({ message: 'Invalid token or something went wrong!' });
            }

            const user = await User.findById({ _id: decoded.userId });
            const passToCompare = user.password;
            console.log(passToCompare);

            const matches = await bcrypt.compare(old_password, passToCompare);
            
            if(!matches) {
                console.log(err);
                return res.status(401).json({ msg: "Passwords do not match! (backend) "});
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);

            await User.updateOne(
                { _id: decoded.userId },
                { $set: { password: hashedPassword } }
            );

            return res.status(200).json({ msg: 'User password changed successfully!' });
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Error while editing user info!' });
    }
}