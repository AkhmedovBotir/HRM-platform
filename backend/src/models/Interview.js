const mongoose = require('mongoose');

// Baholash sxemasi (har bir bosqich uchun)
const evaluationSchema = new mongoose.Schema({
  strengths: {
    type: String,
    trim: true,
  },
  weaknesses: {
    type: String,
    trim: true,
  },
  technicalSkills: {
    score: { type: Number, min: 1, max: 10 },
    comment: { type: String, trim: true },
  },
  communicationSkills: {
    score: { type: Number, min: 1, max: 10 },
    comment: { type: String, trim: true },
  },
  teamwork: {
    score: { type: Number, min: 1, max: 10 },
    comment: { type: String, trim: true },
  },
  overallImpression: {
    score: { type: Number, min: 1, max: 10 },
    comment: { type: String, trim: true },
  },
  evaluatedAt: {
    type: Date,
  },
  evaluatedBy: {
    type: String,
    trim: true,
  },
}, { _id: false });

// Intervyu bosqichi sxemasi
const stageSchema = new mongoose.Schema({
  stageName: {
    type: String,
    required: true,
    trim: true,
  },
  stageOrder: {
    type: Number,
    required: true,
  },
  interviewDate: {
    type: Date,
    required: true,
  },
  interviewTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  location: {
    type: String,
    trim: true,
  },
  interviewer: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  result: {
    type: String,
    enum: ['pending', 'passed', 'failed'],
    default: 'pending',
  },
  evaluation: evaluationSchema,
  completedAt: {
    type: Date,
  },
}, { _id: true });

// Yakuniy qaror sxemasi
const finalDecisionSchema = new mongoose.Schema({
  result: {
    type: String,
    enum: ['pending', 'hired', 'rejected'],
    default: 'pending',
  },
  reason: {
    type: String,
    trim: true,
  },
  responseStatus: {
    type: String,
    enum: ['waiting', 'responded'],
    default: 'waiting',
  },
  respondedAt: {
    type: Date,
  },
  decidedAt: {
    type: Date,
  },
  decidedBy: {
    type: String,
    trim: true,
  },
}, { _id: false });

const interviewSchema = new mongoose.Schema({
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
  applicationSubmissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApplicationSubmission',
    required: true,
  },
  // Joriy bosqich
  currentStage: {
    type: Number,
    default: 1,
  },
  // Barcha bosqichlar
  stages: [stageSchema],
  // Umumiy status
  status: {
    type: String,
    enum: ['in_process', 'completed', 'cancelled'],
    default: 'in_process',
  },
  // Yakuniy qaror
  finalDecision: finalDecisionSchema,
  // Hodim sifatida rasmiylashtirilganda
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
}, {
  timestamps: true,
});

// Indexes
interviewSchema.index({ companyId: 1, vacancyId: 1 });
interviewSchema.index({ applicationSubmissionId: 1 });
interviewSchema.index({ status: 1 });
interviewSchema.index({ 'finalDecision.result': 1 });
interviewSchema.index({ 'stages.interviewDate': 1 });

// Har bir ariza uchun bitta intervyu jarayoni
interviewSchema.index({ applicationSubmissionId: 1 }, { unique: true });

module.exports = mongoose.model('Interview', interviewSchema);
