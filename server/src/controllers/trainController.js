import Train from '../models/Train.js';
import Coach from '../models/Coach.js';

export const getTrains = async (req, res) => {
  try {
    const trains = await Train.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTrain = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    res.json(train);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createTrain = async (req, res) => {
  try {
    const train = await Train.create(req.body);
    res.status(201).json(train);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateTrain = async (req, res) => {
  try {
    const train = await Train.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    res.json(train);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteTrain = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    train.isActive = false;
    await train.save();

    res.json({ message: 'Train deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
