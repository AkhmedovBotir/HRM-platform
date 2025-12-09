const express = require('express');
const router = express.Router();
const {
  createOrUpdateAttendance,
  getAllAttendances,
  getAttendance,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');
const {
  validateCreateOrUpdateAttendance,
  validateUpdateAttendance,
} = require('../validators/attendanceValidator');
const authenticateCompany = require('../middlewares/companyAuth');

// All routes require company authentication
router.use(authenticateCompany);

// Create or update attendance
router.post('/', validateCreateOrUpdateAttendance, createOrUpdateAttendance);

// Get all attendances
router.get('/', getAllAttendances);

// Get single attendance
router.get('/:id', getAttendance);

// Update attendance
router.put('/:id', validateUpdateAttendance, updateAttendance);

// Delete attendance
router.delete('/:id', deleteAttendance);

module.exports = router;







