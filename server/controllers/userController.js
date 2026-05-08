const User = require('../models/User');
const sendEmail = require('../utils/emailSender');

// Helper: generate a password that meets strength requirements
const generateSecurePassword = () => {
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower   = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const all     = upper + lower + numbers + special;

  let pwd = '';
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += special[Math.floor(Math.random() * special.length)];
  pwd += numbers[Math.floor(Math.random() * numbers.length)];
  for (let i = 0; i < 9; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }
  // Shuffle
  return pwd.split('').sort(() => Math.random() - 0.5).join('');
};

// ─── PROFILE ─────────────────────────────────────────────
// GET /api/users/profile  (any authenticated user)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('advisor', 'name email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/profile  (any authenticated user)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, phone, department, semester, password } = req.body;
    if (name)       user.name       = name;
    if (email)      user.email      = email;
    if (phone)      user.phone      = phone;
    if (department) user.department = department;
    if (semester)   user.semester   = semester;
    if (password)   user.password   = password;

    const updated = await user.save();
    res.json({
      _id: updated._id, name: updated.name, email: updated.email,
      role: updated.role, phone: updated.phone,
      department: updated.department, semester: updated.semester,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ADMIN: ALL USERS ────────────────────────────────────
// GET /api/users  (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('advisor', 'name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/students  (admin / advisor)
const getStudents = async (req, res) => {
  try {
    const query = { role: 'student' };
    // Advisors only see their own assigned students
    if (req.user.role === 'advisor') {
      query.advisor = req.user._id;
    }
    const students = await User.find(query)
      .select('-password')
      .populate('advisor', 'name email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/advisors  (admin)
const getAdvisors = async (req, res) => {
  try {
    const advisors = await User.find({ role: 'advisor' }).select('-password');
    res.json(advisors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/:id  (admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.role === 'admin' && req.user.id !== user.id) {
       // Prevent deleting other admins unless you are the super admin (optional logic)
    }

    // CLEANUP: Delete associated requests and notifications
    const Request = require('../models/Request');
    const Notification = require('../models/Notification');
    
    await Promise.all([
      Request.deleteMany({ $or: [{ student: user._id }, { advisor: user._id }] }),
      Notification.deleteMany({ user: user._id })
    ]);

    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed: ' + error.message });
  }
};

// PUT /api/users/:id/assign-advisor  (admin)
const assignAdvisor = async (req, res) => {
  try {
    const { advisorId } = req.body;
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    const advisor = await User.findById(advisorId);
    if (!advisor || advisor.role !== 'advisor') {
      return res.status(404).json({ message: 'Advisor not found' });
    }
    student.advisor = advisorId;
    await student.save();
    res.json({ message: 'Advisor assigned successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users/advisor  (admin) — create advisor
const createAdvisor = async (req, res) => {
  const { name, email, universityId, password } = req.body;
  try {
    if (!password) return res.status(400).json({ message: 'Password is required' });
    
    const existingUser = await User.findOne({
      $or: [{ email }, ...(universityId ? [{ universityId }] : [])],
    });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'University ID';
      return res.status(400).json({ message: `${field} already in use` });
    }

    const user = await User.create({
      name, email, universityId: universityId || undefined,
      password, role: 'advisor',
    });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      universityId: user.universityId, role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id  (admin) — update any user
const updateUser = async (req, res) => {
  try {
    console.log(`[Admin] Updating user ${req.params.id} with data:`, req.body);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found in DB' });

    const fields = ['name', 'email', 'universityId', 'role', 'department', 'semester', 'phone', 'gpa'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    const updated = await user.save();
    console.log(`[Admin] User ${req.params.id} updated successfully`);
    res.json(updated);
  } catch (error) {
    console.error('[Update Error Details]:', error);
    const status = (error.name === 'ValidationError' || error.code === 11000) ? 400 : 500;
    let message = error.message;
    if (error.code === 11000) message = 'Duplicate Data: Email or ID already exists';
    res.status(status).json({ message });
  }
};

module.exports = {
  getProfile, updateProfile,
  getAllUsers, getStudents, getAdvisors,
  deleteUser, assignAdvisor, createAdvisor, updateUser,
};
