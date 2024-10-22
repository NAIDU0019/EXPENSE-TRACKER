const { ObjectId } = require('mongoose');
const Expense = require('../models/ExpenseModel');
const User = require('../models/UserModel');
const expenseService = require('../services/expenseService');
exports.addExpense = async (req, res) => {
  console.log('req.body:', req.body);
  try {
    const { description, totalAmount, createdBy, participants, splitMethod } = req.body;
    console.log('calculatedSplits:', expenseService.calculateSplits(participants, totalAmount, splitMethod));
    calculatedSplits = expenseService.calculateSplits(participants, totalAmount, splitMethod);
    const expense = new Expense({
      description,
      totalAmount,
      createdBy, // no need to wrap it in ObjectId
      participants: calculatedSplits,
    });
    console.log('expense:', expense);
    const savedExpense = await expense.save();
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Error adding expense' });
  }
};
/**
 * @function getExpenses
 * @description Get all expenses
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('createdBy', 'name email');
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting expenses' });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const expense = await Expense.findById(id).populate('createdBy', 'name email');
    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
    } else {
      res.status(200).json(expense);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting expense' });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const { description, totalAmount, participants } = req.body;
    const expense = await Expense.findByIdAndUpdate(id, { description, totalAmount, participants }, { new: true });
    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
    } else {
      res.status(200).json(expense);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating expense' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const id = req.params.id;
    await Expense.findByIdAndRemove(id);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting expense' });
  }
};
