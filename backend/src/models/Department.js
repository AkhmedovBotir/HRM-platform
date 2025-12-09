const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Compound index to ensure nom is unique per company
departmentSchema.index({ companyId: 1, nom: 1 }, { unique: true });

module.exports = mongoose.model('Department', departmentSchema);







