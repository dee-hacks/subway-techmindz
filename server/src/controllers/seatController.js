import Seat from '../models/Seat.js';

export const getSeats = async (req, res) => {
  try {
    const { coachId, qrId } = req.query;
    let query = {};

    if (coachId) query.coachId = coachId;
    if (qrId) query.qrId = qrId;

    const seats = await Seat.find(query).populate('coachId').sort({ seatNumber: 1 });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id).populate('coachId');

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    res.json(seat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSeatByQrId = async (req, res) => {
  try {
    const seat = await Seat.findOne({ qrId: req.params.qrId })
      .populate({
        path: 'coachId',
        populate: { path: 'trainId' }
      });

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    res.json({
      seat,
      coach: seat.coachId,
      train: seat.coachId ? seat.coachId.trainId : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createSeat = async (req, res) => {
  try {
    const seat = await Seat.create(req.body);
    res.status(201).json(seat);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Seat with this QR ID already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSeat = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    res.json(seat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    await Seat.findByIdAndDelete(req.params.id);

    res.json({ message: 'Seat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
