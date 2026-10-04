import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true
  },
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    default: null
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    default: null
  },
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    default: null
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'WATER', 'FOOD', 'CLEANING', 'GENERAL_ASSISTANCE',
      'MEDICAL_ASSISTANCE', 'SECURITY_CONCERN', 'LOST_CHILD', 'SERIOUS_COACH_ISSUE',
      'PERSONAL_SAFETY', 'FIRE', 'MEDICAL_EMERGENCY', 'ACCIDENT', 'OTHER_EMERGENCY',
      'EMERGENCY_SOS'
    ]
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  foodItems: {
    type: [String],
    default: []
  },
  targetStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  priority: {
    type: String,
    enum: ['NORMAL', 'URGENT', 'CRITICAL'],
    default: 'NORMAL'
  },
  status: {
    type: String,
    enum: ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED', 'REJECTED'],
    default: 'REQUESTED'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

requestSchema.index({ createdAt: -1 });
requestSchema.index({ status: 1, priority: -1 });

export default mongoose.model('Request', requestSchema);
