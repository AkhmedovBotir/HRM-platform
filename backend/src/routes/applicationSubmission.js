const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationSubmissionController');
const {
  validateUpdateStatus,
} = require('../validators/applicationSubmissionValidator');
const authenticateCompany = require('../middlewares/companyAuth');

// All routes require company authentication
router.use(authenticateCompany);

// Get all applications
router.get('/', getAllApplications);

// Get single application
router.get('/:id', getApplication);

// Update application status
router.patch('/:id/status', validateUpdateStatus, updateApplicationStatus);

// Delete application
router.delete('/:id', deleteApplication);

module.exports = router;





