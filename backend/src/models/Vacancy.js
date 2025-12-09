const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  nom: {
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
  daraja: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['fulltime', 'parttime'],
    required: true,
  },
  workScheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkScheduleTemplate',
    required: true,
  },
  oylik: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  responsibilities: {
    type: String,
    required: true,
  },
  preferences: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'close'],
    default: 'active',
  },
  applicationCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  minAge: {
    type: Number,
    min: 0,
    max: 100,
  },
  maxAge: {
    type: Number,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

// Index for better query performance
vacancySchema.index({ companyId: 1, status: 1 });
vacancySchema.index({ departmentId: 1 });
vacancySchema.index({ positionId: 1 });

module.exports = mongoose.model('Vacancy', vacancySchema);

