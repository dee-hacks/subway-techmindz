import User from '../models/User.js';

export const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, email, password, assignedTrain } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Staff member already exists' });
    }

    const staff = await User.create({
      name,
      email,
      password,
      role: 'staff',
      assignedTrain: assignedTrain || null
    });

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      assignedTrain: staff.assignedTrain,
      isActive: staff.isActive,
      createdAt: staff.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staff = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email, assignedTrain: req.body.assignedTrain, isActive: req.body.isActive },
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      assignedTrain: staff.assignedTrain,
      isActive: staff.isActive,
      createdAt: staff.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
