const express = require('express');
const router = express.Router();
const {
  createRequest, getMyRequests, getAdvisorRequests,
  getAllRequests, approveRequest, rejectRequest,
} = require('../controllers/requestController');
const { protect, adminOnly, advisorOnly } = require('../middleware/authMiddleware');

router.post('/',                    protect,              createRequest);
router.get('/my',                   protect,              getMyRequests);
router.get('/advisor',              protect, advisorOnly, getAdvisorRequests);
router.get('/',                     protect, adminOnly,   getAllRequests);
router.put('/:id/approve',          protect, advisorOnly, approveRequest);
router.put('/:id/reject',           protect, advisorOnly, rejectRequest);

module.exports = router;
