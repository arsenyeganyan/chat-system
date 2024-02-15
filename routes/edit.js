const express = require('express');
const router = express.Router();
const EditController = require('../controllers/EditController');

router.post('/user', EditController.editUser);

module.exports = router;