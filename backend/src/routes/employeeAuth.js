const express = require('express');
const router = express.Router();
const {
  createEmployeeCredentials,
  employeeLogin,
  getEmployeeProfile,
  changePassword,
  resetEmployeePassword,
  updateEmployeeCredentials,
} = require('../controllers/employeeAuthController');
const authenticateCompany = require('../middlewares/companyAuth');
const authenticateEmployee = require('../middlewares/employeeAuth');

// Public route - Employee login
router.post('/login', employeeLogin);

// Protected routes - Employee authenticated
router.get('/profile', authenticateEmployee, getEmployeeProfile);
router.post('/change-password', authenticateEmployee, changePassword);

// Company admin routes
router.post('/create-credentials', authenticateCompany, createEmployeeCredentials);
router.post('/reset-password', authenticateCompany, resetEmployeePassword);
router.put('/update-credentials', authenticateCompany, updateEmployeeCredentials);

module.exports = router;

