const express = require('express');
const { addExpense, getUserExpenses, getOverallExpenses, downloadBalanceSheet } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addExpense);
router.get('/user', protect, getUserExpenses);
router.get('/overall', getOverallExpenses);
router.get('/user/balance-sheet', protect, downloadBalanceSheet);

module.exports = router;
