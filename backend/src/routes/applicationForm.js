const express = require('express');
const router = express.Router();
const {
  createApplicationForm,
  getAllApplicationForms,
  getApplicationForm,
  getApplicationFormByVacancyId,
  updateApplicationForm,
  updateApplicationFormStatus,
  deleteApplicationForm,
} = require('../controllers/applicationFormController');
const {
  validateCreateApplicationForm,
  validateUpdateApplicationForm,
  validateUpdateStatus,
} = require('../validators/applicationFormValidator');
const authenticateCompany = require('../middlewares/companyAuth');

// All routes require company authentication
router.use(authenticateCompany);

// Create application form
router.post('/', validateCreateApplicationForm, createApplicationForm);

// Get all application forms
router.get('/', getAllApplicationForms);

// Get single application form
router.get('/:id', getApplicationForm);

// Update application form
router.put('/:id', validateUpdateApplicationForm, updateApplicationForm);

// Update application form status
router.patch('/:id/status', validateUpdateStatus, updateApplicationFormStatus);

// Delete application form
router.delete('/:id', deleteApplicationForm);

module.exports = router;





