const User = require('../models/User');

// POST /api/profile/setup
// Protected route — req.userId comes from the requireAuth middleware
const setupProfile = async (req, res) => {
  try {
    const {
      height,
      weightRange,
      fitnessGoal,
      activityLevel,
      weightliftingFrequency,
      cardioType,
      cardioFrequency,
    } = req.body;

    if (!height || !weightRange || !fitnessGoal || !activityLevel) {
      return res.status(400).json({
        message: 'Height, weight range, fitness goal, and activity level are required.',
      });
    }

    const validGoals = ['Lose Weight', 'Maintain Weight', 'Build Muscle'];
    if (!validGoals.includes(fitnessGoal)) {
      return res.status(400).json({ message: 'Invalid fitness goal.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        height,
        weightRange,
        fitnessGoal,
        activityLevel,
        weightliftingFrequency,
        cardioType,
        cardioFrequency,
        profileComplete: true,
      },
      { new: true, runValidators: true }
    ).select('-password -verificationToken -verificationTokenExpires');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'Profile setup complete.',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Profile setup error:', err);
    res.status(500).json({ message: 'Server error during profile setup.' });
  }
};

// GET /api/profile
// Protected route — used by the dashboard
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      '-password -verificationToken -verificationTokenExpires'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

module.exports = { setupProfile, getProfile };
