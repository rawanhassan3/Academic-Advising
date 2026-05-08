const mongoose = require('mongoose');

const excelDataSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // Flexible structure for Excel rows
      required: true,
    },
    rowCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExcelData', excelDataSchema);
