const User = require('../models/User');
const Course = require('../models/Course');
const Request = require('../models/Request');
const Notification = require('../models/Notification');

// GET /api/notifications/my  — authenticated user
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    res.json(n);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notifications/read-all
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/stats  — admin
const getAdminStats = async (req, res) => {
  try {
    const [totalStudents, totalAdvisors, totalCourses, totalRequests,
           pendingRequests, approvedRequests, rejectedRequests] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'advisor' }),
      Course.countDocuments(),
      Request.countDocuments(),
      Request.countDocuments({ status: 'pending' }),
      Request.countDocuments({ status: 'approved' }),
      Request.countDocuments({ status: 'rejected' }),
    ]);

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.countDocuments({
      role: 'student',
      createdAt: { $gte: sevenDaysAgo },
    });

    // Course enrollment stats
    const courses = await Course.find().select('name code students capacity');
    const courseStats = courses.map((c) => ({
      name: c.name, code: c.code,
      enrolled: c.students.length, capacity: c.capacity,
      percentage: c.capacity > 0 ? Math.round((c.students.length / c.capacity) * 100) : 0,
    }));

    // Students without advisor
    const unassignedStudents = await User.countDocuments({ role: 'student', advisor: null });

    res.json({
      totalStudents, totalAdvisors, totalCourses, totalRequests,
      pendingRequests, approvedRequests, rejectedRequests,
      recentRegistrations, courseStats, unassignedStudents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyNotifications, markAsRead, markAllRead, getAdminStats };
