const Course = require('../models/Course');
const Notification = require('../models/Notification');

// GET /api/courses  — all authenticated users
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('students', 'name universityId');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/my  — student's enrolled courses
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('students', 'name universityId');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses  — admin
const createCourse = async (req, res) => {
  try {
    const { code, name, description, instructor, credits, capacity, schedule, semester, department } = req.body;
    const existing = await Course.findOne({ code: code?.toUpperCase() });
    if (existing) return res.status(400).json({ message: 'Course code already exists' });

    const course = await Course.create({
      code, name, description, instructor, credits, capacity, schedule, semester, department,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/courses/:id  — admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/courses/:id  — admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/courses/:id/enroll  — student
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.students.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    if (course.students.length >= course.capacity) {
      return res.status(400).json({ message: 'Course is at full capacity' });
    }
    course.students.push(req.user._id);
    await course.save();

    // Notify student
    await Notification.create({
      user: req.user._id,
      title: 'Course Enrolled',
      message: `You have successfully enrolled in ${course.name} (${course.code}).`,
      type: 'success',
    });

    res.json({ message: `Enrolled in ${course.name}`, course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/courses/:id/enroll  — student
const unenrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.students = course.students.filter(
      (s) => s.toString() !== req.user._id.toString()
    );
    await course.save();
    res.json({ message: `Unenrolled from ${course.name}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses, getMyCourses, getCourseById,
  createCourse, updateCourse, deleteCourse,
  enrollCourse, unenrollCourse,
};
