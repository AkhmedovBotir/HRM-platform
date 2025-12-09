const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  INN: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  kompaniyaEgasi: {
    type: String,
    required: true,
    trim: true,
  },
  kompaniyaEgasiTelefon: {
    type: String,
    required: true,
    match: /^\+998\d{9}$/,
    trim: true,
  },
  kompaniyaTelefon: {
    type: String,
    required: true,
    match: /^\+998\d{9}$/,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Hash password before saving
companySchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
companySchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Company', companySchema);

