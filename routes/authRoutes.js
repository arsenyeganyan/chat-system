const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/create-user', AuthController.createUser);

router.post('/login', AuthController.login);

module.exports = router;