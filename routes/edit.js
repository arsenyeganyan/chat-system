const express = require('express');
const router = express.Router();
const EditController = require('../controllers/EditController');

router.post('/username', EditController.editUsername);

router.post('/password', EditController.editPassword);

module.exports = router;