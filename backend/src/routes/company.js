const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
} = require('../controllers/companyController');
const {
  validateCreateCompany,
  validateUpdateCompany,
  validateLogin,
  validateUpdateStatus,
} = require('../validators/companyValidator');
const authenticate = require('../middlewares/auth');
const authenticateCompany = require('../middlewares/companyAuth');
const companyAdminRoutes = require('./companyAdmin');
const departmentRoutes = require('./department');
const positionRoutes = require('./position');
const employeeRoutes = require('./employee');
const attendanceRoutes = require('./attendance');
const workScheduleTemplateRoutes = require('./workScheduleTemplate');
const employeeScheduleRoutes = require('./employeeSchedule');
const vacancyRoutes = require('./vacancy');
const applicationFormRoutes = require('./applicationForm');
const applicationSubmissionRoutes = require('./applicationSubmission');
const interviewRoutes = require('./interview');

// Public routes (no authentication required)
router.post('/login', validateLogin, login);

// Company authenticated routes
router.get('/me', authenticateCompany, getMe);

// Company admin routes (requires company authentication)
router.use('/admin', companyAdminRoutes);

// Department routes (requires company authentication)
router.use('/department', departmentRoutes);

// Position routes (requires company authentication)
router.use('/position', positionRoutes);

// Employee routes (requires company authentication)
router.use('/employee', employeeRoutes);

// Attendance routes (requires company authentication)
router.use('/attendance', attendanceRoutes);

// Work schedule template routes (requires company authentication)
router.use('/schedule-template', workScheduleTemplateRoutes);

// Employee schedule routes (requires company authentication)
router.use('/employee-schedule', employeeScheduleRoutes);

// Vacancy routes (requires company authentication)
router.use('/vacancy', vacancyRoutes);

// Application form routes (requires company authentication)
router.use('/application-form', applicationFormRoutes);

// Application submission routes (requires company authentication)
router.use('/application', applicationSubmissionRoutes);

// Interview routes (requires company authentication)
router.use('/interview', interviewRoutes);

// Admin authenticated routes (all routes below require admin authentication)
router.use(authenticate);

// Create company
router.post('/', validateCreateCompany, createCompany);

// Get all companies
router.get('/', getAllCompanies);

// Get single company
router.get('/:id', getCompany);

// Update company
router.put('/:id', validateUpdateCompany, updateCompany);

// Update company status
router.patch('/:id/status', validateUpdateStatus, updateCompanyStatus);

// Delete company
router.delete('/:id', deleteCompany);

module.exports = router;

