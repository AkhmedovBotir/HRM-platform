const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/adminController');
const { validateLogin } = require('../validators/adminValidator');
const authenticate = require('../middlewares/auth');

// Login route
router.post('/login', validateLogin, login);

// Get current admin route
router.get('/me', authenticate, getMe);

module.exports = router;

