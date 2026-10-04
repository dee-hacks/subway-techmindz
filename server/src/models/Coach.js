import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema({
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: [true, 'Please provide a train']
  },
  coachNumber: {
    type: String,
    required: [true, 'Please provide a coach number'],
    trim: true
  },
  coachType: {
    type: String,
    required: [true, 'Please provide coach type'],
    enum: ['Sleeper', 'AC 3-Tier', 'AC 2-Tier', 'AC 1-Tier', 'General', 'Chair Car']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please provide total seats'],
    min: [1, 'Total seats must be at least 1']
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

coachSchema.index({ trainId: 1, coachNumber: 1 }, { unique: true });

export default mongoose.model('Coach', coachSchema);
