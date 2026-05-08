const Request = require('../models/Request');
const Notification = require('../models/Notification');
const User = require('../models/User');

// POST /api/requests  — student submits a request
const createRequest = async (req, res) => {
  try {
    const { type, subject, description } = req.body;
    const student = await User.findById(req.user._id).populate('advisor');

    const request = await Request.create({
      student: req.user._id,
      advisor: student.advisor?._id || null,
      type, subject, description,
    });

    // Notify advisor if assigned
    if (student.advisor) {
      await Notification.create({
        user: student.advisor._id,
        title: 'New Student Request',
        message: `${student.name} submitted a new request: "${subject}"`,
        type: 'info',
        link: '/advisor',
      });
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests/my  — student sees their own requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ student: req.user._id })
      .populate('advisor', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests/advisor  — advisor sees requests from their students
const getAdvisorRequests = async (req, res) => {
  try {
    const requests = await Request.find({ advisor: req.user._id })
      .populate('student', 'name email universityId')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/requests  — admin sees all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('student', 'name email universityId')
      .populate('advisor', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/requests/:id/approve  — advisor/admin
const approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('student');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'approved';
    request.advisorNote = req.body.advisorNote || '';
    await request.save();

    // Notify student
    await Notification.create({
      user: request.student._id,
      title: 'Request Approved ✅',
      message: `Your request "${request.subject}" has been approved.`,
      type: 'success',
      advisorNote: request.advisorNote,
      link: '/student',
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/requests/:id/reject  — advisor/admin
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('student');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    request.advisorNote = req.body.advisorNote || '';
    await request.save();

    // Notify student
    await Notification.create({
      user: request.student._id,
      title: 'Request Rejected ❌',
      message: `Your request "${request.subject}" was rejected.`,
      type: 'warning',
      advisorNote: request.advisorNote,
      link: '/student',
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest, getMyRequests, getAdvisorRequests,
  getAllRequests, approveRequest, rejectRequest,
};
