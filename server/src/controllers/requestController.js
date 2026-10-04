import Request from '../models/Request.js';
import Seat from '../models/Seat.js';
import Coach from '../models/Coach.js';
import Train from '../models/Train.js';
import { getIO } from '../socket/io.js';

const generateRequestId = () => {
  return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createRequest = async (req, res) => {
  try {
    const { seatId, category, description, foodItems } = req.body;

    const seat = await Seat.findById(seatId).populate('coachId');
    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    const coach = await Coach.findById(seat.coachId._id).populate('trainId').populate('assignedStaff');
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    const emergencyCategories = [
      'PERSONAL_SAFETY', 'FIRE', 'MEDICAL_EMERGENCY', 'ACCIDENT', 'OTHER_EMERGENCY'
    ];

    const urgentCategories = [
      'MEDICAL_ASSISTANCE', 'SECURITY_CONCERN', 'LOST_CHILD', 'SERIOUS_COACH_ISSUE'
    ];

    let priority = 'NORMAL';
    if (emergencyCategories.includes(category)) {
      priority = 'CRITICAL';
    } else if (urgentCategories.includes(category)) {
      priority = 'URGENT';
    }

    const request = await Request.create({
      requestId: generateRequestId(),
      trainId: coach.trainId._id,
      coachId: coach._id,
      seatId: seat._id,
      category,
      description: description || '',
      foodItems: foodItems || [],
      targetStaff: coach.assignedStaff ? coach.assignedStaff._id : null,
      priority,
      status: 'REQUESTED'
    });

    const populatedRequest = await Request.findById(request._id)
      .populate('trainId', 'trainNumber trainName')
      .populate('coachId', 'coachNumber coachType')
      .populate('seatId', 'seatNumber qrId')
      .populate('targetStaff', 'name email');

    // Notify connected staff in real time
    const io = getIO();
    if (io) {
      io.emit('new_request', populatedRequest);
    }

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generic emergency from the front page — works with NO login, NO QR scan
// and NO personal info. Automatically uses any previously-scanned seat or GPS
// location if available, but NEVER fails if neither is present.
export const createGenericEmergency = async (req, res) => {
  try {
    const { seatId, description, gps } = req.body || {};

    let trainId = null;
    let coachId = null;
    let storedSeatId = null;
    let location = null;

    // 1) If the passenger scanned a QR earlier, reuse the stored seat.
    if (seatId) {
      const seat = await Seat.findById(seatId)
        .populate({ path: 'coachId', populate: { path: 'trainId' } });
      if (seat && seat.coachId) {
        storedSeatId = seat._id;
        coachId = seat.coachId._id;
        trainId = seat.coachId.trainId ? seat.coachId.trainId._id : null;
        location = {
          type: 'seat',
          trainNumber: seat.coachId.trainId ? seat.coachId.trainId.trainNumber : null,
          coachNumber: seat.coachId.coachNumber,
          seatNumber: seat.seatNumber
        };
      }
    }

    // 2) Otherwise, or in addition, use GPS coordinates if provided (optional).
    if (gps && gps.lat != null && gps.lng != null) {
      location = { ...(location || {}), type: 'gps', lat: gps.lat, lng: gps.lng };
    }

    const request = await Request.create({
      requestId: generateRequestId(),
      trainId,
      coachId,
      seatId: storedSeatId,
      category: 'EMERGENCY_SOS',
      description: description || 'Emergency SOS from the front page',
      priority: 'CRITICAL',
      status: 'REQUESTED',
      location
    });

    // Immediately alert the on-board staff.
    const io = getIO();
    if (io) {
      io.emit('new_request', request);
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { status, priority, trainId, seatId, qrId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (trainId) query.trainId = trainId;
    // A passenger's requests are unique to their own seat (their own interface).
    if (seatId) query.seatId = seatId;
    if (qrId) {
      const seat = await Seat.findOne({ qrId });
      if (seat) query.seatId = seat._id;
    }

    const requests = await Request.find(query)
      .populate('trainId', 'trainNumber trainName')
      .populate('coachId', 'coachNumber coachType')
      .populate('seatId', 'seatNumber qrId')
      .populate('assignedStaff', 'name email')
      .populate('targetStaff', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('trainId', 'trainNumber trainName')
      .populate('coachId', 'coachNumber coachType')
      .populate('seatId', 'seatNumber qrId')
      .populate('assignedStaff', 'name email')
      .populate('targetStaff', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;

    if (status === 'ACCEPTED') {
      request.acceptedAt = Date.now();
      request.assignedStaff = req.user._id;
    }

    if (status === 'RESOLVED') {
      request.resolvedAt = Date.now();
    }

    await request.save();

    const populatedRequest = await Request.findById(request._id)
      .populate('trainId', 'trainNumber trainName')
      .populate('coachId', 'coachNumber coachType')
      .populate('seatId', 'seatNumber qrId')
      .populate('assignedStaff', 'name email')
      .populate('targetStaff', 'name email');

    res.json(populatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRequestByQrId = async (req, res) => {
  try {
    const { qrId } = req.params;
    const seat = await Seat.findOne({ qrId }).populate('coachId');

    if (!seat) {
      return res.status(404).json({ message: 'Invalid QR code' });
    }

    const coach = await Coach.findById(seat.coachId._id).populate('trainId');

    res.json({
      train: coach.trainId,
      coach: {
        _id: coach._id,
        coachNumber: coach.coachNumber,
        coachType: coach.coachType
      },
      seat: {
        _id: seat._id,
        seatNumber: seat.seatNumber,
        qrId: seat.qrId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
