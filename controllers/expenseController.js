const Expense = require('../models/expenseModel');

exports.addExpense = async (req, res) => {
    try {
        const { amount, splitMethod, participants } = req.body;
        const expense = new Expense({
            user: req.user.id,
            amount,
            splitMethod,
            participants
        });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserExpenses = async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
};

exports.getOverallExpenses = async (req, res) => {
    const expenses = await Expense.find();
    res.json(expenses);
};

// Add balance sheet generation logic
exports.downloadBalanceSheet = async (req, res) => {
    // Logic for downloading balance sheet (PDF/CSV)
    res.json({ message: 'Balance sheet download feature is under development' });
};
