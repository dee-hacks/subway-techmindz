import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: [true, 'Please provide a train number'],
    unique: true,
    trim: true
  },
  trainName: {
    type: String,
    required: [true, 'Please provide a train name'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Please provide source station'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Please provide destination station'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Train', trainSchema);
