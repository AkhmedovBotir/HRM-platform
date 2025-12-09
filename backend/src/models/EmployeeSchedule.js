const mongoose = require('mongoose');

const employeeScheduleSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkScheduleTemplate',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Index for efficient queries
employeeScheduleSchema.index({ companyId: 1, employeeId: 1, startDate: 1 });

module.exports = mongoose.model('EmployeeSchedule', employeeScheduleSchema);






