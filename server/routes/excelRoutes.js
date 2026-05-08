const express = require('express');
const router = express.Router();
const {
  uploadExcel,
  getAllExcelData,
  getExcelById,
  deleteExcel,
} = require('../controllers/excelController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload.single('file'), uploadExcel);
router.get('/', protect, getAllExcelData);
router.get('/:id', protect, getExcelById);
router.delete('/:id', protect, deleteExcel);

module.exports = router;
