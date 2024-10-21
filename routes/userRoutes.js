const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);  // Ensure this is defined
router.post('/login', loginUser);        // Also ensure other routes are correct

module.exports = router;
