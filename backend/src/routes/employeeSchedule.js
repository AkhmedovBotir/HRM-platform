const express = require('express');
const router = express.Router();
const {
  createEmployeeSchedule,
  getAllEmployeeSchedules,
  getEmployeeSchedule,
  updateEmployeeSchedule,
  updateEmployeeScheduleStatus,
  deleteEmployeeSchedule,
} = require('../controllers/employeeScheduleController');
const {
  validateCreateEmployeeSchedule,
  validateUpdateEmployeeSchedule,
  validateUpdateStatus,
} = require('../validators/employeeScheduleValidator');
const authenticateCompany = require('../middlewares/companyAuth');

// All routes require company authentication
router.use(authenticateCompany);

// Create employee schedule
router.post('/', validateCreateEmployeeSchedule, createEmployeeSchedule);

// Get all employee schedules
router.get('/', getAllEmployeeSchedules);

// Get single employee schedule
router.get('/:id', getEmployeeSchedule);

// Update employee schedule
router.put('/:id', validateUpdateEmployeeSchedule, updateEmployeeSchedule);

// Update employee schedule status
router.patch('/:id/status', validateUpdateStatus, updateEmployeeScheduleStatus);

// Delete employee schedule
router.delete('/:id', deleteEmployeeSchedule);

module.exports = router;






