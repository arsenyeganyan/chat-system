const express = require('express');
const router = express.Router();
const EditController = require('../controllers/EditController');

router.patch('/user', EditController.editUser);
router.patch('/password', EditController.editPassword);

module.exports = router;