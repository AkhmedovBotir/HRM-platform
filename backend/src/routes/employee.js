const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  terminateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateTerminateEmployee,
} = require('../validators/employeeValidator');
const authenticateCompany = require('../middlewares/companyAuth');

// All routes require company authentication
router.use(authenticateCompany);

// Create employee
router.post('/', validateCreateEmployee, createEmployee);

// Get all employees
router.get('/', getAllEmployees);

// Get single employee
router.get('/:id', getEmployee);

// Update employee
router.put('/:id', validateUpdateEmployee, updateEmployee);

// Terminate employee
router.post('/:id/terminate', validateTerminateEmployee, terminateEmployee);

// Delete employee
router.delete('/:id', deleteEmployee);

module.exports = router;

