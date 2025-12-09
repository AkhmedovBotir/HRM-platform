const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  username: {
    type: String,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  middleName: {
    type: String,
    required: true,
    trim: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: /^\+998\d{9}$/,
    trim: true,
  },
  hireDate: {
    type: Date,
    required: true,
  },
  passport: {
    type: String,
    required: true,
    match: /^[A-Z]{2}\d{7}$/,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    required: true,
  },
  isTerminated: {
    type: Boolean,
    default: false,
  },
  terminationDate: {
    type: Date,
  },
  terminationReason: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index to ensure passport is unique per company
employeeSchema.index({ companyId: 1, passport: 1 }, { unique: true });

// Index for unique username per company
employeeSchema.index({ companyId: 1, username: 1 }, { unique: true, sparse: true });

// Hash password before saving
employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
employeeSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);

