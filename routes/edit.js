const express = require('express');
const router = express.Router();
const EditController = require('../controllers/EditController');

router.patch('/user', EditController.editUser);
router.patch('/password', EditController.editPassword);
router.patch('/reset-password', EditController.resetPassword);

module.exports = router;