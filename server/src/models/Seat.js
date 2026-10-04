import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: [true, 'Please provide a coach']
  },
  seatNumber: {
    type: String,
    required: [true, 'Please provide a seat number'],
    trim: true
  },
  qrId: {
    type: String,
    required: [true, 'Please provide a QR ID'],
    unique: true,
    trim: true
  },
  passengerName: {
    type: String,
    trim: true,
    default: null
  },
  passengerAge: {
    type: Number,
    min: [1, 'Age must be at least 1'],
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

seatSchema.index({ coachId: 1, seatNumber: 1 }, { unique: true });

export default mongoose.model('Seat', seatSchema);
