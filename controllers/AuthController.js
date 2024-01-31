const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
};

exports.createUser = async (req, res, next) => {
    try {
        if(req.body.confirm) {
            const name = req.body.name;
            await User.updateOne(
                { name: name },
                { $set: { verified: true } }
            );

            res.status(200).json({ msg: 'Confirmation successful!' });
        } else {
            const { name, email, password } = req.body;
        
            const checkUser = await User.findOne({ name, verified: true });
            if(checkUser) {
                return res.status(409).json({ msg: 'User with such name already exists!' });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const newUser = new User({ name, password: hashedPassword, verified: false });
            await newUser.save();
            
            const confirmation = generateRandomCode();

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'kerparvest69@gmail.com',
                    pass: 'qkvv jlus yaux vpfv '
                }
            });

            const mailOptions = {
                from: 'kerparvest69@gmail.com',
                to: email,
                subject: 'Email confirmation',
                text: `Your confirmation number: ${confirmation}`
            }

            conf = confirmation;
            
            const info = await transporter.sendMail(mailOptions);

            console.log('Email sent: ', info.messageId);
            res.status(201).json({ 
                msg: 'Email sent!', 
                confirmation: confirmation,
                user: name
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating user!' });
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ name: username, verified: true });

        if(!user) {
            return res.status(401).json({ error: 'Invalid credentials!' });
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if(passwordsMatch) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

            req.session.token = token;
            return res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials!' });
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Error while logging in!' });
    }
}