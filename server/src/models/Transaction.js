import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  checkoutRequestId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  merchantRequestId: {
    type: String,
    required: true,
    trim: true
  },
  mpesaReceiptNumber: {
    type: String,
    trim: true
  },
  transactionDate: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  resultCode: {
    type: Number
  },
  resultDesc: {
    type: String,
    trim: true
  },
  errorMessage: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
transactionSchema.index({ checkoutRequestId: 1 });
transactionSchema.index({ order: 1 });
transactionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Transaction', transactionSchema);