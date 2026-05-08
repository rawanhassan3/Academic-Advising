const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile,
  getAllUsers, getStudents, getAdvisors,
  deleteUser, assignAdvisor, createAdvisor, updateUser,
} = require('../controllers/userController');
const { protect, adminOnly, advisorOnly } = require('../middleware/authMiddleware');

router.get('/profile',              protect,              getProfile);
router.put('/profile',              protect,              updateProfile);
router.get('/',                     protect, adminOnly,   getAllUsers);
router.get('/students',             protect, advisorOnly, getStudents);
router.get('/advisors',             protect, adminOnly,   getAdvisors);
router.post('/advisor',             protect, adminOnly,   createAdvisor);
router.put('/:id',                  protect, adminOnly,   updateUser);
router.delete('/:id',               protect, adminOnly,   deleteUser);
router.put('/:id/assign-advisor',   protect, adminOnly,   assignAdvisor);

module.exports = router;
