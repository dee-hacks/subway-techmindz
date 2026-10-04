import Coach from '../models/Coach.js';

export const getCoaches = async (req, res) => {
  try {
    const { trainId } = req.query;
    const query = trainId ? { trainId } : {};
    const coaches = await Coach.find(query)
      .populate('trainId', 'trainNumber trainName')
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 });
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id)
      .populate('trainId', 'trainNumber trainName')
      .populate('assignedStaff', 'name email');

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createCoach = async (req, res) => {
  try {
    const coach = await Coach.create(req.body);
    res.status(201).json(coach);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    await coach.populate('trainId', 'trainNumber trainName');
    await coach.populate('assignedStaff', 'name email');

    res.json(coach);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    await Coach.findByIdAndDelete(req.params.id);

    res.json({ message: 'Coach deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
