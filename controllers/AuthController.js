const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const generateRandomCode = require('../utils/randCode');
const sendMail = require('../utils/sendMail');

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

            const checkUser = await User.findOne({ name, email, verified: true });
            if(checkUser) {
                return res.status(409).json({ msg: 'User already exists!' });
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const userSample = {
                name: name,
                email: email,
                password: hashedPassword,
                verified: false,
            }

            const schema = Joi.object({
                name: Joi.string().min(4).max(15).required(),
                email: Joi.string(),
                password: Joi.string().required(),
                verified: Joi.boolean().required(),
            });

            const { error, value } = schema.validate(userSample);
            
            if(error){
                console.log(error.details[0].message);
                return res
                    .status(400)
                    .json({
                        msg: 'Database validation failed, due to wrong details!'
                    });
            } else {
                const newUser = new User(value);
                await newUser.save(); 
                
                const confirmation = generateRandomCode();

                await sendMail(
                    `Your email confirmation code: ${confirmation}`,
                    email
                );

                res.status(200).json({ 
                    msg: 'Email sent!', 
                    confirmation: confirmation,
                    user: name
                });
            }
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating user!' });
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ name: username, verified: true });

        if(!user) {
            user = await User.findOne({ email: username, verified: true });

            if(!user) {
                return res.status(401).json({ error: 'Invalid credentials!' });
            }
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