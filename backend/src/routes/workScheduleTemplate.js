const express = require('express');
const router = express.Router();
const {
  createTemplate,
  getAllTemplates,
  getTemplate,
  updateTemplate,
  updateTemplateStatus,
  deleteTemplate,
} = require('../controllers/workScheduleTemplateController');
const {
  validateCreateTemplate,
  validateUpdateTemplate,
  validateUpdateStatus,
} = require('../validators/workScheduleTemplateValidator');
const authenticateCompany = require('../middlewares/companyAuth');

// All routes require company authentication
router.use(authenticateCompany);

// Create template
router.post('/', validateCreateTemplate, createTemplate);

// Get all templates
router.get('/', getAllTemplates);

// Get single template
router.get('/:id', getTemplate);

// Update template
router.put('/:id', validateUpdateTemplate, updateTemplate);

// Update template status
router.patch('/:id/status', validateUpdateStatus, updateTemplateStatus);

// Delete template
router.delete('/:id', deleteTemplate);

module.exports = router;






