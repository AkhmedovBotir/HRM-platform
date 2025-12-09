const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['text', 'textarea', 'number', 'email', 'phone', 'select', 'radio', 'checkbox', 'date', 'file'],
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: {
    type: [String],
    default: [],
  },
  placeholder: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { _id: true });

const applicationFormSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  vacancyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vacancy',
    required: true,
  },
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  questions: {
    type: [questionSchema],
    required: true,
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Index for better query performance
applicationFormSchema.index({ companyId: 1, vacancyId: 1 });
applicationFormSchema.index({ vacancyId: 1, status: 1 });

// Ensure one form per vacancy
applicationFormSchema.index({ vacancyId: 1 }, { unique: true });

module.exports = mongoose.model('ApplicationForm', applicationFormSchema);





