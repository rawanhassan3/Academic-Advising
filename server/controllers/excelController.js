const ExcelData = require('../models/ExcelData');
const { parseExcel } = require('../utils/excelParser');
const path = require('path');

// @desc    Upload and parse an Excel file
// @route   POST /api/excel/upload
// @access  Private
const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const parsedData = parseExcel(filePath);

    const excelDoc = await ExcelData.create({
      fileName: req.file.originalname,
      uploadedBy: req.user.id,
      data: parsedData,
      rowCount: parsedData.length,
    });

    res.status(201).json({
      message: 'File uploaded and parsed successfully',
      id: excelDoc._id,
      rowCount: excelDoc.rowCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all uploaded Excel records
// @route   GET /api/excel
// @access  Private
const getAllExcelData = async (req, res) => {
  try {
    const records = await ExcelData.find({ uploadedBy: req.user.id })
      .select('-data')
      .populate('uploadedBy', 'name email');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single Excel record by ID
// @route   GET /api/excel/:id
// @access  Private
const getExcelById = async (req, res) => {
  try {
    const record = await ExcelData.findById(req.params.id).populate(
      'uploadedBy',
      'name email'
    );
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an Excel record
// @route   DELETE /api/excel/:id
// @access  Private
const deleteExcel = async (req, res) => {
  try {
    const record = await ExcelData.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadExcel, getAllExcelData, getExcelById, deleteExcel };
