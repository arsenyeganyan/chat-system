const express = require('express')
const router = express.Router();
const PeopleController = require('../controllers/People');

router.get('/get-people', PeopleController.getAllPeople);

module.exports = router;