const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: String,
  totalAmount: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amountOwed: { type: Number, required: true },
    splitMethod: { type: String, enum: ['equal', 'exact', 'percentage'], required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
