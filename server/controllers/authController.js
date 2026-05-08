const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, universityId, password } = req.body;
  try {
    const existingUser = await User.findOne({ 
      $or: [{ email }, { universityId }] 
    });
    
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'University ID';
      return res.status(400).json({ message: `${field} already in use` });
    }

    const role = 'student'; // Always assign student
    const user = await User.create({ name, email, universityId, password, role });
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      universityId: user.universityId,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body; // 'email' field used for both email or ID
  try {
    // Find user by email OR universityId
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { universityId: email }
      ]
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      universityId: user.universityId,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
