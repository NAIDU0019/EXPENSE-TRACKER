const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
const Expense = require('../models/ExpenseModel');
const User = require('../models/UserModel');
const expenseService = require('../services/expenseService');
const { Parser } = require('json2csv');



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
    const id = req.params.id.trim();  // Trim the ID to remove any extra newlines

    // Validate ObjectId for the expense ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const { description, totalAmount, participants } = req.body;

    // Validate each participant's user field
    const participantsWithObjectId = await Promise.all(participants.map(async (participant) => {
      console.log('Checking participant:', participant.user); // Log the user ObjectId
      if (!mongoose.Types.ObjectId.isValid(participant.user)) {
        throw new Error(`Invalid user ObjectId: ${participant.user}`);
      }

      const userExists = await User.findById(participant.user);
      if (!userExists) {
        throw new Error(`User not found for ObjectId: ${participant.user}`);
      }

      return {
        ...participant,
        user: new mongoose.Types.ObjectId(participant.user)  // Convert valid user to ObjectId
      };
    }));

    // Find and update the expense
    const expense = await Expense.findByIdAndUpdate(
      id,
      { description, totalAmount, participants: participantsWithObjectId },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.status(200).json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);  // Log the actual error for debugging
    return res.status(500).json({ message: `Error updating expense: ${error.message}` }); // Return the actual error message
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

exports.getUserExpenses = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1; // Get page number from query or default to 1
    const limit = parseInt(req.query.limit) || 10; // Get limit from query or default to 10
    const skip = (page - 1) * limit;

    const expenses = await Expense.find({ createdBy: userId })
      .populate('createdBy', 'name email') // Populate user details
      .skip(skip)
      .limit(limit);

    const totalExpenses = await Expense.countDocuments({ createdBy: userId }); // Count total expenses for pagination
    const totalPages = Math.ceil(totalExpenses / limit); // Calculate total pages

    res.status(200).json({ totalPages, currentPage: page, expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting user expenses' });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get page number from query or default to 1
    const limit = parseInt(req.query.limit) || 10; // Get limit from query or default to 10
    const skip = (page - 1) * limit;

    const expenses = await Expense.find()
      .populate('createdBy', 'name email') // Populate user details
      .skip(skip)
      .limit(limit);

    const totalExpenses = await Expense.countDocuments(); // Count total expenses for pagination
    const totalPages = Math.ceil(totalExpenses / limit); // Calculate total pages

    res.status(200).json({ totalPages, currentPage: page, expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting all expenses' });
  }
};

exports.downloadBalanceSheet = async (req, res) => {
  try {
    // Logic to generate the balance sheet data
    const balanceSheetData = await expenseService.getBalanceSheetData();

    // Convert the data to CSV format
    const csvData = await expenseService.convertToCSV(balanceSheetData);

    // Set the response headers for CSV download
    res.setHeader('Content-Disposition', 'attachment; filename="balance-sheet.csv"');
    res.setHeader('Content-Type', 'text/csv');

    // Send the CSV data as the response
    res.send(csvData);
  } catch (error) {
    console.error('Error downloading balance sheet:', error);
    res.status(500).json({ message: 'Error downloading balance sheet' });
  }
};
