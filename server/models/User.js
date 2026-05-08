const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      match: [
        /^[a-zA-Z\u0600-\u06FF\s.]{2,50}$/,
        'Name must be 2–50 characters and can contain letters, spaces, and dots',
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@(msa\.edu\.eg|gmail\.com|test\.com)$/,
        'Please enter a valid email (@msa.edu.eg, @gmail.com, or @test.com)',
      ],
    },
    universityId: {
      type: String,
      unique: true,
      sparse: true,   // allows null for advisors/admins without breaking uniqueness
      trim: true,
      match: [
        /^\d{6}$/,
        'University ID must be exactly 6 digits',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: ['student', 'advisor', 'admin'],
      default: 'student',
    },
    // Profile extras
    phone:      { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: '' },
    semester:   { type: String, trim: true, default: '' },
    gpa:        { type: Number, default: 0, min: 0, max: 4 },
    avatar:     { type: String, default: '' },
    // Advisor assigned to a student
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);


// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
