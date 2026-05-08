const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    instructor: {
      type: String,
      trim: true,
      default: '',
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: 1,
      max: 6,
    },
    capacity: {
      type: Number,
      default: 30,
    },
    schedule: {
      type: String,
      trim: true,
      default: '',
    },
    semester: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Virtual for enrolled count
courseSchema.virtual('enrolledCount').get(function () {
  return this.students.length;
});

courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
