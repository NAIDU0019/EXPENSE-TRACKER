const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/expenses', expenseController.addExpense);
router.get('/expenses', expenseController.getExpenses);
router.get('/expenses/:id', expenseController.getExpense);
router.put('/expenses/:id', expenseController.updateExpense);
router.delete('/expenses/:id', expenseController.deleteExpense);

router.get('/expenses/user/:id', expenseController.getUserExpenses);
router.get('/expenses', expenseController.getAllExpenses);
router.get('/balance-sheet', expenseController.downloadBalanceSheet);
module.exports = router;
