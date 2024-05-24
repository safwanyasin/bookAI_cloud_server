const express = require('express');
const { register, login, usersDetails } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/details', usersDetails);

module.exports = router;
