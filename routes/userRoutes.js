const express = require('express');
const { createUser, login, getUserDetails } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const { addExpense } = require('../controllers/expenseController'); 

router.post('/register', createUser);
router.post('/login', login);
router.get('/me', auth, getUserDetails);

router.post('/add', addExpense);

module.exports = router;
