import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  partySize: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  specialRequests: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  tableNumber: {
    type: String,
    trim: true
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
reservationSchema.index({ user: 1, date: 1 });
reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ status: 1 });

// Validate reservation date is in the future
reservationSchema.pre('save', function(next) {
  if (this.date < new Date()) {
    next(new Error('Reservation date must be in the future'));
  } else {
    next();
  }
});

export default mongoose.model('Reservation', reservationSchema);