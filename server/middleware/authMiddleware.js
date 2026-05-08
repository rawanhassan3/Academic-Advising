const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin-only guard
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

// Advisor or Admin guard
const advisorOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'advisor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Advisors only' });
  }
};

// Flexible role guard — roleGuard('admin', 'advisor')
const roleGuard = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: `Access denied: requires ${roles.join(' or ')} role` });
  }
};

module.exports = { protect, adminOnly, advisorOnly, roleGuard };
