const mongoose = require('mongoose');

const workScheduleTemplateSchema = new mongoose.Schema({
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
  monday: {
    startTime: { type: String, default: null }, // HH:mm format
    endTime: { type: String, default: null },
    isWorking: { type: Boolean, default: false },
  },
  tuesday: {
    startTime: { type: String, default: null },
    endTime: { type: String, default: null },
    isWorking: { type: Boolean, default: false },
  },
  wednesday: {
    startTime: { type: String, default: null },
    endTime: { type: String, default: null },
    isWorking: { type: Boolean, default: false },
  },
  thursday: {
    startTime: { type: String, default: null },
    endTime: { type: String, default: null },
    isWorking: { type: Boolean, default: false },
  },
  friday: {
    startTime: { type: String, default: null },
    endTime: { type: String, default: null },
    isWorking: { type: Boolean, default: false },
  },
  saturday: {
    startTime: { type: String, default: null },
    endTime: { type: String, default: null },
    isWorking: { type: Boolean, default: false },
  },
  sunday: {
    startTime: { type: String, default: null },
    endTime: { type: String, default: null },
    isWorking: { type: Boolean, default: false },
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Compound index to ensure nom is unique per company
workScheduleTemplateSchema.index({ companyId: 1, nom: 1 }, { unique: true });

module.exports = mongoose.model('WorkScheduleTemplate', workScheduleTemplateSchema);






