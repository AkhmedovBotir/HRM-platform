const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { _id: false });

const applicationSubmissionSchema = new mongoose.Schema({
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
  applicationFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApplicationForm',
    required: true,
  },
  answers: {
    type: [answerSchema],
    required: true,
    default: [],
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
  },
  // Ariza manbasi
  source: {
    type: String,
    enum: ['public', 'referral'],
    default: 'public',
  },
  // Referal qilgan xodim
  referralEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  // Referal izohi
  referralNote: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
applicationSubmissionSchema.index({ companyId: 1, vacancyId: 1 });
applicationSubmissionSchema.index({ vacancyId: 1, status: 1 });
applicationSubmissionSchema.index({ applicationFormId: 1 });
applicationSubmissionSchema.index({ source: 1 });
applicationSubmissionSchema.index({ referralEmployeeId: 1 });

module.exports = mongoose.model('ApplicationSubmission', applicationSubmissionSchema);





