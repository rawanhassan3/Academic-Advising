const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: ['course_registration', 'schedule_change', 'academic_note', 'grade_dispute', 'other'],
      required: [true, 'Request type is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    advisorNote: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
