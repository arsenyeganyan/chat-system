const express = require('express');
const router = express.Router();
const EditController = require('../controllers/EditController');

router.patch('/password', EditController.resetPassword);

module.exports = router;