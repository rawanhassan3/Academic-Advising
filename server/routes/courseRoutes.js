const express = require('express');
const router = express.Router();
const {
  getCourses, getMyCourses, getCourseById,
  createCourse, updateCourse, deleteCourse,
  enrollCourse, unenrollCourse,
} = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',          protect,              getCourses);
router.get('/my',        protect,              getMyCourses);
router.get('/:id',       protect,              getCourseById);
router.post('/',         protect, adminOnly,   createCourse);
router.put('/:id',       protect, adminOnly,   updateCourse);
router.delete('/:id',    protect, adminOnly,   deleteCourse);
router.post('/:id/enroll',   protect,          enrollCourse);
router.delete('/:id/enroll', protect,          unenrollCourse);

module.exports = router;
